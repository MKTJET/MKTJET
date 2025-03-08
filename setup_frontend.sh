#!/usr/bin/env bash

# ---------------------------------------------------------
# Script para criar um projeto React em "frontend/",
# incluindo axios e react-router-dom, bem como a 
# estrutura básica (public, src, etc.).
#
# Uso:
#   1) Salve este arquivo como setup_frontend.sh
#   2) No Git Bash/WSL, rode:
#       chmod +x setup_frontend.sh
#       ./setup_frontend.sh
#   3) Entre na pasta "frontend" e rode:
#       npm start
#   4) A aplicação abrirá em http://localhost:3000/
# ---------------------------------------------------------

# 1. Criar pasta 'frontend' e entrar nela (falha se já existir)
mkdir frontend 2>/dev/null
cd frontend || {
  echo "Não foi possível entrar na pasta 'frontend'. Ela já existe?"
  exit 1
}

# 2. Criar package.json com React, React-DOM, React-Scripts, axios e react-router-dom
cat <<EOF > package.json
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.3.4",
    "react-router-dom": "^6.10.0"
  }
}
EOF

# 3. Criar .gitignore
cat <<EOF > .gitignore
node_modules/
build/
.DS_Store
EOF

# 4. Criar README básico
cat <<EOF > README.md
# Frontend Project

Este projeto React inclui:
- React
- React DOM
- React Scripts
- axios
- react-router-dom

## Scripts

- **npm start**: inicia o servidor de desenvolvimento (http://localost:3000).
- **npm run build**: gera o build de produção em /build.

Estrutura gerada automaticamente por setup_frontend.sh.
EOF

# 5. Criar pasta public e arquivo index.html
mkdir public
cat <<EOF > public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Frontend Project</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
EOF

# 6. Criar a pasta src e suas subpastas
mkdir src
mkdir src/api
mkdir src/components
mkdir src/pages
mkdir src/styles

# 7. Criar arquivo src/index.jsx
cat <<EOF > src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
EOF

# 8. Criar arquivo src/App.jsx
cat <<EOF > src/App.jsx
import React from 'react';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
EOF

# 9. Criar o arquivo storiesApi.js
cat <<EOF > src/api/storiesApi.js
// Exemplo de integração com backend usando axios:

// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api';

// export async function getApprovedStories() {
//   const response = await axios.get(\`\${API_BASE_URL}/stories\`);
//   return response.data;
// }

// export async function createStory(storyData) {
//   const response = await axios.post(\`\${API_BASE_URL}/stories\`, storyData);
//   return response.data;
// }
EOF

# 10. Criar componentes StoryViewer.jsx e UploadForm.jsx
cat <<EOF > src/components/StoryViewer.jsx
import React, { useState, useEffect } from 'react';
import '../styles/storyViewer.css';

function StoryViewer({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!stories || stories.length === 0 || paused) return;

    const duration = stories[currentIndex].duration * 1000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, stories, paused]);

  if (!stories || stories.length === 0) {
    return <p>Nenhum story para exibir</p>;
  }

  const currentStory = stories[currentIndex];
  const isVideo = currentStory.mediaUrl?.toLowerCase().endsWith('.mp4');

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  return (
    <div className="story-viewer">
      <div className="story-media">
        {isVideo ? (
          <video src={currentStory.mediaUrl} autoPlay muted loop={!paused} />
        ) : (
          <img src={currentStory.mediaUrl} alt="Story" />
        )}
        <div className="story-text">
          {currentStory.text}{' '}
          {Array.isArray(currentStory.emojis) ? currentStory.emojis.join(' ') : ''}
        </div>
      </div>
      <div className="story-controls">
        <button onClick={() => setPaused(!paused)}>
          {paused ? 'Retomar' : 'Pausar'}
        </button>
        <button onClick={handlePrev}>Anterior</button>
        <button onClick={handleNext}>Próximo</button>
      </div>
    </div>
  );
}

export default StoryViewer;
EOF

cat <<EOF > src/components/UploadForm.jsx
import React, { useState } from 'react';
import '../styles/uploadForm.css';
// import { createStory } from '../api/storiesApi';

function UploadForm({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    mediaUrl: '',
    text: '',
    emojis: '',
    duration: 5,
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'mediaUrl') {
      setPreviewUrl(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Exemplo de payload
    // const payload = { ...formData, emojis: formData.emojis.split(' ') };
    // try {
    //   await createStory(payload);
    //   setFormData({ mediaUrl: '', text: '', emojis: '', duration: 5 });
    //   setPreviewUrl('');
    //   setError('');
    //   onUploadSuccess();
    // } catch (err) {
    //   setError(err.message || 'Erro ao enviar story');
    // }
  };

  return (
    <div className="upload-form-container">
      <h2>Enviar Novo Story</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <label>URL da Mídia:</label>
        <input
          type="text"
          name="mediaUrl"
          value={formData.mediaUrl}
          onChange={handleChange}
        />

        <label>Texto:</label>
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
        />

        <label>Emojis (separados por espaço):</label>
        <input
          type="text"
          name="emojis"
          value={formData.emojis}
          onChange={handleChange}
        />

        <label>Duração (segundos):</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />

        <button type="submit">Enviar</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {previewUrl && (
        <div className="preview-container">
          {previewUrl.toLowerCase().endsWith('.mp4') ? (
            <video src={previewUrl} width="300" height="200" autoPlay muted />
          ) : (
            <img src={previewUrl} alt="Prévia" width="300" height="200" />
          )}
        </div>
      )}
    </div>
  );
}

export default UploadForm;
EOF

# 11. Criar página Home.jsx
cat <<EOF > src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import StoryViewer from '../components/StoryViewer';
// import { getApprovedStories } from '../api/storiesApi';

function Home() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStories = async () => {
    setLoading(true);
    setError('');
    try {
      // const data = await getApprovedStories();
      // setStories(data);
    } catch (err) {
      setError('Erro ao carregar stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleUploadSuccess = () => {
    fetchStories();
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '600px' }}>
      <h1>Stories Viewer</h1>
      <UploadForm onUploadSuccess={handleUploadSuccess} />
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <StoryViewer stories={stories} />}
    </div>
  );
}

export default Home;
EOF

# 12. Criar arquivos CSS storyViewer.css e uploadForm.css
cat <<EOF > src/styles/storyViewer.css
.story-viewer {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}

.story-media {
  position: relative;
  width: 300px;
  height: 500px;
  margin: 0 auto;
  overflow: hidden;
}

.story-media img,
.story-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-text {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #fff;
  text-shadow: 1px 1px 2px #000;
}

.story-controls {
  margin-top: 1rem;
}
EOF

cat <<EOF > src/styles/uploadForm.css
.upload-form-container {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.upload-form label {
  display: block;
  margin: 0.5rem 0 0.2rem;
}

.upload-form input[type="text"],
.upload-form input[type="number"] {
  width: 100%;
  margin-bottom: 0.5rem;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
}

.preview-container {
  margin-top: 1rem;
}
EOF

# 13. Instalar as dependências
echo "Instalando dependências (React, axios, react-router-dom, etc.)..."
npm install

echo
echo "=========================================================="
echo "Projeto React criado com sucesso na pasta 'frontend'."
echo "Para iniciar o servidor de desenvolvimento:"
echo "  cd frontend"
echo "  npm start"
echo
echo "A aplicação abrirá em http://localhost:3000/"
echo "=========================================================="

