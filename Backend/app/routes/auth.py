from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import func
from .. import db
from ..models import User
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('auth', __name__, url_prefix='/auth')

def admin_required(fn):
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
    return jsonify({'message': 'Welcome, admin!'}), 200
