# Import local modules
from . import db  # Database instance from the application

# Import external modules
from datetime import datetime  # To handle timestamps
from sqlalchemy import Index, func  # For database indexing and SQL functions
from werkzeug.security import generate_password_hash, check_password_hash  # For password hashing and verification


class User(db.Model):
    """
    User model represents registered users in the system, supporting different roles and authentication methods.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(80), nullable=True)  # Display username (optional)
    username_lower = db.Column(db.String(80), unique=True, nullable=True)  # Lowercase username for uniqueness
    email = db.Column(db.String(120), unique=True, nullable=False)  # Unique email for authentication
    password = db.Column(db.String(128), nullable=True)  # Password hash (nullable for OAuth users)
    oauth_provider = db.Column(db.String(50), nullable=True)  # OAuth provider name (e.g., Google, Facebook)
    oauth_id = db.Column(db.String(100), nullable=True)  # Unique OAuth user ID
    role = db.Column(
        db.Enum('user', 'forum_admin', 'news_admin', 'super_admin', name='user_roles'),
        default='user',
        nullable=False,
    )  # User roles for permissions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the user is created

    # Relationships
    threads = db.relationship('Thread', backref='author', lazy=True)  # One-to-many relationship with Thread
    snippets = db.relationship('Snippet', backref='author', lazy=True)  # One-to-many relationship with Snippet
    posts = db.relationship('Post', backref='author', lazy=True)  # One-to-many relationship with Post
    news = db.relationship('News', backref='author', lazy=True)  # One-to-many relationship with News

# Create a unique index for lowercase usernames to ensure case-insensitive uniqueness
Index('ix_user_username_lower', func.lower(User.username), unique=True)


class Category(db.Model):
    """
    Category model represents discussion categories in the forum.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)  # Name of the category
    description = db.Column(db.Text, nullable=True)  # Description of the category
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the category is created
    threads = db.relationship('Thread', backref='category', lazy=True)  # One-to-many relationship with Thread


class Thread(db.Model):
    """
    Thread model represents discussion threads within a category.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  # Title of the thread
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)  # Foreign key to Category
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the thread is created
    posts = db.relationship('Post', backref='thread', lazy=True)  # One-to-many relationship with Post


class Post(db.Model):
    """
    Post model represents individual messages within a thread.
    """
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)  # Content of the post
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)  # Foreign key to Thread
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the post is created


class Snippet(db.Model):
    """
    Snippet model represents code snippets shared by users.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  # Title of the snippet
    language = db.Column(db.String(50), nullable=False)  # Programming language of the snippet
    code = db.Column(db.Text, nullable=False)  # The actual code
    description = db.Column(db.Text, nullable=True)  # Optional description of the snippet
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the snippet is created
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)


class News(db.Model):
    """
    News model represents news articles created by admins.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  # Title of the news article
    content = db.Column(db.Text, nullable=False)  # Content of the news article
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User (author)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the news article is created
