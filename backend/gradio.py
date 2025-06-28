from flask import Flask, request, jsonify
from flask_cors import CORS
from gradio_client import Client, handle_file
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

client = Client("https://545b9ca6eb7a931506.gradio.live/")

@app.route("/ask-graph", methods=["POST"])
def ask_graph():
    data = request.get_json()
    user_input = data.get("user_input", "")
    chat_history = data.get("chat_history", [])

    try:
        result = client.predict(
            user_input=user_input,
            chat_history=chat_history,
            api_name="/ask_graph"
        )
        return jsonify({"data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/clear-conversation", methods=["POST"])
def clear_conversation():
    try:
        result = client.predict(api_name="/clear_conversation")
        return jsonify({"data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/set-bot", methods=["POST"])
def set_bot():
    data = request.get_json()
    bot_name = data.get("bot_name", "")

    if not bot_name:
        return jsonify({"error": "bot_name parameter missing"}), 400

    try:
        result = client.predict(
            bot_name=bot_name,
            api_name="/set_bot"
        )
        return jsonify({"data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/process-video", methods=["POST"])
def process_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)

    try:
        result = client.predict(
            video_file=handle_file(file_path),
            api_name="/process_video"
        )
        return jsonify({"data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# ✅ Main entry point
if __name__ == "__main__":
    app.run(debug=True, port=8000)
