const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const frontendPath = path.join(__dirname, './../frontend/dist/frontend/browser');
console.log('Frontend path:', frontendPath);
console.log('Index.html exists:', fs.existsSync(path.join(frontendPath, 'index.html')));

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

// Fallback para SPA (Angular)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('index.html não encontrado. Faça o build do frontend.');
  }
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
