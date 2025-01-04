from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import func
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

from .. import db
from ..models import User

bp = Blueprint('auth', __name__, url_prefix='/auth')


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

#=======================================
# Auth section
#=======================================

@bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.

    - Validates input data (email, username, password).
    - Ensures email and username are unique.
    - Hashes the password before storing it in the database.
    - Creates and saves a new user.

    Returns:
        201: User registered successfully.
        400: Missing or invalid input data.
    """
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    accepted_privacy_policy = data.get('accepted_privacy_policy', False)

    if not username or not email or not password or not accepted_privacy_policy:
        return jsonify({'message': 'All fields, including privacy policy acceptance, are required'}), 400

    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters long'}), 400

    username_lower = username.lower()

    if User.query.filter(func.lower(User.username_lower) == username_lower).first():
        return jsonify({'message': 'Username already taken'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        email=email, 
        username=username, 
        username_lower=username_lower, 
        password=hashed_password, 
        accepted_privacy_policy=accepted_privacy_policy
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate a user and provide a JWT token.

    - Validates username and password.
    - Checks credentials against the database.
    - Returns a JWT access token if authentication is successful.

    Returns:
        200: Login successful, returns a JWT token.
        400: Missing or invalid input data.
        401: Invalid credentials.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    user = User.query.filter(func.lower(User.username_lower) == username.lower()).first()

    if user and user.password and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'username': user.username, 'role': user.role}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


#=======================================
# Admin secitons
#=======================================

@bp.route('/admin', methods=['GET'])
@role_required(['super_admin', 'news_admin', 'forum_admin'])
def admin_dashboard():
    """
    Admin dashboard route.

    - Restricted to users with specific admin privileges.
    - Provides a success message for authorized access.

    Returns:
        200: Success message for admins.
        403: Unauthorized access for non-admins.
    """
    return jsonify({'message': 'Welcome, admin!'}), 200


@bp.route('/super-admin', methods=['GET'])
@role_required(['super_admin'])
def super_admin_dashboard():
    """
    Super admin-only dashboard route.

    Returns:
        200: Success message for super admins.
        403: Unauthorized access for non-super-admins.
    """
    return jsonify({'message': 'Welcome, super admin!'}), 200
