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
