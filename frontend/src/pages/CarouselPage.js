import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/uploadForm.css';

const BROADCAST_CHANNEL = 'media_channel';
const STORAGE_KEY = 'mediaItems';

function CarouselPage() {
  const navigate = useNavigate();
  const [mediaItems, setMediaItems] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  // Estado que indica se o container está em full screen
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Ref para o container do carrossel que será posto em full screen
  const containerRef = useRef(null);

  // 1. Carregar mídias do localStorage e escutar atualizações via BroadcastChannel
  useEffect(() => {
    const bc = new BroadcastChannel(BROADCAST_CHANNEL);
    bc.onmessage = (event) => {
      if (event.data?.mediaItems) {
        setMediaItems(event.data.mediaItems);
      }
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMediaItems(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao ler mídias do armazenamento:', e);
      }
    }
    return () => {
      bc.close();
    };
  }, []);

  // 2. Ajusta o índice atual caso a lista mude
  useEffect(() => {
    if (mediaItems.length === 0) {
      setCurrentMediaIndex(0);
    } else if (currentMediaIndex >= mediaItems.length) {
      setCurrentMediaIndex(0);
    }
  }, [mediaItems, currentMediaIndex]);

  // 3. Auto-avança para o próximo item conforme a duração definida
  useEffect(() => {
    if (mediaItems.length === 0) return;
    const currentItem = mediaItems[currentMediaIndex];
    if (!currentItem) return;
    const timer = setTimeout(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    }, currentItem.duration * 1000);
    return () => clearTimeout(timer);
  }, [currentMediaIndex, mediaItems]);

  // 4. Listener para atualizar o estado de full screen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 5. Função para alternar o modo full screen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Erro ao entrar em full screen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Erro ao sair do full screen:", err);
      });
    }
  };

  if (mediaItems.length === 0) {
    return (
      <div className="carousel-fullscreen-container" ref={containerRef}>
        <h2>Carrossel</h2>
        <p>Nenhuma mídia foi adicionada. Por favor, adicione mídias na página de upload.</p>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
    );
  }

  const currentItem = mediaItems[currentMediaIndex];
  if (!currentItem) {
    return (
      <div className="carousel-fullscreen-container" ref={containerRef}>
        <h2>Carrossel</h2>
        <p>Carregando mídias...</p>
      </div>
    );
  }

  return (
    <div className="carousel-fullscreen-container" ref={containerRef}>
      <div className="carousel-fullscreen-widget">
        {currentItem.fileType && currentItem.fileType.startsWith('video') ? (
          <video
            src={currentItem.preview}
            autoPlay
            muted
            loop
            className="carousel-fullscreen-media"
          />
        ) : (
          <img
            src={currentItem.preview}
            alt={`Mídia ${currentMediaIndex + 1}`}
            className="carousel-fullscreen-media"
          />
        )}
      </div>
      {/* Exibe os controles somente se não estiver em full screen */}
      {!isFullscreen && (
        <div className="carousel-controls">
          <p>Duração: {currentItem.duration} segundos</p>
          <button onClick={() => navigate('/')}>Voltar para Upload</button>
          <button onClick={toggleFullscreen}>Full Screen</button>
        </div>
      )}
    </div>
  );
}

export default CarouselPage;
