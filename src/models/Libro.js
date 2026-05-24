const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  anio: {
    type: Number,
    required: true
  },
  resena: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['leido', 'pendiente'],
    default: 'pendiente'
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Libro', libroSchema);