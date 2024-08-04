from flask import Flask, request, send_file, send_from_directory, render_template, jsonify
from rembg import remove
from PIL import Image
from flask_cors import CORS
import io
import os

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)

@app.route('/')
def index():
   return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        input_image = Image.open(file.stream).convert("RGBA")
        output_image = remove(input_image)
        
        output_io = io.BytesIO()
        output_image.save(output_io, format='PNG')
        output_io.seek(0)
        
        return send_file(output_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=1234,debug=True)
