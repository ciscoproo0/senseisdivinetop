import os
from flask import Flask, request, jsonify
from app.api.card_api import card_api

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(card_api)

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
