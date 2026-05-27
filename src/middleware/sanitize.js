// Middleware de sanitización contra inyecciones NoSQL
// Detecta y previene patrones maliciosos en inputs

const sanitizeNoSQL = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Prevenir inyecciones de operadores MongoDB como $ne, $gt, etc.
      if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).some(k => k.startsWith('$'))) {
          delete obj[key];
          console.warn(`⚠️ Intento de inyección NoSQL detectado en: ${key}`);
        } else {
          sanitizeNoSQL(value);
        }
      }

      // Si es string, remover caracteres potencialmente peligrosos
      if (typeof value === 'string') {
        // Detectar patrones de inyección comunes
        if (/^\s*\$/.test(value)) {
          obj[key] = value.replace(/^\s*\$/, '');
          console.warn(`⚠️ Carácter $ peligroso removido de: ${key}`);
        }
      }
    }
  }

  return obj;
};

const sanitizationMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeNoSQL(req.body);
  }
  next();
};

export default sanitizationMiddleware;
