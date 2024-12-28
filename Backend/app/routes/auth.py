"""
Authentication Blueprint for user registration, login, and admin access.

This module provides:
- User registration functionality.
- User login functionality with JWT authentication.
- Admin-restricted access routes.
"""

# External imports
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import func
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

# Internal imports
from .. import db
from ..models import User

# Define the Blueprint
bp = Blueprint('auth', __name__, url_prefix='/auth')


def admin_required(fn):
    """
    Restrict access to admin users only.

    Decorator that:
    - Requires a valid JWT token.
    - Checks if the user associated with the token is an admin.

    Args:
        fn (function): The route function to wrap.

    Returns:
        function: The wrapped route function, restricted to admins.
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'message': 'Admins only!'}), 403
        return fn(*args, **kwargs)
    return wrapper


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

    if not username:
        return jsonify({'message': 'Username is required'}), 400

    username_lower = username.lower()

    if User.query.filter(func.lower(User.username_lower) == username_lower).first():
        return jsonify({'message': 'Username already taken'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, username=username, username_lower=username_lower, password=hashed_password)
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
        return jsonify({'access_token': access_token, 'username': user.username}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@bp.route('/admin', methods=['GET'])
@admin_required
def admin_dashboard():
    """
    Admin dashboard route.

    - Restricted to users with admin privileges.
    - Provides a success message for authorized access.

    Returns:
        200: Success message for admins.
        403: Unauthorized access for non-admins.
    """
    return jsonify({'message': 'Welcome, admin!'}), 200
