# 🔒 DOCUMENTACIÓN DE SEGURIDAD - Libros Backend

## ✅ Medidas de Seguridad Implementadas

### 1. **Protección contra Fuerza Bruta en Login** 
- **Status**: ✅ Implementado
- **Herramienta**: `express-rate-limit`
- **Configuración**: 
  - Máximo 5 intentos por 15 minutos
  - Aplica únicamente a `/api/usuarios/login`
- **Ubicación**: [src/index.js](src/index.js#L35)

```javascript
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { mensaje: 'Demasiados intentos de login, espera 15 minutos' }
});
```

---

### 2. **Protección contra XSS (Cross-Site Scripting)**
- **Status**: ✅ Implementado
- **Métodos**: 
  - `.escape()` en todos los campos de entrada de texto
  - `maxLength` en validación de express-validator
- **Campos protegidos**:
  - Usuarios: `nombre`, `email`
  - Libros: `titulo`, `autor`, `resena`
- **Ubicación**: [src/routes/usuarios.js](src/routes/usuarios.js) y [src/routes/libros.js](src/routes/libros.js)

**Ejemplo**:
```javascript
body('titulo')
  .trim()
  .notEmpty()
  .isLength({ max: 120 })
  .escape()  // Neutraliza scripts maliciosos
```

---

### 3. **Control de CORS (Cross-Origin Resource Sharing)**
- **Status**: ✅ Implementado
- **Orígenes autorizados**:
  - `http://localhost:5173` (desarrollo local)
  - `https://mi-lista-de-libros-dev-ds9p31hex-...vercel.app` (Vercel)
  - `https://mi-lista-de-libros-dev-ops.vercel.app` (Vercel)
- **Ubicación**: [src/index.js](src/index.js#L14)

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mi-lista-de-libros-dev-ds9p31hex-esteban-dominguez-s-projects.vercel.app',
    'https://mi-lista-de-libros-dev-ops.vercel.app'
  ],
  credentials: true
}));
```

---

### 4. **Control de Acceso (Ownership Validation)**
- **Status**: ✅ Implementado
- **Validación por JWT**: Cada usuario solo accede a sus propios recursos
- **Endpoints protegidos**:
  - `GET /api/libros` - Filtra libros por `usuario` actual
  - `POST /api/libros` - Asigna automáticamente `usuario` del JWT
  - `PUT /api/libros/:id` - Valida que el libro pertenezca al usuario
  - `DELETE /api/libros/:id` - Valida que el libro pertenezca al usuario
  - `GET /api/libros/estadisticas` - Filtra estadísticas por usuario
  - `GET /api/usuarios/perfil` - Retorna solo datos del usuario autenticado

**Ejemplo de validación**:
```javascript
const libro = await Libro.findOneAndUpdate(
  { _id: req.params.id, usuario: req.usuario.id },  // Valida que el libro es del usuario
  { $set: datosActualizados },
  { new: true }
);
```

---

### 5. **Protección contra Inyección NoSQL**
- **Status**: ✅ Implementado y mejorado
- **Métodos**:
  - `express-validator` con `.isMongoId()` para validar IDs
  - `matchedData()` para usar solo datos validados
  - Middleware adicional `sanitizationMiddleware` que detecta operadores MongoDB ($ne, $gt, etc.)
- **Ubicación**: [src/middleware/sanitize.js](src/middleware/sanitize.js)

**Validación de IDs**:
```javascript
param('id').isMongoId().withMessage('El ID del libro no es válido')
```

**Sanitización adicional**:
```javascript
// Detecta y previene $ne, $where, $gt, etc.
if (Object.keys(value).some(k => k.startsWith('$'))) {
  delete obj[key];
  console.warn(`⚠️ Intento de inyección NoSQL detectado`);
}
```

---

### 6. **Cabeceras HTTP Seguras**
- **Status**: ✅ Implementado
- **Herramienta**: `Helmet.js`
- **Protecciones aplicadas**:
  - `X-Frame-Options` - Previene clickjacking
  - `X-Content-Type-Options` - Previene MIME type sniffing
  - `X-XSS-Protection` - Protección XSS adicional
  - `Strict-Transport-Security` - Fuerza HTTPS
  - `Content-Security-Policy` - Control de fuentes de contenido
- **Ubicación**: [src/index.js](src/index.js#L23)

```javascript
app.use(helmet());  // Aplica todas las cabeceras de seguridad
```

---

## 🔐 Mejoras Implementadas Adicionales

### 1. **Reordenamiento de Rutas en Libros**
- Se movió la ruta `GET /api/libros/estadisticas` ANTES de `/:id`
- Esto previene que `estadisticas` sea interpretado como un ID de libro
- **Ubicación**: [src/routes/libros.js](src/routes/libros.js)

### 2. **Middleware de Sanitización NoSQL**
- Nuevo middleware que detecta y previene inyecciones NoSQL
- Se ejecuta automáticamente en todas las solicitudes POST/PUT
- **Ubicación**: [src/middleware/sanitize.js](src/middleware/sanitize.js)

### 3. **Validación de Contraseña Fuerte**
- Requisitos implementados:
  - Mínimo 12 caracteres
  - Máximo 72 caracteres (límite de bcryptjs)
  - Debe incluir: mayúsculas, minúsculas, números, caracteres especiales (@$!%*?&)
- **Ubicación**: [src/routes/usuarios.js](src/routes/usuarios.js#L16)

---

## 🛡️ Resumen de Vulnerabilidades Prevenidas

| Vulnerabilidad | Herramienta | Estado |
|---|---|---|
| Fuerza bruta | express-rate-limit | ✅ |
| XSS | express-validator + .escape() | ✅ |
| CORS permisivo | cors (restrictivo) | ✅ |
| Acceso no autorizado | JWT + ownership check | ✅ |
| Inyección NoSQL | express-validator + sanitizationMiddleware | ✅ |
| Cabeceras inseguras | Helmet.js | ✅ |

---

## 📋 Checklist de Seguridad

- [x] Rate limiting en login
- [x] Escapado de caracteres en campos de texto
- [x] Validación de maxLength en inputs
- [x] CORS restringido a orígenes autorizados
- [x] Control de acceso por usuario (ownership validation)
- [x] Validación de MongoDB IDs
- [x] Prevención de inyección NoSQL
- [x] Cabeceras HTTP seguras con Helmet
- [x] Cifrado de contraseñas con bcryptjs
- [x] Tokens JWT con expiración (12h)
- [x] JWT con algoritmo seguro (HS256)
- [x] Límite de tamaño de request (100kb)

---

## 🚀 Recomendaciones Futuras

1. **HTTPS obligatorio**: En producción, forzar HTTPS con `HSTS`
2. **OWASP Headers**: Considerar agregar más cabeceras CSP personalizadas
3. **Logging de seguridad**: Implementar logs de intentos fallidos de login/acceso
4. **Autenticación 2FA**: Considerar autenticación de dos factores
5. **API Keys**: Si hay integraciones externas, implementar API keys con rotación
6. **Auditoría de base de datos**: Registrar cambios en datos sensibles
7. **Refresh tokens**: Implementar refresh tokens para mejorar seguridad de tokens JWT

---

**Última actualización**: 26/05/2026
