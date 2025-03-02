import React, { useState, useEffect } from 'react';

function StoryViewer({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (stories.length === 0) return;

    // Define o tempo de exibição de acordo com a propriedade 'duration' do story
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }, stories[currentIndex].duration * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories]);

  if (stories.length === 0) {
    return <div>Carregando stories...</div>;
  }

  const currentStory = stories[currentIndex];

  return (
    <div style={{ position: 'relative', width: '300px', height: '500px', border: '1px solid #ccc' }}>
      {currentStory.imageUrl && (
        <img 
          src={currentStory.imageUrl} 
          alt="Story" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      )}
      {currentStory.videoUrl && (
        <video 
          src={currentStory.videoUrl} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          autoPlay muted 
        />
      )}
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#fff', textShadow: '1px 1px 2px #000' }}>
        {currentStory.text} {currentStory.emojis && currentStory.emojis.join(' ')}
      </div>
    </div>
  );
}

export default StoryViewer;
