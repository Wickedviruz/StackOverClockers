from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Category, Thread, Post, User
from sqlalchemy import func

bp = Blueprint('forum', __name__, url_prefix='/forum')

# Skapa en ny kategori (Admin endast)
@bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
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

    return jsonify({'message': 'Category created successfully', 'category': {'id': new_category.id, 'name': new_category.name, 'description': new_category.description}}), 201

# Hämta alla kategorier
@bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    result = []
    for category in categories:
        result.append({
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'created_at': category.created_at
        })
    return jsonify(result), 200

# Skapa en ny tråd inom en kategori
@bp.route('/categories/<int:category_id>/threads', methods=['POST'])
@jwt_required()
def create_thread(category_id):
    data = request.get_json()
    title = data.get('title')

    if not title:
        return jsonify({'message': 'Thread title is required'}), 400

    category = Category.query.get_or_404(category_id)

    user_id = get_jwt_identity()
    new_thread = Thread(title=title, category_id=category.id, user_id=user_id)
    db.session.add(new_thread)
    db.session.commit()

    return jsonify({'message': 'Thread created successfully', 'thread': {'id': new_thread.id, 'title': new_thread.title, 'category_id': new_thread.category_id, 'user_id': new_thread.user_id, 'created_at': new_thread.created_at}}), 201

# Hämta alla trådar inom en kategori
@bp.route('/categories/<int:category_id>/threads', methods=['GET'])
def get_threads(category_id):
    category = Category.query.get_or_404(category_id)
    threads = Thread.query.filter_by(category_id=category.id).order_by(Thread.created_at.desc()).all()
    result = []
    for thread in threads:
        result.append({
            'id': thread.id,
            'title': thread.title,
            'category_id': thread.category_id,
            'user_id': thread.user_id,
            'author': thread.author.username,
            'created_at': thread.created_at
        })
    return jsonify(result), 200

# Hämta en specifik tråd och dess inlägg
@bp.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread(thread_id):
    thread = Thread.query.get_or_404(thread_id)
    posts = Post.query.filter_by(thread_id=thread.id).order_by(Post.created_at.asc()).all()
    posts_result = []
    for post in posts:
        posts_result.append({
            'id': post.id,
            'content': post.content,
            'thread_id': post.thread_id,
            'user_id': post.user_id,
            'author': post.author.username,
            'created_at': post.created_at
        })
    return jsonify({
        'id': thread.id,
        'title': thread.title,
        'category_id': thread.category_id,
        'user_id': thread.user_id,
        'author': thread.author.username,
        'created_at': thread.created_at,
        'posts': posts_result
    }), 200

# Skapa ett nytt inlägg i en tråd
@bp.route('/threads/<int:thread_id>/posts', methods=['POST'])
@jwt_required()
def create_post(thread_id):
    thread = Thread.query.get_or_404(thread_id)
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Post content is required'}), 400

    user_id = get_jwt_identity()
    new_post = Post(content=content, thread_id=thread.id, user_id=user_id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully', 'post': {'id': new_post.id, 'content': new_post.content, 'thread_id': new_post.thread_id, 'user_id': new_post.user_id, 'created_at': new_post.created_at}}), 201

# Uppdatera ett inlägg (endast skaparen eller admin)
@bp.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
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

    return jsonify({'message': 'Post updated successfully', 'post': {'id': post.id, 'content': post.content, 'thread_id': post.thread_id, 'user_id': post.user_id, 'created_at': post.created_at}}), 200

# Ta bort ett inlägg (endast skaparen eller admin)
@bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if post.user_id != user_id and not user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'Post deleted successfully'}), 200
