const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const frontendPath = path.join(__dirname, './../frontend/dist/frontend/browser');

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

// Fallback para SPA (Angular) – Express 5 exige regex
app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('index.html não encontrado:', indexPath);
    return res.status(404).send('index.html não encontrado. Faça o build do frontend.');
  }

  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
