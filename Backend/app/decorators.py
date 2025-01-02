"""
Decorators for custom access control.

This module provides:
- A decorator to ensure that only snippet authors or admin users can access specific routes.
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from app.models import User, Snippet


def snippet_author_or_admin_required(f):
    """
    Restrict route access to snippet authors or admin users.

    This decorator:
    - Checks if the user is authenticated.
    - Ensures the user exists in the database.
    - Validates that the snippet exists.
    - Verifies that the user is either the snippet's author or an admin (any admin role).

    Args:
        f (function): The route function to wrap.

    Returns:
        function: The wrapped route function.
        401: If the user is not authenticated.
        404: If the user or snippet is not found.
        403: If the user is unauthorized to access the resource.
    """
    @wraps(f)
    def decorated_function(snippet_id, *args, **kwargs):
        # Get the current user's ID from the JWT
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({'message': 'Authentication required'}), 401

        # Retrieve the user from the database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Retrieve the snippet from the database
        snippet = Snippet.query.get(snippet_id)
        if not snippet:
            return jsonify({'message': 'Snippet not found'}), 404

        # Check if the user is either the snippet's author or an admin
        if snippet.user_id != user_id and user.role not in ['forum_admin', 'news_admin', 'super_admin']:
            return jsonify({'message': 'Unauthorized'}), 403

        # Proceed with the wrapped function
        return f(snippet_id, *args, **kwargs)

    return decorated_function
