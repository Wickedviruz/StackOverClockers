from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, supports_credentials=True)

    from .routes import auth, forum, snippets, chatgpt, oauth
    app.register_blueprint(auth.bp)
    app.register_blueprint(forum.bp)
    app.register_blueprint(snippets.bp)
    app.register_blueprint(chatgpt.bp)
    app.register_blueprint(oauth.bp)

    return app
