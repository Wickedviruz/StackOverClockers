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
    display_name = db.Column(db.String(80), nullable=True, default="User")  # Default visningsnamn
    title = db.Column(db.String(120), nullable=True)  # Kan vara tomt
    location = db.Column(db.String(120), nullable=True)
    about_me = db.Column(db.Text, nullable=True)
    website = db.Column(db.String(255), nullable=True)
    twitter = db.Column(db.String(80), nullable=True)
    github = db.Column(db.String(80), nullable=True)
    role = db.Column(
        db.Enum('user', 'forum_admin', 'news_admin', 'super_admin', name='user_roles'),
        default='user',
        nullable=False,
    )  # User roles for permissions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the user is created
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_privacy_policy = db.Column(db.Boolean, default=False, nullable=False)

    # Relationships
    threads = db.relationship('Thread', backref='author', lazy=True)  # One-to-many relationship with Thread
    snippets = db.relationship('Snippet', backref='author', lazy=True)  # One-to-many relationship with Snippet
    comments = db.relationship('Comment', backref='author', lazy=True)
    news = db.relationship('News', backref='author', lazy=True)  # One-to-many relationship with News

# Create a unique index for lowercase usernames to ensure case-insensitive uniqueness
Index('ix_user_username_lower', func.lower(User.username), unique=True)


class Category(db.Model):
    """
    Represents a top-level category in the forum.

    Attributes:
        id (int): Primary key.
        name (str): Name of the category.
        subcategories (list[Subcategory]): Relationship to Subcategory objects.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    subcategories = db.relationship('Subcategory', backref='category', lazy=True)


class Subcategory(db.Model):
    """
    Represents a subcategory under a category.

    Attributes:
        id (int): Primary key.
        name (str): Name of the subcategory.
        category_id (int): Foreign key to Category.
        threads (list[Thread]): Relationship to Thread objects.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    threads = db.relationship('Thread', backref='subcategory', lazy=True)


class Thread(db.Model):
    """
    Represents a discussion thread within a subcategory.

    Attributes:
        id (int): Primary key.
        title (str): Title of the thread.
        content (str): Initial content of the thread.
        created_at (datetime): Timestamp of thread creation.
        user_id (int): Foreign key to User.
        subcategory_id (int): Foreign key to Subcategory.
        comments (list[Comment]): Relationship to Comment objects.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategory.id'), nullable=False)
    comments = db.relationship('Comment', backref='thread', lazy=True)


class Comment(db.Model):
    """
    Represents a comment within a thread.

    Attributes:
        id (int): Primary key.
        content (str): The content of the comment.
        created_at (datetime): Timestamp of comment creation.
        user_id (int): Foreign key to User.
        thread_id (int): Foreign key to Thread.
    """
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)


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