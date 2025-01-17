from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from .. import db
from app.models import News, User, Comment
from app.decorators import news_admin_required
from app import limiter

bp = Blueprint('news', __name__, url_prefix='/news')


#=======================================
# News Endpoints
#=======================================
@bp.route('', methods=['POST'], endpoint='create_news')
@news_admin_required
@limiter.limit("5 per minute")
def create_news():
    """
    Create a new news article.

    Request JSON:
        - title (str): Title of the news article.
        - content (str): Content of the news article.

    Returns:
        201: News article created successfully.
        400: Missing or invalid input.
    """
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        current_app.logger.warning("Title and content are required for creating news.")
        return jsonify({'message': 'Title and content are required'}), 400

    user_id = get_jwt_identity()
    new_news = News(title=title, content=content, user_id=user_id)
    db.session.add(new_news)
    db.session.commit()

    current_app.logger.info(f"News article '{title}' created by user ID {user_id}")
    return jsonify({
        'message': 'News article created successfully',
        'news': {'id': new_news.id, 'title': new_news.title, 'content': new_news.content, 'created_at': new_news.created_at}
    }), 201


@bp.route('/<int:news_id>', methods=['PUT'], endpoint='update_news')
@news_admin_required
@limiter.limit("5 per minute")
def update_news(news_id):
    """
    Update a news article.

    Request JSON:
        - title (str): Updated title of the news article.
        - content (str): Updated content of the news article.

    Returns:
        200: News article updated successfully.
        404: News article not found.
        400: Missing or invalid input.
    """
    news = News.query.get_or_404(news_id)
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        current_app.logger.warning(f"Update failed for news ID {news_id}: Missing title or content.")
        return jsonify({'message': 'Title and content are required'}), 400

    news.title = title
    news.content = content
    db.session.commit()

    current_app.logger.info(f"News article ID {news_id} updated successfully.")
    return jsonify({
        'message': 'News article updated successfully',
        'news': {'id': news.id, 'title': news.title, 'content': news.content, 'created_at': news.created_at}
    }), 200


@bp.route('', methods=['GET'], endpoint='get_all_news')
@limiter.limit("10 per minute")
def get_all_news():
    """
    Fetch all news articles with optional pagination.

    Query Parameters:
        - page (int): Page number for pagination.
        - per_page (int): Number of items per page.

    Returns:
        200: List of news articles with pagination metadata.
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    news_query = News.query.order_by(News.created_at.desc())
    news_pagination = news_query.paginate(page=page, per_page=per_page, error_out=False)

    result = [{
        'id': n.id,
        'title': n.title,
        'content': n.content,
        'author': {
            'id': n.user_id,
            'username': n.author.username
        },
        'created_at': n.created_at
    } for n in news_pagination.items]

    current_app.logger.info("Fetched news articles with pagination.")
    return jsonify({
        'news': result,
        'total': news_pagination.total,
        'page': news_pagination.page,
        'pages': news_pagination.pages
    }), 200


@bp.route('/<int:news_id>', methods=['GET'], endpoint='get_news_by_id')
@limiter.limit("10 per minute")
def get_news_by_id(news_id):
    """
    Fetch a single news article by ID.

    Args:
        news_id (int): ID of the news article.

    Returns:
        200: News article details.
        404: News article not found.
    """
    news = News.query.get_or_404(news_id)

    current_app.logger.info(f"Fetched news article ID {news_id}.")
    return jsonify({
        'id': news.id,
        'title': news.title,
        'content': news.content,
        'author': {
            'id': news.user_id,
            'username': news.author.username
        },
        'created_at': news.created_at
    }), 200


@bp.route('/<int:news_id>', methods=['DELETE'], endpoint='delete_news')
@news_admin_required
@limiter.limit("5 per minute")
def delete_news(news_id):
    """
    Delete a news article.

    Args:
        news_id (int): ID of the news article.

    Returns:
        200: News article deleted successfully.
        404: News article not found.
    """
    news = News.query.get_or_404(news_id)
    db.session.delete(news)
    db.session.commit()

    current_app.logger.info(f"News article ID {news_id} deleted successfully.")
    return jsonify({'message': 'News article deleted successfully'}), 200


#=======================================
# Comment Endpoints for News
#=======================================
@bp.route('/<int:news_id>/comments', methods=['POST'], endpoint='create_comment_in_news')
@jwt_required()
@limiter.limit("5 per minute")
def create_comment_in_news(news_id):
    """
    Add a comment to a news article.

    Request JSON:
        - content (str): Content of the comment.

    Args:
        news_id (int): ID of the news article.

    Returns:
        201: Comment created successfully.
        400: Missing or invalid input.
        404: News article not found.
    """
    news = News.query.get_or_404(news_id)
    data = request.get_json()
    content = data.get('content')

    if not content:
        current_app.logger.warning(f"Comment creation failed for news ID {news_id}: Missing content.")
        return jsonify({'message': 'Comment content is required'}), 400

    user_id = get_jwt_identity()
    new_comment = Comment(content=content, user_id=user_id, news_id=news.id)
    db.session.add(new_comment)
    db.session.commit()

    current_app.logger.info(f"Comment created on news ID {news_id} by user ID {user_id}.")
    return jsonify({
        'message': 'Comment created successfully',
        'comment': {
            'id': new_comment.id,
            'content': new_comment.content,
            'author': new_comment.author.username,
            'created_at': new_comment.created_at
        }
    }), 201


@bp.route('/<int:news_id>/comments', methods=['GET'], endpoint='get_comments_in_news')
@limiter.limit("10 per minute")
def get_comments_in_news(news_id):
    """
    Fetch all comments in a news article.

    Args:
        news_id (int): ID of the news article.

    Returns:
        200: List of comments.
    """
    news = News.query.get_or_404(news_id)
    comments = Comment.query.filter_by(news_id=news.id).order_by(Comment.created_at.asc()).all()

    result = [{
        'id': comment.id,
        'content': comment.content,
        'author': comment.author.username,
        'created_at': comment.created_at
    } for comment in comments]

    current_app.logger.info(f"Fetched comments for news ID {news_id}.")
    return jsonify(result), 200
