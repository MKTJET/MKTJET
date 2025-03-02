const express = require('express');
const bodyParser = require('body-parser');
const storyRoutes = require('./routes/storyRoutes');

const app = express();
app.use(bodyParser.json());

// Define a rota para o gerenciamento dos stories
app.use('/api/stories', storyRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
