import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from database import get_db_connection

routes = Blueprint('routes', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@routes.route('/upload', methods=['POST'])
def upload_file():
    # Verifica se o request possui o arquivo
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado na requisição'}), 400

    file = request.files['file']
    
    # Verifica se um arquivo foi selecionado
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    # Valida a extensão do arquivo
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Coleta os metadados do arquivo
        file_size = os.path.getsize(file_path)
        file_type = filename.rsplit('.', 1)[1].lower()
        upload_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Armazena os metadados no banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO media (filename, filepath, filetype, upload_time, filesize)
            VALUES (?, ?, ?, ?, ?)
        ''', (filename, file_path, file_type, upload_time, file_size))
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Upload realizado com sucesso!',
            'filename': filename,
            'upload_time': upload_time
        }), 200
    else:
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
