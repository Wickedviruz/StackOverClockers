"""
Snippets Blueprint for handling code snippet operations.

This module provides routes for:
- Creating, reading, updating, and deleting code snippets.
- Optional filtering by programming language.
- Access control based on snippet ownership or admin privileges.
"""

# External imports
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

# Internal imports
from app import db
from app.models import Snippet, User
from ..decorators import snippet_author_or_admin_required

# Define the Blueprint
bp = Blueprint('snippets', __name__, url_prefix='/snippets')


@bp.route('', methods=['GET', 'POST'], strict_slashes=False)
@jwt_required(optional=True)
def handle_snippets():
    """
    Handle snippet operations.

    POST:
        - Create a new snippet.
        - Requires title, language, and code as input.
        - User must be authenticated.

    GET:
        - Retrieve all snippets or filter by programming language.
        - Authentication is optional.

    Returns:
        201: Snippet created successfully (POST).
        200: List of snippets (GET).
        400: Missing or invalid input data (POST).
    """
    if request.method == 'POST':
        # Create a new snippet
        data = request.get_json()
        title = data.get('title')
        language = data.get('language')
        code = data.get('code')
        description = data.get('description', '')
        user_id = get_jwt_identity()

        if not title or not language or not code:
            return jsonify({'message': 'Title, language, and code are required'}), 400

        new_snippet = Snippet(title=title, language=language, code=code, description=description, user_id=user_id)
        db.session.add(new_snippet)
        db.session.commit()

        return jsonify({'message': 'Snippet created successfully'}), 201

    elif request.method == 'GET':
        # Retrieve snippets, optionally filtered by language
        language = request.args.get('language')
        query = Snippet.query
        if language:
            query = query.filter_by(language=language)
        snippets = query.order_by(Snippet.created_at.desc()).all()
        result = [{
            'id': snippet.id,
            'title': snippet.title,
            'language': snippet.language,
            'code': snippet.code,
            'description': snippet.description,
            'author': snippet.author.username,
            'created_at': snippet.created_at
        } for snippet in snippets]
        return jsonify(result), 200


@bp.route('/<int:snippet_id>', methods=['GET'], strict_slashes=False)
@jwt_required(optional=True)
def get_snippet(snippet_id):
    """
    Retrieve a specific snippet by its ID.

    Args:
        snippet_id (int): ID of the snippet.

    Returns:
        200: Snippet details.
        404: Snippet not found.
    """
    snippet = Snippet.query.get_or_404(snippet_id)
    result = {
        'id': snippet.id,
        'title': snippet.title,
        'language': snippet.language,
        'code': snippet.code,
        'description': snippet.description,
        'author': snippet.author.username,
        'created_at': snippet.created_at
    }
    return jsonify(result), 200


@bp.route('/<int:snippet_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@snippet_author_or_admin_required
def update_snippet(snippet_id):
    """
    Update a snippet's details.

    - Requires authentication and either snippet ownership or admin privileges.
    - Allows updating title, language, code, or description.

    Args:
        snippet_id (int): ID of the snippet.

    Returns:
        200: Snippet updated successfully.
        404: Snippet not found.
    """
    snippet = Snippet.query.get_or_404(snippet_id)
    data = request.get_json()
    snippet.title = data.get('title', snippet.title)
    snippet.language = data.get('language', snippet.language)
    snippet.code = data.get('code', snippet.code)
    snippet.description = data.get('description', snippet.description)
    db.session.commit()
    return jsonify({'message': 'Snippet updated successfully'}), 200


@bp.route('/<int:snippet_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
@snippet_author_or_admin_required
def delete_snippet(snippet_id):
    """
    Delete a snippet.

    - Requires authentication and either snippet ownership or admin privileges.

    Args:
        snippet_id (int): ID of the snippet.

    Returns:
        200: Snippet deleted successfully.
        404: Snippet not found.
    """
    snippet = Snippet.query.get_or_404(snippet_id)
    db.session.delete(snippet)
    db.session.commit()
    return jsonify({'message': 'Snippet deleted successfully'}), 200
