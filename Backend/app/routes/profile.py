from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from .. import db
from ..models import User

bp = Blueprint('profile', __name__, url_prefix='/profile')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('', methods=['GET'], endpoint='get_profile')
@jwt_required()
def get_profile():
    """
    Retrieve the current user's profile.

    Returns:
        200: User profile data.
        404: User not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        current_app.logger.warning(f"User with ID {user_id} not found.")
        return jsonify({'message': 'User not found'}), 404
    
    profile_picture_url = f"{request.url_root}uploads/{user.profile_picture}"

    current_app.logger.info(f"Profile data retrieved for user {user.username}.")
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'displayName': user.display_name,
        'title': user.title,
        'location': user.location,
        'aboutMe': user.about_me,
        'profile_picture': profile_picture_url,
        'website': user.website,
        'twitter': user.twitter,
        'github': user.github,
        'role': user.role,
        'createdAt': user.created_at,
        'lastSeen': user.last_seen
    }), 200


@bp.route('/users/<string:username>', methods=['GET'], endpoint='get_user_profile')
def get_user_profile(username):
    """
    Retrieve the profile of a specific user by username.

    Args:
        username (str): The username of the user.

    Returns:
        200: User profile data.
        404: User not found.
    """
    user = User.query.filter_by(username=username).first()
    if not user:
        current_app.logger.warning(f"User with username '{username}' not found.")
        return jsonify({'message': 'User not found'}), 404

    current_app.logger.info(f"Profile data retrieved for user {username}.")
    return jsonify({
        'id': user.id,
        'username': user.username,
        'displayName': user.display_name,
        'title': user.title,
        'location': user.location,
        'aboutMe': user.about_me,
        'website': user.website,
        'twitter': user.twitter,
        'github': user.github,
        'role': user.role,
        'createdAt': user.created_at,
        'lastSeen': user.last_seen
    }), 200


@bp.route('/users/<string:username>', methods=['PUT'], endpoint='update_user_profile')
@jwt_required()
def update_user_profile(username):
    """
    Update the current user's profile.

    Args:
        username (str): The username of the user being updated.

    Returns:
        200: Profile updated successfully.
        400: Missing or invalid input.
        404: User not found or unauthorized.
    """
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id, username=username).first()
    if not user:
        current_app.logger.warning(f"Unauthorized profile update attempt by user ID {user_id}.")
        return jsonify({'message': 'User not found or unauthorized'}), 404

    data = request.get_json()

    # Update profile fields
    user.display_name = data.get('displayName', user.display_name)
    user.title = data.get('title', user.title)
    user.location = data.get('location', user.location)
    user.about_me = data.get('aboutMe', user.about_me)
    user.website = data.get('website', user.website)
    user.twitter = data.get('twitter', user.twitter)
    user.github = data.get('github', user.github)

    # Field validation
    if len(user.display_name) > 50:
        current_app.logger.warning(f"Display name exceeds 50 characters for user {user.username}.")
        return jsonify({'message': 'Display name cannot exceed 50 characters'}), 400

    if user.website and not user.website.startswith(('http://', 'https://')):
        current_app.logger.warning(f"Invalid website URL for user {user.username}.")
        return jsonify({'message': 'Website must start with http:// or https://'}), 400

    # Commit changes
    db.session.commit()

    current_app.logger.info(f"Profile updated successfully for user {user.username}.")
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'displayName': user.display_name,
            'title': user.title,
            'location': user.location,
            'aboutMe': user.about_me,
            'website': user.website,
            'twitter': user.twitter,
            'github': user.github
        }
    }), 200

@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    """
    Endpoint to upload a profile picture for the current user.
    """
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Uppdatera användarens profilbild
        user.profile_picture = filename
        db.session.commit()

        return jsonify({'message': 'Profile picture uploaded successfully', 'profile_picture': filename}), 200

    return jsonify({'message': 'Invalid file type'}), 400