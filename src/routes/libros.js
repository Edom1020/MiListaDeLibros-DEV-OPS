const express = require('express');
const router = express.Router();
const { body, param, validationResult, matchedData } = require('express-validator');
const Libro = require('../models/Libro');
const auth = require('../middleware/auth');

// GET - Obtener todos los libros del usuario
router.get('/', auth, async (req, res) => {
  try {
    const libros = await Libro.find({ usuario: req.usuario.id });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

const validarIdLibro = [
  param('id')
    .isMongoId().withMessage('El ID del libro no es válido')
];

const validacionesCrearLibro = [
  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 120 }).withMessage('El título no puede superar 120 caracteres')
    .escape(),
  body('autor')
    .trim()
    .notEmpty().withMessage('El autor es obligatorio')
    .isLength({ max: 120 }).withMessage('El autor no puede superar 120 caracteres')
    .escape(),
  body('anio')
    .notEmpty().withMessage('El año es obligatorio')
    .isInt({ min: 1000, max: 2100 }).withMessage('El año no es válido')
    .toInt(),
  body('resena')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La reseña no puede superar 2000 caracteres')
    .escape(),
  body('estado')
    .optional()
    .isIn(['leido', 'pendiente']).withMessage('El estado debe ser leido o pendiente')
];

const validacionesActualizarLibro = [
  ...validarIdLibro,
  body('titulo')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ max: 120 }).withMessage('El título no puede superar 120 caracteres')
    .escape(),
  body('autor')
    .optional()
    .trim()
    .notEmpty().withMessage('El autor no puede estar vacío')
    .isLength({ max: 120 }).withMessage('El autor no puede superar 120 caracteres')
    .escape(),
  body('anio')
    .optional()
    .isInt({ min: 1000, max: 2100 }).withMessage('El año no es válido')
    .toInt(),
  body('resena')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La reseña no puede superar 2000 caracteres')
    .escape(),
  body('estado')
    .optional()
    .isIn(['leido', 'pendiente']).withMessage('El estado debe ser leido o pendiente')
];

// POST - Agregar un libro
router.post('/', auth, validacionesCrearLibro, async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { titulo, autor, anio, resena, estado } = matchedData(req, { locations: ['body'] });
    const libro = new Libro({
      titulo, autor, anio, resena, estado,
      usuario: req.usuario.id
    });
    await libro.save();
    res.status(201).json(libro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// PUT - Editar un libro
router.put('/:id', auth, validacionesActualizarLibro, async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const datosActualizados = matchedData(req, { locations: ['body'] });
    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({ mensaje: 'Debes enviar al menos un campo válido' });
    }

    const libro = await Libro.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario.id },
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// DELETE - Eliminar un libro
router.delete('/:id', auth, validarIdLibro, async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const libro = await Libro.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id
    });
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// GET - Estadísticas
router.get('/estadisticas', auth, async (req, res) => {
  try {
    const libros = await Libro.find({ usuario: req.usuario.id });
    const estadisticas = {
      total: libros.length,
      leidos: libros.filter(l => l.estado === 'leido').length,
      pendientes: libros.filter(l => l.estado === 'pendiente').length,
      porAnio: libros.reduce((acc, l) => {
        acc[l.anio] = (acc[l.anio] || 0) + 1;
        return acc;
      }, {})
    };
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
