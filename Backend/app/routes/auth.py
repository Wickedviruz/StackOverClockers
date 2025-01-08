from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash

# Internal imports
from app import db
from app.models import User
from app.decorators import role_required
from app.validators import validate_registration, validate_login

# Define the Blueprint
bp = Blueprint('auth', __name__, url_prefix='/auth')


#=======================================
# Auth section
#=======================================

@bp.route('/register', methods=['POST'], endpoint='auth_register')
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

    # Validate registration data using a central validator
    errors = validate_registration(data)
    if errors:
        current_app.logger.warning(f"Registration validation failed: {errors}")
        return jsonify({'message': 'Validation failed', 'errors': errors}), 400

    username_lower = data['username'].lower()

    # Check for username or email duplicates
    if User.query.filter(func.lower(User.username_lower) == username_lower).first():
        return jsonify({'message': 'Username already taken'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400

    # Hash the password and save the new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        email=data['email'],
        username=data['username'],
        username_lower=username_lower,
        password=hashed_password,
        accepted_privacy_policy=data['accepted_privacy_policy']
    )
    db.session.add(new_user)
    db.session.commit()

    current_app.logger.info(f"User {data['username']} registered successfully")
    return jsonify({'message': 'User registered successfully'}), 201


@bp.route('/login', methods=['POST'], endpoint='auth_login')
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

    # Validate login data using a central validator
    errors = validate_login(data)
    if errors:
        current_app.logger.warning(f"Login validation failed: {errors}")
        return jsonify({'message': 'Validation failed', 'errors': errors}), 400

    # Authenticate user
    user = User.query.filter(func.lower(User.username_lower) == data['username'].lower()).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        current_app.logger.info(f"User {user.username} logged in successfully")
        return jsonify({'access_token': access_token, 'username': user.username, 'role': user.role}), 200

    current_app.logger.warning(f"Invalid login attempt for username: {data['username']}")
    return jsonify({'message': 'Invalid credentials'}), 401


#=======================================
# Admin sections
#=======================================

@bp.route('/admin', methods=['GET'], endpoint='auth_admin_dashboard')
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
    current_app.logger.info(f"Admin dashboard accessed by user ID {get_jwt_identity()}")
    return jsonify({'message': 'Welcome, admin!'}), 200


@bp.route('/super-admin', methods=['GET'], endpoint='auth_super_admin_dashboard')
@role_required(['super_admin'])
def super_admin_dashboard():
    """
    Super admin-only dashboard route.

    Returns:
        200: Success message for super admins.
        403: Unauthorized access for non-super-admins.
    """
    current_app.logger.info(f"Super admin dashboard accessed by user ID {get_jwt_identity()}")
    return jsonify({'message': 'Welcome, super admin!'}), 200
