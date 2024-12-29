"""
ChatGPT Integration Blueprint.

This module provides routes for:
- Asking questions to OpenAI's GPT model.
- Returning AI-generated answers.

Requires:
- JWT authentication for access control.
- OpenAI API key stored in the database.
"""

# External imports
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import openai

# Internal imports
from .. import db
from app.models import User

# Define the Blueprint
bp = Blueprint('chatgpt', __name__, url_prefix='/chatgpt')


@bp.route('/ask', methods=['POST'])
@jwt_required()
def ask_chatgpt():
    """
    Handle questions to OpenAI's GPT model.

    - Validates the request to ensure a question is provided.
    - Fetches the OpenAI API key from the database.
    - Sends the question to OpenAI's API and returns the response.

    Returns:
        200: AI-generated answer to the question.
        400: Missing or invalid input data.
        500: Error communicating with OpenAI.
    """
    # Parse and validate the input data
    data = request.get_json()
    question = data.get('question')
    if not question:
        return jsonify({'message': 'Question is required'}), 400

    # Fetch OpenAI API key from the database
    openai.api_key = db.session.query(db.func.current_setting('openai_api_key')).scalar()

    try:
        # Send the question to OpenAI and retrieve the response
        response = openai.Completion.create(
            engine="text-davinci-003",  # Specify the GPT model to use
            prompt=question,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,  # Adjust the creativity of the response
        )
        # Extract the answer from the response
        answer = response.choices[0].text.strip()
        return jsonify({'answer': answer}), 200
    except Exception as e:
        # Handle errors from OpenAI or the system
        return jsonify({'message': 'Error communicating with OpenAI', 'error': str(e)}), 500
