"""
Forum Blueprint for handling categories, threads, and posts.

This module provides routes for:
- Creating and fetching categories
- Creating and fetching threads
- Managing posts (create, update, delete)
- Admin-restricted actions
"""

# External imports
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

# Internal imports
from .. import db
from app.models import Category, Thread, Post, User

# Define the Blueprint
bp = Blueprint('forum', __name__, url_prefix='/forum')


@bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """
    Create a new category (Admin only).

    Returns:
        201: Category created successfully.
        400: Missing or invalid data.
        403: Unauthorized if the user is not an admin.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({'message': 'Category name is required'}), 400

    if Category.query.filter(func.lower(Category.name) == name.lower()).first():
        return jsonify({'message': 'Category already exists'}), 400

    new_category = Category(name=name, description=description)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        'message': 'Category created successfully',
        'category': {'id': new_category.id, 'name': new_category.name, 'description': new_category.description}
    }), 201


@bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Fetch all categories.

    Returns:
        200: List of all categories.
    """
    categories = Category.query.all()
    result = [{
        'id': category.id,
        'name': category.name,
        'description': category.description,
        'created_at': category.created_at
    } for category in categories]
    return jsonify(result), 200


@bp.route('/categories/<int:category_id>/threads', methods=['POST'])
@jwt_required()
def create_thread(category_id):
    """
    Create a new thread within a category.

    Args:
        category_id (int): ID of the category.

    Returns:
        201: Thread created successfully.
        400: Missing or invalid data.
    """
    data = request.get_json()
    title = data.get('title')

    if not title:
        return jsonify({'message': 'Thread title is required'}), 400

    category = Category.query.get_or_404(category_id)
    user_id = get_jwt_identity()
    new_thread = Thread(title=title, category_id=category.id, user_id=user_id)
    db.session.add(new_thread)
    db.session.commit()

    return jsonify({
        'message': 'Thread created successfully',
        'thread': {'id': new_thread.id, 'title': new_thread.title, 'category_id': new_thread.category_id,
                   'user_id': new_thread.user_id, 'created_at': new_thread.created_at}
    }), 201


@bp.route('/categories/<int:category_id>/threads', methods=['GET'])
def get_threads(category_id):
    """
    Fetch all threads within a category.

    Args:
        category_id (int): ID of the category.

    Returns:
        200: List of threads.
    """
    category = Category.query.get_or_404(category_id)
    threads = Thread.query.filter_by(category_id=category.id).order_by(Thread.created_at.desc()).all()
    result = [{
        'id': thread.id,
        'title': thread.title,
        'category_id': thread.category_id,
        'user_id': thread.user_id,
        'author': thread.author.username,
        'created_at': thread.created_at
    } for thread in threads]
    return jsonify(result), 200


@bp.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread(thread_id):
    """
    Fetch a specific thread and its posts.

    Args:
        thread_id (int): ID of the thread.

    Returns:
        200: Thread details with posts.
    """
    thread = Thread.query.get_or_404(thread_id)
    posts = Post.query.filter_by(thread_id=thread.id).order_by(Post.created_at.asc()).all()
    posts_result = [{
        'id': post.id,
        'content': post.content,
        'thread_id': post.thread_id,
        'user_id': post.user_id,
        'author': post.author.username,
        'created_at': post.created_at
    } for post in posts]
    return jsonify({
        'id': thread.id,
        'title': thread.title,
        'category_id': thread.category_id,
        'user_id': thread.user_id,
        'author': thread.author.username,
        'created_at': thread.created_at,
        'posts': posts_result
    }), 200


@bp.route('/threads/<int:thread_id>/posts', methods=['POST'])
@jwt_required()
def create_post(thread_id):
    """
    Create a new post in a thread.

    Args:
        thread_id (int): ID of the thread.

    Returns:
        201: Post created successfully.
        400: Missing or invalid data.
    """
    thread = Thread.query.get_or_404(thread_id)
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Post content is required'}), 400

    user_id = get_jwt_identity()
    new_post = Post(content=content, thread_id=thread.id, user_id=user_id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        'message': 'Post created successfully',
        'post': {'id': new_post.id, 'content': new_post.content, 'thread_id': new_post.thread_id,
                 'user_id': new_post.user_id, 'created_at': new_post.created_at}
    }), 201


@bp.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """
    Update a post (creator or admin only).

    Args:
        post_id (int): ID of the post.

    Returns:
        200: Post updated successfully.
        400: Missing or invalid data.
        403: Unauthorized if the user is not the creator or an admin.
    """
    post = Post.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if post.user_id != user_id and not user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Post content is required'}), 400

    post.content = content
    db.session.commit()

    return jsonify({
        'message': 'Post updated successfully',
        'post': {'id': post.id, 'content': post.content, 'thread_id': post.thread_id,
                 'user_id': post.user_id, 'created_at': post.created_at}
    }), 200


@bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """
    Delete a post (creator or admin only).

    Args:
        post_id (int): ID of the post.

    Returns:
        200: Post deleted successfully.
        403: Unauthorized if the user is not the creator or an admin.
    """
    post = Post.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if post.user_id != user_id and not user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'Post deleted successfully'}), 200
