"""
OAuth Blueprint for handling third-party authentication.

This module provides:
- GitHub and Google OAuth integration.
- Login redirection to the respective providers.
- Callback handling to fetch user information.
- Automatic user creation and JWT token generation.
"""

# External imports
import os
from flask import Blueprint, redirect, url_for, session, jsonify
from flask_dance.contrib.github import make_github_blueprint, github
from flask_dance.contrib.google import make_google_blueprint, google
from flask_jwt_extended import create_access_token
from sqlalchemy import func

# Internal imports
from .. import db
from app.models import User

# Define the Blueprint
bp = Blueprint('oauth', __name__, url_prefix='/oauth')

# GitHub OAuth Blueprint
github_bp = make_github_blueprint(
    client_id=os.getenv('GITHUB_OAUTH_CLIENT_ID'),
    client_secret=os.getenv('GITHUB_OAUTH_CLIENT_SECRET'),
    scope='user:email'
)

# Google OAuth Blueprint
google_bp = make_google_blueprint(
    client_id=os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
    scope=['profile', 'email']
)

# Register the blueprints for GitHub and Google OAuth
bp.register_blueprint(github_bp, url_prefix='/github')
bp.register_blueprint(google_bp, url_prefix='/google')


@bp.route('/login/<provider>')
def oauth_login(provider):
    """
    Redirect users to the selected OAuth provider's login page.

    Args:
        provider (str): The OAuth provider ('github' or 'google').

    Returns:
        Redirect: To the provider's login page.
        400: If the provider is unsupported.
    """
    if provider == 'github':
        return redirect(url_for('github.login'))
    elif provider == 'google':
        return redirect(url_for('google.login'))
    else:
        return jsonify({'message': 'Unsupported provider'}), 400


@bp.route('/callback/<provider>')
def oauth_callback(provider):
    """
    Handle the callback from the OAuth provider.

    - Fetches user information from the provider.
    - Creates a new user in the database if not already registered.
    - Generates a JWT token for the authenticated user.

    Args:
        provider (str): The OAuth provider ('github' or 'google').

    Returns:
        200: User authenticated successfully with a JWT token.
        400: If user information or email is unavailable.
    """
    if provider == 'github' and not github.authorized:
        return redirect(url_for('github.login'))
    if provider == 'google' and not google.authorized:
        return redirect(url_for('google.login'))

    # Fetch user info based on the provider
    if provider == 'github':
        resp = github.get('/user')
        if not resp.ok:
            return jsonify({'message': 'Failed to fetch user info from GitHub'}), 400
        github_info = resp.json()

        email_resp = github.get('/user/emails')
        if not email_resp.ok:
            return jsonify({'message': 'Failed to fetch user emails from GitHub'}), 400
        emails = email_resp.json()
        primary_emails = [email['email'] for email in emails if email.get('primary') and email.get('verified')]
        email = primary_emails[0] if primary_emails else None
        username = github_info.get('login')
        oauth_id = str(github_info.get('id'))

    elif provider == 'google':
        resp = google.get('/oauth2/v2/userinfo')
        if not resp.ok:
            return jsonify({'message': 'Failed to fetch user info from Google'}), 400
        google_info = resp.json()
        email = google_info.get('email')
        username = google_info.get('name')
        oauth_id = google_info.get('id')

    # Validate the email
    if not email:
        return jsonify({'message': 'Email not available from OAuth provider'}), 400

    # Standardize username to lowercase
    username_lower = username.lower() if username else None

    # Check if the user already exists, otherwise create a new one
    user = User.query.filter(func.lower(User.username_lower) == username_lower).first()
    if not user:
        user = User(
            email=email,
            username=username,
            username_lower=username_lower,
            oauth_provider=provider,
            oauth_id=oauth_id
        )
        db.session.add(user)
        db.session.commit()

    # Generate a JWT token
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'username': user.username}), 200
