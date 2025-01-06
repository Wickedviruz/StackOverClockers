# Externa modules imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Local modules imports

from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    """
    Factory function to create and configure the Flask application.
    This pattern supports testing and scalability by creating isolated app instances.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, supports_credentials=True)

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
