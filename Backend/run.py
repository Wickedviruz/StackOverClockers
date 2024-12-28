# Entry point for the application
# Created by WickedViruz
# At 2024-12-27 
# Import the application factory function from the app module
from app import create_app

# Create an instance of the Flask application
app = create_app()

# Run the application in debug mode if executed directly
if __name__ == '__main__':
    app.run(debug=True)
