const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const librosRoutes = require('./routes/libros');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mi-lista-de-libros-dev-ds9p31hex-esteban-dominguez-s-projects.vercel.app',
    'https://mi-lista-de-libros-dev-ops.vercel.app'
  ],
  credentials: true
}));

app.use(helmet());

const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { mensaje: 'Demasiadas peticiones, intenta más tarde' }
});
app.use(limitadorGeneral);

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { mensaje: 'Demasiados intentos de login, espera 15 minutos' }
});
app.use('/api/usuarios/login', limitadorLogin);

app.use(express.json({ limit: '100kb' }));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor de libros funcionando y seguro!' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  console.error('MONGODB_URI no está definida');
  process.exit(1);
}

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET debe estar definida y tener al menos 32 caracteres');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  });
