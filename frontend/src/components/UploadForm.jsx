import React, { useState, useEffect } from 'react';
import '../styles/uploadForm.css';

function UploadForm({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    text: '',
    emojis: '',
    duration: 5,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [error, setError] = useState('');

  // Captura o arquivo selecionado e gera a URL de pré-visualização
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setSelectedPreview(preview);
    }
  };

  // Atualiza os demais campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ao submeter o formulário, adiciona o item de mídia com sua duração ao carrossel
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const newMediaItem = {
        file: selectedFile,
        preview: selectedPreview,
        // Converte para número inteiro (em segundos) ou usa 5 segundos como padrão
        duration: parseInt(formData.duration, 10) || 5,
      };
      setMediaItems(prev => [...prev, newMediaItem]);
      // Limpa a seleção do arquivo e a pré-visualização
      setSelectedFile(null);
      setSelectedPreview('');
      // Opcionalmente, limpa outros campos (exceto a duração, se desejar manter o mesmo valor)
      setFormData(prev => ({ ...prev, text: '', emojis: '' }));
      setError('');
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    }
  };

  // useEffect para alternar os itens do carrossel de acordo com a duração de cada um
  useEffect(() => {
    if (mediaItems.length === 0) return;
    const currentItem = mediaItems[currentMediaIndex];
    const timer = setTimeout(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    }, currentItem.duration * 1000);
    return () => clearTimeout(timer);
  }, [currentMediaIndex, mediaItems]);

  return (
    <div className="upload-form-container">
      <h2>Enviar Novo Story</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <label>Selecione o arquivo de mídia:</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
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

        <button type="submit">Adicionar Mídia</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {mediaItems.length > 0 && (
        <div className="preview-container">
          <carousel-highlight-widget>
            {mediaItems[currentMediaIndex].file.type.startsWith('video') ? (
              <video
                src={mediaItems[currentMediaIndex].preview}
                width="300"
                height="200"
                autoPlay
                muted
              />
            ) : (
              <img
                src={mediaItems[currentMediaIndex].preview}
                alt={`Prévia ${currentMediaIndex + 1}`}
                width="300"
                height="200"
              />
            )}
          </carousel-highlight-widget>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
