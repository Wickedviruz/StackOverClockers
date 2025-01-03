from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from .. import db
from ..models import Category, Subcategory, Thread, Comment, User

bp = Blueprint('forum', __name__, url_prefix='/forum')


@bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Fetch all categories with their subcategories.

    Returns:
        200: A list of categories and their subcategories.
    """
    categories = Category.query.all()
    print(f"Categories from DB: {categories}")
    result = [{
        'id': category.id,
        'name': category.name,
        'subcategories': [{
            'id': subcategory.id,
            'name': subcategory.name
        } for subcategory in category.subcategories]
    } for category in categories]

    print(f"Serialized categories: {result}")
    return jsonify(result), 200


@bp.route('/threads', methods=['POST'])
@jwt_required()
def create_thread():
    """
    Create a new thread in a subcategory.

    Request JSON:
        - title (str): Title of the thread.
        - content (str): Content of the thread.
        - subcategory_id (int): ID of the subcategory.

    Returns:
        201: Thread created successfully.
        400: Missing or invalid data.
    """
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    subcategory_id = data.get('subcategory_id')

    if not title or not content or not subcategory_id:
        return jsonify({'message': 'Title, content, and subcategory_id are required'}), 400

    user_id = get_jwt_identity()
    new_thread = Thread(title=title, content=content, user_id=user_id, subcategory_id=subcategory_id)
    db.session.add(new_thread)
    db.session.commit()

    return jsonify({
        'message': 'Thread created successfully',
        'thread': {
            'id': new_thread.id,
            'title': new_thread.title,
            'content': new_thread.content,
            'created_at': new_thread.created_at,
            'subcategory_id': new_thread.subcategory_id,
            'user_id': new_thread.user_id
        }
    }), 201


@bp.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread(thread_id):
    """
    Fetch a specific thread with its comments.

    Args:
        thread_id (int): ID of the thread.

    Returns:
        200: Thread details and its comments.
        404: Thread not found.
    """
    thread = Thread.query.get_or_404(thread_id)

    result = {
        'id': thread.id,
        'title': thread.title,
        'content': thread.content,
        'created_at': thread.created_at,
        'author': {
            'id': thread.author.id,
            'username': thread.author.username
        },
        'comments': [{
            'id': comment.id,
            'content': comment.content,
            'created_at': comment.created_at,
            'author': {
                'id': comment.author.id,
                'username': comment.author.username
            }
        } for comment in thread.comments]
    }

    return jsonify(result), 200


@bp.route('/comments', methods=['POST'])
@jwt_required()
def create_comment():
    """
    Add a comment to a thread.

    Request JSON:
        - content (str): Content of the comment.
        - thread_id (int): ID of the thread.

    Returns:
        201: Comment created successfully.
        400: Missing or invalid data.
    """
    data = request.get_json()
    content = data.get('content')
    thread_id = data.get('thread_id')

    if not content or not thread_id:
        return jsonify({'message': 'Content and thread_id are required'}), 400

    user_id = get_jwt_identity()
    new_comment = Comment(content=content, user_id=user_id, thread_id=thread_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        'message': 'Comment created successfully',
        'comment': {
            'id': new_comment.id,
            'content': new_comment.content,
            'created_at': new_comment.created_at,
            'thread_id': new_comment.thread_id,
            'user_id': new_comment.user_id
        }
    }), 201


@bp.route('/threads/<int:thread_id>/comments', methods=['GET'])
def get_comments(thread_id):
    """
    Fetch all comments for a specific thread.

    Args:
        thread_id (int): ID of the thread.

    Returns:
        200: List of comments.
        404: Thread not found.
    """
    thread = Thread.query.get_or_404(thread_id)
    comments = Comment.query.filter_by(thread_id=thread.id).order_by(Comment.created_at.asc()).all()

    result = [{
        'id': comment.id,
        'content': comment.content,
        'created_at': comment.created_at,
        'author': {
            'id': comment.author.id,
            'username': comment.author.username
        }
    } for comment in comments]

    return jsonify(result), 200


@bp.route('/subcategories/<int:subcategory_id>/threads', methods=['GET'])
def get_threads_in_subcategory(subcategory_id):
    """
    Fetch all threads in a specific subcategory.

    Args:
        subcategory_id (int): ID of the subcategory.

    Returns:
        200: List of threads.
        404: Subcategory not found.
    """
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    threads = Thread.query.filter_by(subcategory_id=subcategory.id).order_by(Thread.created_at.desc()).all()

    result = [{
        'id': thread.id,
        'title': thread.title,
        'content': thread.content,
        'created_at': thread.created_at,
        'author': {
            'id': thread.author.id,
            'username': thread.author.username
        }
    } for thread in threads]

    return jsonify(result), 200


def forum_admin_required(fn):
    """
    Restrict access to forum admins or super admins only.
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role not in ['forum_admin', 'super_admin']:
            return jsonify({'message': 'Admins only!'}), 403
        return fn(*args, **kwargs)
    return wrapper

@bp.route('/categories', methods=['POST'])
@forum_admin_required
def create_category():
    """
    Create a new forum category.
    """
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'message': 'Category name is required'}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({'message': 'Category already exists'}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Category created successfully', 'category': {'id': new_category.id, 'name': new_category.name}}), 201

@bp.route('/categories/<int:category_id>/subcategories', methods=['POST'])
@forum_admin_required
def create_subcategory(category_id):
    """
    Create a new subcategory under a specific category.
    """
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'message': 'Subcategory name is required'}), 400

    category = Category.query.get_or_404(category_id)

    if Subcategory.query.filter_by(name=name, category_id=category.id).first():
        return jsonify({'message': 'Subcategory already exists in this category'}), 400

    new_subcategory = Subcategory(name=name, category_id=category.id)
    db.session.add(new_subcategory)
    db.session.commit()

    return jsonify({'message': 'Subcategory created successfully', 'subcategory': {'id': new_subcategory.id, 'name': new_subcategory.name}}), 201