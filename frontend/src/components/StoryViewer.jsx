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
