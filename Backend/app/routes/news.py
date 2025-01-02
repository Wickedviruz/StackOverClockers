from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from .. import db
from app.models import News, User

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


@bp.route('/', methods=['GET'])
def get_all_news():
    """
    Fetch all news articles.
    """
    news = News.query.order_by(News.created_at.desc()).all()
    result = [{
        'id': n.id,
        'title': n.title,
        'content': n.content,
        'author': n.author.username,
        'created_at': n.created_at
    } for n in news]
    return jsonify(result), 200


@bp.route('/<int:news_id>', methods=['GET'])
def get_news(news_id):
    """
    Fetch a specific news article.
    """
    news = News.query.get_or_404(news_id)
    return jsonify({
        'id': news.id,
        'title': news.title,
        'content': news.content,
        'author': news.author.username,
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
