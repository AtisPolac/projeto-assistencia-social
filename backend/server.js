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

// Fallback para SPA (Angular)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
