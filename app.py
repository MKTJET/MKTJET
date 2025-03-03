from flask import Flask
from config import MAX_CONTENT_LENGTH, UPLOAD_FOLDER
from routes import routes
from database import init_db

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Inicializa o banco de dados
init_db()

# Registra o Blueprint com as rotas de upload
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
