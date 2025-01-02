from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from .. import db
from app.models import News, User, Comment

bp = Blueprint('news', __name__, url_prefix='/news')


def news_admin_required(fn):
    """
    Restrict access to news admins or super admins only.
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role not in ['news_admin', 'super_admin']:
            return jsonify({'message': 'Admins only!'}), 403
        return fn(*args, **kwargs)
    return wrapper


@bp.route('/', methods=['POST'])
@news_admin_required
def create_news():
    """
    Create a new news article.
    """
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({'message': 'Title and content are required'}), 400

    user_id = get_jwt_identity()
    new_news = News(title=title, content=content, user_id=user_id)
    db.session.add(new_news)
    db.session.commit()

    return jsonify({
        'message': 'News article created successfully',
        'news': {'id': new_news.id, 'title': new_news.title, 'content': new_news.content, 'created_at': new_news.created_at}
    }), 201


@bp.route('/<int:news_id>', methods=['PUT'])
@news_admin_required
def update_news(news_id):
    """
    Update a news article.
    """
    news = News.query.get_or_404(news_id)
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({'message': 'Title and content are required'}), 400

    news.title = title
    news.content = content
    db.session.commit()

    return jsonify({
        'message': 'News article updated successfully',
        'news': {'id': news.id, 'title': news.title, 'content': news.content, 'created_at': news.created_at}
    }), 200


@bp.route('/', methods=['GET'])
def get_all_news():
    """
    Fetch all news articles with optional pagination.
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

    return jsonify({
        'news': result,
        'total': news_pagination.total,
        'page': news_pagination.page,
        'pages': news_pagination.pages
    }), 200


@bp.route('/<int:news_id>', methods=['GET'])
def get_news_by_id(news_id):
    """
    Fetch a single news article by ID.
    """
    news = News.query.get_or_404(news_id)
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


@bp.route('/<int:news_id>', methods=['DELETE'])
@news_admin_required
def delete_news(news_id):
    """
    Delete a news article.
    """
    news = News.query.get_or_404(news_id)
    db.session.delete(news)
    db.session.commit()
    return jsonify({'message': 'News article deleted successfully'}), 200

@bp.route('/<int:news_id>/comments', methods=['POST'])
@jwt_required()
def create_comment_in_news(news_id):
    """
    Add a comment to a news article.

    Args:
        news_id (int): ID of the news article.

    Returns:
        201: Comment created successfully.
        404: News article not found.
    """
    news = News.query.get_or_404(news_id)
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Comment content is required'}), 400

    user_id = get_jwt_identity()
    new_comment = Comment(content=content, user_id=user_id, news_id=news.id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        'message': 'Comment created successfully',
        'comment': {
            'id': new_comment.id,
            'content': new_comment.content,
            'author': new_comment.author.username,
            'created_at': new_comment.created_at
        }
    }), 201

@bp.route('/<int:news_id>/comments', methods=['GET'])
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

    return jsonify(result), 200
