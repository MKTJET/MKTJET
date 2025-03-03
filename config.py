import os

# Diretório base do projeto
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Configurações de upload
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

# Configuração do banco de dados
DATABASE = os.path.join(BASE_DIR, 'media.db')
