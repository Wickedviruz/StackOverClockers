# Import local modules
from . import db  # Database instance from the application

# Import external modules
from datetime import datetime  # To handle timestamps
from sqlalchemy import Index, func  # For database indexing and SQL functions
from werkzeug.security import generate_password_hash, check_password_hash  # For password hashing and verification


# User model represents registered users in the system
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(80), nullable=True)  # Display username (optional)
    username_lower = db.Column(db.String(80), unique=True, nullable=True)  # Lowercase username for uniqueness
    email = db.Column(db.String(120), unique=True, nullable=False)  # Unique email for authentication
    password = db.Column(db.String(128), nullable=True)  # Password hash (nullable for OAuth users)
    oauth_provider = db.Column(db.String(50), nullable=True)  # OAuth provider name (e.g., Google, Facebook)
    oauth_id = db.Column(db.String(100), nullable=True)  # Unique OAuth user ID
    is_admin = db.Column(db.Boolean, default=False)  # Indicates if the user is an admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  #
    threads = db.relationship('Thread', backref='author', lazy=True)  # One-to-many relationship with Thread
    snippets = db.relationship('Snippet', backref='author', lazy=True)  # One-to-many relationship with Snippet
    posts = db.relationship('Post', backref='author', lazy=True)  # One-to-many relationship with Post

# Create a unique index for lowercase usernames to ensure case-insensitive uniqueness
Index('ix_user_username_lower', func.lower(User.username), unique=True)


# Category model represents discussion categories in the forum
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False) 
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 
    threads = db.relationship('Thread', backref='category', lazy=True)  # One-to-many relationship with Thread


# Thread model represents discussion threads within a category
class Thread(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False) 
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)  # Foreign key to Category
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='thread', lazy=True)  # One-to-many relationship with Post


# Post model represents individual messages within a thread
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)  # Foreign key to Thread
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 


# Snippet model represents code snippets shared by users
class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    language = db.Column(db.String(50), nullable=False)  
    code = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)
