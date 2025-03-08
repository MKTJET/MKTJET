import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/uploadForm.css';

const BROADCAST_CHANNEL = 'media_channel';
const STORAGE_KEY = 'mediaItems';

function UploadPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: '',
    emojis: '',
    duration: 5,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState('');
  const [error, setError] = useState('');
  const [mediaItems, setMediaItems] = useState([]);

  // Guarda a referência da janela do carrossel
  const carouselWindowRef = useRef(null);

  // Inicializa o canal de broadcast
  const bc = new BroadcastChannel(BROADCAST_CHANNEL);

  // Carrega os itens do localStorage quando a página monta
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMediaItems(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao ler mídias do armazenamento:', e);
      }
    }
  }, []);

  // Atualiza o localStorage, o estado local e envia o broadcast
  const updateMediaItems = (newItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setMediaItems(newItems);
    bc.postMessage({ mediaItems: newItems });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setSelectedPreview(preview);
    }
  };

  // Adiciona nova mídia
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      const newMediaItem = {
        fileType: selectedFile.type, // salvar o tipo para verificação na outra página
        preview: selectedPreview,
        duration: parseInt(formData.duration, 10) || 5,
        text: formData.text,
        emojis: formData.emojis,
      };

      const updatedMediaItems = [...mediaItems, newMediaItem];
      updateMediaItems(updatedMediaItems);

      // Abre a página do carrossel em nova guia se ainda não estiver aberta
      if (!carouselWindowRef.current || carouselWindowRef.current.closed) {
        carouselWindowRef.current = window.open('/carousel', '_blank');
      }

      // Limpa os campos de seleção e texto (mantém a duração, se desejar)
      setSelectedFile(null);
      setSelectedPreview('');
      setFormData(prev => ({ ...prev, text: '', emojis: '' }));
      setError('');
    } else {
      setError('Selecione um arquivo de mídia.');
    }
  };

  // Remove um item de mídia pelo índice
  const removeMedia = (index) => {
    const updatedMediaItems = mediaItems.filter((_, i) => i !== index);
    updateMediaItems(updatedMediaItems);
  };

  // Fecha o BroadcastChannel ao desmontar
  useEffect(() => {
    return () => {
      bc.close();
    };
  }, [bc]);

  return (
    <div className="upload-form-container">
      <h2>Upload e Configuração de Tempo</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <label>Selecione o arquivo de mídia:</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

        <label>Texto:</label>
        <input type="text" name="text" value={formData.text} onChange={handleChange} />

        <label>Emojis (separados por espaço):</label>
        <input type="text" name="emojis" value={formData.emojis} onChange={handleChange} />

        <label>Duração (segundos):</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} />

        <button type="submit">Adicionar Mídia</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {mediaItems.length > 0 && (
        <div className="media-items-list">
          <h3>Mídias adicionadas:</h3>
          <ul>
            {mediaItems.map((item, index) => (
              <li key={index}>
                {item.fileType.startsWith('video') ? (
                  <video src={item.preview} width="150" height="100" autoPlay muted />
                ) : (
                  <img src={item.preview} alt={`Prévia ${index + 1}`} width="150" height="100" />
                )}
                <p>Duração: {item.duration} segundos</p>
                <button onClick={() => removeMedia(index)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
