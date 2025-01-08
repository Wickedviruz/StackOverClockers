from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.exc import NoResultFound
from marshmallow import ValidationError

def register_error_handlers(app):
    @app.errorhandler(SQLAlchemyError)
    def handle_sqlalchemy_error(e):
        app.logger.error(f"Database error: {str(e)}")
        app.extensions['sqlalchemy'].db.session.rollback()
        return jsonify({'message': 'A database error occurred', 'error': 'Database error'}), 500

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        app.logger.warning(f"Validation error: {e.messages}")
        return jsonify({'message': 'Invalid input', 'errors': e.messages}), 400

    @app.errorhandler(AttributeError)
    def handle_attribute_error(e):
        app.logger.error(f"Attribute error: {str(e)}")
        return jsonify({'message': 'An attribute error occurred', 'error': 'Attribute error'}), 400
    
    @app.errorhandler(404)
    def handle_404(error):
        app.logger.warning(f"Resource not found: {str(error)}")
        return jsonify({'message': 'Resource not found'}), 404

    @app.errorhandler(NoResultFound)
    def handle_no_result_found(error):
        return jsonify({'message': 'Resource not found'}), 404

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': 'Unexpected error'}), 500
