from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from urllib.parse import urlparse
import time

app = Flask(__name__)
CORS(app)

# Simple rate limiter
last_request_time = {}

def is_valid_url(url):
    parsed = urlparse(url)
    return parsed.scheme in ("http", "https") and parsed.netloc

@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    if not is_valid_url(url):
        return jsonify({"error": "Invalid URL"}), 400

    # Rate limiting per IP
    ip = request.remote_addr
    now = time.time()

    if ip in last_request_time and now - last_request_time[ip] < 2:
        return jsonify({"error": "Too many requests"}), 429

    last_request_time[ip] = now

    try:
        start = time.time()
        response = requests.get(url, timeout=5)
        end = time.time()

        return jsonify({
            "status": response.status_code,
            "response_time": round((end - start) * 1000, 2),
            "message": "Success"
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })

if __name__ == "__main__":
    app.run(debug=True)