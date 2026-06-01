import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult, matchedData } from 'express-validator';
import Usuario from '../models/Usuario.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// REGISTRO
router.post('/registro', [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener mínimo 2 caracteres')
    .isLength({ max: 80 }).withMessage('El nombre no puede superar 80 caracteres')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail()
    .escape(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 12 }).withMessage('La contraseña debe tener mínimo 12 caracteres')
    .isLength({ max: 72 }).withMessage('La contraseña no puede superar 72 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&)')
], async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, email, password } = matchedData(req, { locations: ['body'] });

    // Búsqueda optimizada con proyección de un solo campo
    const usuarioExiste = await Usuario.findOne({ email }).select('_id');
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const usuario = new Usuario({ nombre, email, password: passwordEncriptada });
    await usuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// LOGIN
router.post('/login', [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ max: 72 }).withMessage('La contraseña no puede superar 72 caracteres')
], async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = matchedData(req, { locations: ['body'] });

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '12h', algorithm: 'HS256' }
    );

    res.json({ token, nombre: usuario.nombre });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// GET perfil del usuario autenticado
router.get('/perfil', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ id: usuario._id, nombre: usuario.nombre, email: usuario.email });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

export default router;
