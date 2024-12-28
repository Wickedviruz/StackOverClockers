from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import openai
from app import db
from app.models import User

bp = Blueprint('chatgpt', __name__, url_prefix='/chatgpt')

@bp.route('/ask', methods=['POST'])
@jwt_required()
def ask_chatgpt():
    data = request.get_json()
    question = data.get('question')
    if not question:
        return jsonify({'message': 'Question is required'}), 400

    # Initiera OpenAI API
    openai.api_key = db.session.query(db.func.current_setting('openai_api_key')).scalar()

    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # eller den senaste modellen
            prompt=question,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        answer = response.choices[0].text.strip()
        return jsonify({'answer': answer}), 200
    except Exception as e:
        return jsonify({'message': 'Error communicating with OpenAI', 'error': str(e)}), 500
