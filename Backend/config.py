import os
from dotenv import load_dotenv

# Load env-variabels from the  .env-file
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')

    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/yourdb')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # OpenAI API
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your_openai_api_key')

    # OAuth Settings
    GITHUB_OAUTH_CLIENT_ID = os.getenv('GITHUB_OAUTH_CLIENT_ID')
    GITHUB_OAUTH_CLIENT_SECRET = os.getenv('GITHUB_OAUTH_CLIENT_SECRET')
    GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
    GOOGLE_OAUTH_CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')

    # Roles config
    ADMIN_ROLES = ['forum_admin', 'news_admin', 'super_admin']

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # In-memory databas för tester
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('test_secret_key', 'test_secret_key')  # En separat nyckel för tester
    CACHE_TYPE = 'null'  # Inaktivera cache för tester
    WTF_CSRF_ENABLED = False  # Om du använder CSRF-skydd, inaktivera det för tester
