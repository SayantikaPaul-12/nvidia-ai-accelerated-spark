from flask import Flask, request, jsonify
from gradio_client import Client, handle_file
import os
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Gradio client with your deployed Gradio app URL
client = Client("https://545b9ca6eb7a931506.gradio.live/")

@app.route("/process-video", methods=["POST"])
def process_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = file.filename

    # Use /tmp or current directory fallback if /tmp doesn't exist or writable
    save_dir = "/tmp"
    if not os.path.exists(save_dir) or not os.access(save_dir, os.W_OK):
        save_dir = "."

    file_path = os.path.join(save_dir, filename)

    try:
        print(f"[INFO] Saving uploaded file to {file_path}")
        file.save(file_path)

        print(f"[INFO] Calling Gradio client.predict() with file: {file_path}")
        result = client.predict(
            video_file=handle_file(file_path),
            api_name="/process_video"  # Double-check your Gradio API endpoint here
        )
        print(f"[INFO] Result from Gradio client: {result}")

        # Cleanup uploaded file after processing
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"[INFO] Removed temporary file {file_path}")

        return jsonify({"data": result})

    except Exception as e:
        print("[ERROR] Exception during /process-video:")
        traceback.print_exc()
        # Attempt cleanup even if error happens
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"[INFO] Removed temporary file {file_path} after error")

        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run Flask app in debug mode for detailed error logs
    app.run(host="0.0.0.0", port=8000, debug=True)
