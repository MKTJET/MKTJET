import React, { useState } from 'react';

function UploadForm({ onUpload }) {
  const [formData, setFormData] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    emojis: '',
    duration: 5
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Converte os emojis de uma string para um array (separados por espaço)
    const payload = { ...formData, emojis: formData.emojis.split(' ') };
    try {
      const response = await fetch('http://localhost:3000/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Erro ao enviar story');
      } else {
        setFormData({
          imageUrl: '',
          videoUrl: '',
          text: '',
          emojis: '',
          duration: 5
        });
        setError('');
        onUpload();
      }
    } catch (err) {
      setError('Erro de conexão');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>URL da Imagem:</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </div>
      <div>
        <label>URL do Vídeo:</label>
        <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
      </div>
      <div>
        <label>Texto:</label>
        <input type="text" name="text" value={formData.text} onChange={handleChange} />
      </div>
      <div>
        <label>Emojis (separados por espaço):</label>
        <input type="text" name="emojis" value={formData.emojis} onChange={handleChange} />
      </div>
      <div>
        <label>Duração (segundos):</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
      </div>
      <button type="submit">Enviar Story</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}

export default UploadForm;
