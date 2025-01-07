import pytest
from app import create_app, db

@pytest.fixture(scope="module")
def test_client():
    # Skapa en testversion av appen
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",  # In-Memory-databas för tester
        "CACHE_TYPE": "null",  # Inaktivera cache för tester
    })

    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()  # Skapa tabeller
            yield testing_client  # Skapa testklienten
            db.session.remove()
            db.drop_all()  # Rensa databasen efter tester
