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
