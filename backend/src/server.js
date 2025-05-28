const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const assistidoRoutes = require('./routes/assistidoRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const doacaoRoutes = require('./routes/doacaoRoutes');

// Inicializar aplicação Express
const app = express();

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definir rotas
app.use('/api/auth', authRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/assistidos', assistidoRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/doacoes', doacaoRoutes);

// Rota básica para teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Gerenciamento de Assistência Social' });
});

// Definir porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
