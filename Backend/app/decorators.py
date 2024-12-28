from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User, Snippet
from app import db

def snippet_author_or_admin_required(f):
    @wraps(f)
    def decorated_function(snippet_id, *args, **kwargs):
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({'message': 'Authentication required'}), 401
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        snippet = Snippet.query.get(snippet_id)
        if not snippet:
            return jsonify({'message': 'Snippet not found'}), 404
        if snippet.user_id != user_id and not user.is_admin:
            return jsonify({'message': 'Unauthorized'}), 403
        return f(snippet_id, *args, **kwargs)
    return decorated_function
