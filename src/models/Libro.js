const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  autor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  anio: {
    type: Number,
    required: true,
    min: 1000,
    max: 2100
  },
  resena: {
    type: String,
    default: '',
    trim: true,
    maxlength: 2000
  },
  estado: {
    type: String,
    enum: ['leido', 'pendiente'],
    default: 'pendiente'
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    immutable: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Libro', libroSchema);
