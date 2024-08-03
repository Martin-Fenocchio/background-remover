from flask import Flask, request, render_template, send_file
from rembg import remove
from PIL import Image
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

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
    app.run(debug=True)
