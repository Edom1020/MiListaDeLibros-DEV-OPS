import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, { timestamps: true });

// Crear índice explícito en email para optimizar búsquedas
usuarioSchema.index({ email: 1 }, { sparse: true });

export default mongoose.model('Usuario', usuarioSchema);
