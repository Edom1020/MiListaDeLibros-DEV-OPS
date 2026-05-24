const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const librosRoutes = require('./routes/libros');

const app = express();

app.use(helmet());

const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { mensaje: 'Demasiadas peticiones, intenta más tarde' }
});
app.use(limitadorGeneral);

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { mensaje: 'Demasiados intentos de login, espera 15 minutos' }
});
app.use('/api/usuarios/login', limitadorLogin);

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor de libros funcionando y seguro!' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error.message);
  });