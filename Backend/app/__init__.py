# Externa modules imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flasgger import Swagger

# Local modules imports
from app.logger import create_logger
from app.error_handlers import register_error_handlers
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)
cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

def create_app(config_class=Config):
    """
    Factory function to create and configure the Flask application.
    This pattern supports testing and scalability by creating isolated app instances.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)
    swagger = Swagger(app)
    CORS(app, supports_credentials=True)
    register_error_handlers(app)

    # Create and config logger
    logger= create_logger()
    app.logger = logger


    from .routes import auth, forum, snippets, chatgpt, oauth, news, profile

    # Register blueprints for different application modules
    app.register_blueprint(auth.bp)     #Auth blueprints
    app.register_blueprint(forum.bp)    #Forum blueprints
    app.register_blueprint(snippets.bp) #Codesnippets blueprints
    app.register_blueprint(chatgpt.bp)  #Chatgpt blueprints
    app.register_blueprint(oauth.bp)    #OAuth blueprints
    app.register_blueprint(news.bp)    #News blueprints
    app.register_blueprint(profile.bp)    #Profile blueprints

    return app
