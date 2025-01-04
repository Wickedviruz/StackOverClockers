from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from .. import db
from ..models import User


bp = Blueprint('profile', __name__, url_prefix='/profile')

#=======================================
# Profile section
#=======================================

@bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    """
    Get the current user's profile.

    Returns:
        200: User profile data.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    print(user)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
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

@bp.route('/users/<string:username>', methods=['GET', 'OPTIONS'])
def getprofile(username):
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight passed'}), 200
    """
    Get the profile of a specific user by username.
    """
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    print(user)
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


@bp.route('/users/<string:username>', methods=['PUT'])
@jwt_required()
def update_profile(username):
    """
    Update the current user's profile.

    Returns:
        200: Profile updated successfully.
        400: Missing or invalid input.
        404: User not found.
    """
    # Kontrollera om den inloggade användaren matchar den uppdaterade användaren
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id, username=username).first()
    if not user:
        return jsonify({'message': 'User not found or unauthorized'}), 404

    data = request.get_json()

    # Validera och uppdatera profilfälten
    user.display_name = data.get('displayName', user.display_name)
    user.title = data.get('title', user.title)
    user.location = data.get('location', user.location)
    user.about_me = data.get('aboutMe', user.about_me)
    user.website = data.get('website', user.website)
    user.twitter = data.get('twitter', user.twitter)
    user.github = data.get('github', user.github)

    # Validering för fältens längd eller format
    if len(user.display_name) > 50:
        return jsonify({'message': 'Display name cannot exceed 50 characters'}), 400

    if user.website and not user.website.startswith(('http://', 'https://')):
        return jsonify({'message': 'Website must start with http:// or https://'}), 400

    # Spara ändringarna
    db.session.commit()

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

