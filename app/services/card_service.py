import requests
from requests.exceptions import RequestException
import os
import redis
import json
from dotenv import load_dotenv

load_dotenv()

redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
redis_password = os.getenv('REDIS_PASSWORD')

# Connect Redis
redis_client = redis.Redis(
    host=redis_host,
    port=int(redis_port),
    password=redis_password
)

def query_all_cards_by_name(card_name):
    url = "https://api.magicthegathering.io/v1/cards"
    all_cards = []
    page = 1
    cache_key = f"cards:{card_name}"

    # check redis cache
    cached_cards = redis_client.get(cache_key)
    if cached_cards:
        return json.loads(cached_cards)  # deserializes json

    while True:
        query_params = {
            "name": card_name,
            "page": page
        }
        try:
            response = requests.get(url, params=query_params)
            response.raise_for_status()  # check http errors
            data = response.json()
            cards = data.get('cards', [])
            
            if not cards:
                break  # stops if pagination reachs the end
            
            all_cards.extend(cards)
            page += 1
        except RequestException as e:
            return {"error": str(e)}

    if not all_cards:
        return {"error": "No cards found"}

    # define a period for redis cache
    redis_client.set(cache_key, json.dumps(all_cards), ex=3600)

    return all_cards
