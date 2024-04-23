from flask import Blueprint, request, jsonify
from app.services.card_service import query_all_cards_by_name

card_api = Blueprint('card_api', __name__)

@card_api.route('/consult', methods=['POST'])
def consult_card():
    try:
        card_name = request.json.get('name', None)
        if not card_name:
            return jsonify({'error': 'Name parameter is required'}), 400
        
        card_data = query_all_cards_by_name(card_name)
        if card_data:
            return jsonify(card_data), 200
        else:
            return jsonify({'error': 'Card not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
