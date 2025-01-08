from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import User


#=======================================
# Decorator: Resource Author or Admin Required
#=======================================
def resource_author_or_admin_required(model=None, role_check_field='user_id'):
    """
    Restrict access to a resource based on ownership or admin role.
    
    Args:
        model (db.Model): The database model to check ownership against.
        role_check_field (str): The field on the model that represents the owner's ID.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({'message': 'Authentication required'}), 401

            user = User.query.get(user_id)
            if not user:
                return jsonify({'message': 'User not found'}), 404

            # Check resource permissions
            if model:
                resource_id = kwargs.get('resource_id')
                resource = model.query.get(resource_id)
                if not resource:
                    return jsonify({'message': f'{model.__name__} not found'}), 404

                if getattr(resource, role_check_field) != user_id and not is_admin(user):
                    return jsonify({'message': 'Unauthorized'}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator


#=======================================
# Helper: Check If User is Admin
#=======================================
def is_admin(user):
    """
    Check if the user has an admin role.

    Args:
        user (User): The user object.

    Returns:
        bool: True if the user is an admin, False otherwise.
    """
    return user.role in current_app.config.get('ADMIN_ROLES', [])


#=======================================
# Decorator: News Admin Access Required
#=======================================
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
            current_app.logger.warning(f"Unauthorized access attempt by user ID {user_id}")
            return jsonify({'message': 'Admins only!'}), 403
        return fn(*args, **kwargs)
    return wrapper


def role_required(roles):
    """
    Restrict access to specific user roles.

    Args:
        roles (list): List of allowed roles.

    Returns:
        function: Decorator for role-based access control.
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role not in roles:
                return jsonify({'message': 'Access denied'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
