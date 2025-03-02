// Simulação de armazenamento em memória
let stories = [];
let idCounter = 1;

// Função simples de validação (exemplo: rejeita textos com palavras proibidas)
function validateContent(content) {
  const forbiddenWords = ['inapropriado', 'conteudo proibido'];
  for (let word of forbiddenWords) {
    if (content.text && content.text.toLowerCase().includes(word)) {
      return false;
    }
  }
  return true;
}

// Retorna todos os stories aprovados
exports.getAllStories = (req, res) => {
  const approvedStories = stories.filter(story => story.approved);
  res.json(approvedStories);
};

// Cria um novo story
exports.createStory = (req, res) => {
  // Campos esperados: imageUrl, videoUrl, text, emojis (array) e duration (segundos)
  const { imageUrl, videoUrl, text, emojis, duration } = req.body;
  const newStory = {
    id: idCounter++,
    imageUrl,
    videoUrl,
    text,
    emojis,
    duration: duration || 5, // 5 segundos padrão se não informado
    approved: false,
    createdAt: new Date()
  };

  // Valida o conteúdo
  if (!validateContent(newStory)) {
    return res.status(400).json({ error: 'Conteúdo impróprio detectado.' });
  }

  // Para esse exemplo, aprovamos automaticamente o conteúdo
  newStory.approved = true;
  stories.push(newStory);
  res.status(201).json(newStory);
};

// Atualiza um story existente
exports.updateStory = (req, res) => {
  const id = parseInt(req.params.id);
  const storyIndex = stories.findIndex(story => story.id === id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Story não encontrado' });
  }
  const updatedData = req.body;
  const updatedStory = { ...stories[storyIndex], ...updatedData };
  
  // Revalida o conteúdo atualizado
  if (!validateContent(updatedStory)) {
    return res.status(400).json({ error: 'Conteúdo impróprio detectado.' });
  }
  stories[storyIndex] = updatedStory;
  res.json(updatedStory);
};

// Remove um story
exports.deleteStory = (req, res) => {
  const id = parseInt(req.params.id);
  stories = stories.filter(story => story.id !== id);
  res.status(204).send();
};
