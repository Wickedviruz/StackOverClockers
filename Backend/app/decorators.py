from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity

from app.models import User


def resource_author_or_admin_required(model=None, role_check_field='user_id'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                user_id = get_jwt_identity()
                if not user_id:
                    return jsonify({'message': 'Authentication required'}), 401

                user = User.query.get(user_id)
                if not user:
                    return jsonify({'message': 'User not found'}), 404

                if model:
                    resource_id = kwargs.get('resource_id')
                    resource = model.query.get(resource_id)
                    if not resource:
                        return jsonify({'message': f'{model.__name__} not found'}), 404

                    if getattr(resource, role_check_field) != user_id and user.role not in current_app.config.get('ADMIN_ROLES', []):
                        return jsonify({'message': 'Unauthorized'}), 403

                return f(*args, **kwargs)
            except Exception as e:
                current_app.logger.error(f"Error in decorator: {str(e)}")
                return jsonify({'message': 'Internal error'}), 500
        return decorated_function
    return decorator


def is_admin(user):
    return user.role in current_app.config.get('ADMIN_ROLES', [])
