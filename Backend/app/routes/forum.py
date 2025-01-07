from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

# Local imports
from app.decorators import resource_author_or_admin_required
from app.logger import logger
from app import cache
from app import limiter
from ..validators import ThreadSchema, CategorySchema, SubcategorySchema, CommentSchema
from .. import db
from ..models import Category, Subcategory, Thread, Comment

bp = Blueprint('forum', __name__, url_prefix='/forum')


def handle_error(e, custom_message="An error occurred"):
    if isinstance(e, SQLAlchemyError):
        db.session.rollback()
        logger.error(f"Database error: {str(e)}")
        return jsonify({'message': custom_message, 'error': 'Database error'}), 500
    elif isinstance(e, AttributeError):
        logger.error(f"Attribute error: {str(e)}")
        return jsonify({'message': custom_message, 'error': 'Attribute error'}), 400
    else:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': custom_message, 'error': 'Unexpected error'}), 500


@bp.route('/categories', methods=['GET'], endpoint='forum_get_categories')
@cache.cached(timeout=60)
@limiter.limit("10 per minute")
def get_categories():
    """
    Fetch all categories with their subcategories.

    Returns:
        200: A list of categories and their subcategories.
    """
    categories = Category.query.all()
    result = [{
        'id': category.id,
        'name': category.name,
        'subcategories': [{
            'id': subcategory.id,
            'name': subcategory.name
        } for subcategory in category.subcategories]
    } for category in categories]

    return jsonify(result), 200


@bp.route('/threads', methods=['POST'], endpoint='forum_create_thread')
@limiter.limit("5 per minute")
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
    schema = ThreadSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        logger.warning(f"Validation failed: {e.messages}")
        return jsonify({'message': 'Invalid input', 'errors': e.messages}), 400

    user_id = get_jwt_identity()
    try:
        new_thread = Thread(
            title=data['title'],
            content=data['content'],
            subcategory_id=data['subcategory_id'],
            user_id=user_id
        )
        db.session.add(new_thread)
        db.session.commit()

        logger.info(f"User {user_id} created thread {new_thread.id} in subcategory {data['subcategory_id']}")
        return jsonify({'message': 'Thread created successfully', 'thread': {'id': new_thread.id}}), 201
    
    except Exception as e:
        return handle_error(e, "Failed to create thread")


@bp.route('/threads/<int:thread_id>', methods=['GET'], endpoint='forum_get_thread')
@limiter.limit("10 per minute")
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


@bp.route('threads/<int:thread_id>/comments', methods=['POST'], endpoint='forum_create_comment')
@limiter.limit("5 per minute")
@jwt_required()
def create_comment(thread_id):
    """
    Add a comment to a thread.

    Request JSON:
        - content (str): Content of the comment.
        - thread_id (int): ID of the thread.

    Returns:
        201: Comment created successfully.
        400: Missing or invalid data.
    """
    schema = CommentSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        logger.warning(f"Validation failed: {e.messages}")
        return jsonify({'message': 'Invalid input', 'errors': e.messages})
    
    content = data.get('content')
    user_id = get_jwt_identity()

    try:
        logger.info(f"User {user_id} from IP {request.remote_addr} added comment: {content} to {thread_id}")
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

    except Exception as e:
        return handle_error(e, "Failed to Add a comment to a thread")

    


@bp.route('/threads/<int:thread_id>/comments', methods=['GET'], endpoint='forum_get_comments')
@limiter.limit("10 per minute")
def get_comments(thread_id):
    """
    Fetch all comments for a specific thread.

    Args:
        thread_id (int): ID of the thread.

    Returns:
        200: List of comments.
        404: Thread not found.
    """
    try:
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
    
    except Exception as e:
        return handle_error(e, "Failed to Fetch all comments")


@bp.route('/subcategories/<int:subcategory_id>/threads', methods=['GET'], endpoint='forum_get_all_threads')
@limiter.limit("10 per minute")
def get_threads_in_subcategory(subcategory_id):
    """
    Fetch all threads in a specific subcategory.

    Args:
        subcategory_id (int): ID of the subcategory.

    Returns:
        200: List of threads.
        404: Subcategory not found.
    """
    try:
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
    
    except Exception as e:
        return handle_error(e, "Failed to Fetch all threads")

@bp.route('/latest', methods=['GET'], endpoint='forum_get_latest_posts')
@limiter.limit("10 per minute")
def get_latest_threads():
    """
    Fetch the 5 latest threads in all categorys.


    Returns:
    200: List of latest threads
    400: Bad request if the request is invalid.
    500: Internal server error if something goes wrong on the server.
    """
    try:
        threads= Thread.query.order_by(Thread.created_at.desc()).limit(5).all()

        if not threads:
            logger.warning("No threads found.")
            return jsonify({'message': 'No threads found'}),404

        result =[
            {
                "id": thread.id,
                "title": thread.title,
                "created_at": thread.created_at
            }
            for thread in threads
        ]

        return jsonify(result), 200
    
    except Exception as e:
        return handle_error(e, "Failed to Fetch the 5 latest threads")

@bp.route('/categories', methods=['POST'], endpoint='forum_create_category')
@limiter.limit("10 per minute")
@resource_author_or_admin_required
def create_category():
    """
    Create a new forum category.

    Request JSON:
     - name (str) : name of the category

    Returns:
        201: Category created successfully
        400: Missing or invalid data.
    """
    schema = CategorySchema()

    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        logger.warning(f"")
        return jsonify({'message': 'Invalid input', 'errors': e.messages}), 400
    
    name = data.get('name')

    if Category.query.filter_by(name=name).first():
        logger.warning(f"Category with name '{name}' already exists")
        return jsonify({'message': 'Category already exists'}), 400

    try:
        new_category = Category(name=name)
        db.session.add(new_category)
        db.session.commit()

        logger.info(f"New category '{name}' created with ID {new_category.id}")
        return jsonify({
            'message': 'Category created successfully',
            'category': {'id': new_category.id, 'name': new_category.name}}), 201
    
    except Exception as e:
        return handle_error(e, "Failed to Create a new forum category")

@bp.route('/categories/<int:category_id>/subcategories', methods=['POST'], endpoint='forum_create_subcategory')
@limiter.limit("10 per minute")
@resource_author_or_admin_required
def create_subcategory(category_id):
    """
    Create a new subcategory under a specific category.

    Request JSON:
        - name (str): Name of the subcategory.

    Returns:
        201: Subcategory created successfully.
        400: Missing or invalid data.
        404: Category not found.
    """
    schema = SubcategorySchema()
    try:
        # Validate the input data
        data = schema.load(request.get_json())
    except ValidationError as e:
        logger.warning(f"Validation failed for subcategory creation: {e.messages}")
        return jsonify({'message': 'Invalid input', 'errors': e.messages}), 400

    try:
        # Ensure the category exists
        category = Category.query.get_or_404(category_id)

        # Check for duplicate subcategory name
        if Subcategory.query.filter_by(name=data['name'], category_id=category.id).first():
            logger.warning(f"Duplicate subcategory name '{data['name']}' in category {category_id}")
            return jsonify({'message': 'Subcategory already exists in this category'}), 400

        # Create the new subcategory
        new_subcategory = Subcategory(name=data['name'], category_id=category.id)
        db.session.add(new_subcategory)
        db.session.commit()

        logger.info(f"Subcategory '{new_subcategory.name}' created in category {category_id} with ID {new_subcategory.id}")
        return jsonify({
            'message': 'Subcategory created successfully',
            'subcategory': {'id': new_subcategory.id, 'name': new_subcategory.name}
        }), 201
    
    except Exception as e:
        return handle_error(e, "Failed to Create a new subcategory")