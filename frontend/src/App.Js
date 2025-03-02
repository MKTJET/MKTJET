import React, { useState, useEffect } from 'react';
import StoryViewer from './components/StoryViewer';
import UploadForm from './components/UploadForm';

function App() {
  const [stories, setStories] = useState([]);

  const fetchStories = async () => {
    const response = await fetch('http://localhost:3000/api/stories');
    const data = await response.json();
    setStories(data);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div>
      <h1>Stories Viewer</h1>
      <UploadForm onUpload={fetchStories} />
      <StoryViewer stories={stories} />
    </div>
  );
}

export default App;
