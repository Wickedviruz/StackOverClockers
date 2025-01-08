from flask import Blueprint, current_app, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.decorators import resource_author_or_admin_required
from app import db, cache, limiter
from app.models import Snippet
from ..validators import SnippetsSchema

# Define the Blueprint
bp = Blueprint('snippets', __name__, url_prefix='/snippets')


@bp.route('', methods=['GET'], strict_slashes=False, endpoint='get_snippets')
@cache.cached(timeout=60)
@limiter.limit("10 per minute")
def get_snippets():
    """
    Retrieve all snippets or filter by programming language.

    Args (optional):
        language (str): Programming language to filter by.

    Returns:
        200: List of snippets.
    """
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


@bp.route('', methods=['POST'], strict_slashes=False, endpoint='post_snippet')
@limiter.limit("5 per minute")
@jwt_required()
def post_snippet():
    """
    Create a new snippet.

    Request JSON:
        - title (str): Title of the snippet.
        - language (str): Programming language of the snippet.
        - code (str): Code of the snippet.
        - description (str, optional): Description of the snippet.

    Returns:
        201: Snippet created successfully.
        400: Missing or invalid input data.
    """
    schema = SnippetsSchema()
    data = schema.load(request.get_json())

    user_id = get_jwt_identity()
    new_snippet = Snippet(
        title=data['title'],
        language=data['language'],
        code=data['code'],
        description=data.get('description', ''),
        user_id=user_id
    )
    db.session.add(new_snippet)
    db.session.commit()

    current_app.logger.info(f"User {user_id} created snippet {new_snippet.id}")
    return jsonify({'message': 'Snippet created successfully', 'snippet': {'id': new_snippet.id}}), 201


@bp.route('/<int:snippet_id>', methods=['GET'], strict_slashes=False, endpoint='get_snippet')
@cache.cached(timeout=60)
@limiter.limit("10 per minute")
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


@bp.route('/<int:snippet_id>', methods=['PUT'], strict_slashes=False, endpoint='update_snippet')
@limiter.limit("5 per minute")
@jwt_required()
@resource_author_or_admin_required(model=Snippet)
def update_snippet(snippet_id):
    """
    Update a snippet's details.

    Request JSON:
        - title (str, optional): New title for the snippet.
        - language (str, optional): New programming language.
        - code (str, optional): Updated code.
        - description (str, optional): Updated description.

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

    current_app.logger.info(f"Snippet {snippet_id} updated by user {get_jwt_identity()}")
    return jsonify({'message': 'Snippet updated successfully'}), 200


@bp.route('/<int:snippet_id>', methods=['DELETE'], strict_slashes=False, endpoint='delete_snippet')
@limiter.limit("5 per minute")
@jwt_required()
@resource_author_or_admin_required(model=Snippet)
def delete_snippet(snippet_id):
    """
    Delete a snippet.

    Args:
        snippet_id (int): ID of the snippet.

    Returns:
        200: Snippet deleted successfully.
        404: Snippet not found.
    """
    snippet = Snippet.query.get_or_404(snippet_id)
    db.session.delete(snippet)
    db.session.commit()

    current_app.logger.info(f"Snippet {snippet_id} deleted by user {get_jwt_identity()}")
    return jsonify({'message': 'Snippet deleted successfully'}), 200
