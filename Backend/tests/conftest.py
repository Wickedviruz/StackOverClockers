import pytest
from app import create_app, db
from config import TestConfig
from flask_jwt_extended import create_access_token
from app.models import User

@pytest.fixture
def test_client():
    app = create_app(TestConfig)
    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Skapa tabeller i testdatabasen
        yield client  # Kör testet
        with app.app_context():
            db.session.remove()
            db.drop_all()  # Rensa testdatabasen


@pytest.fixture
def test_user_token(test_client):
    """
    Fixture för att skapa en testanvändare och returnera en giltig JWT-token.
    """
    from app.models import User
    from flask_jwt_extended import create_access_token

    with test_client.application.app_context():
        # Skapa en testanvändare med en giltig e-postadress
        user = User(username="testuser", email="testuser@example.com", password="password")
        db.session.add(user)
        db.session.commit()

        # Generera en JWT-token
        token = create_access_token(identity=user.id)
        return token