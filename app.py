from flask import Flask, request, jsonify
from app.api.card_api import card_api

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(card_api)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
