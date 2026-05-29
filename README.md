# 📚 Mi Lista de Libros Favoritos

Aplicación web full stack donde los usuarios pueden gestionar su biblioteca personal de libros. Permite registrarse, iniciar sesión, agregar, editar, eliminar libros y ver estadísticas de lectura.

---

## 👥 Integrantes del Grupo

| Nombre | Rol |
|---|---|
| Esteban Domínguez | Frontend (React) |
| Kevin Ochoa | Backend (Node.js + MongoDB) |
| Erick Marrugo | Documentación y pruebas |
| Sebastian Ortiz | Documentación y despliegue |
| Valery Espinosa | Presentación y diseño |

---

## 🔗 Enlaces

| Recurso | URL |
|---|---|
| 🌐 Aplicación (Frontend) | https://mi-lista-de-libros-dev-ops.vercel.app |
| ⚙️ API (Backend) | https://milistadelibros-dev-ops.onrender.com |
| 📁 Repositorio | https://github.com/Edom1020/MiListaDeLibros-DEV-OPS |

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- React + Vite
- React Router DOM
- Axios
- Bootstrap + CSS Variables

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcryptjs
- Express Validator
- Helmet
- CORS
- Express Rate Limit

### Herramientas
- Git + GitHub
- Vercel (despliegue frontend)
- Render (despliegue backend)
- MongoDB Atlas (base de datos en la nube)

---

## 📋 Funcionalidades

- ✅ Registro e inicio de sesión de usuarios
- ✅ Autenticación con JWT
- ✅ Agregar libros con título, autor, año y reseña
- ✅ Editar y eliminar libros
- ✅ Marcar libros como Leído o Pendiente
- ✅ Filtrar libros por año
- ✅ Estadísticas: total, leídos y pendientes
- ✅ Interfaz responsiva con diseño azul y blanco

---

## 🔒 Seguridad Implementada

| Vulnerabilidad | Solución Aplicada |
|---|---|
| XSS | React escapa automáticamente + `.escape()` en express-validator |
| Inyección | Mongoose + validación de entradas con express-validator |
| Fuerza bruta | Rate limiting: máximo 5 intentos de login cada 15 minutos |
| Control de acceso | Middleware JWT en todas las rutas protegidas |
| Datos sensibles | Contraseñas encriptadas con Bcrypt + token en sessionStorage |
| Cabeceras HTTP | Helmet activo en todas las peticiones |
| CORS | Configurado para permitir solo el origen del frontend |

---

## 🚀 Cómo ejecutar el proyecto localmente

### Requisitos previos
- Node.js v18 o superior
- Cuenta en MongoDB Atlas

### Backend
```bash
cd libros-backend
npm install
```

Crea un archivo `.env` con:
```
PORT=5000
MONGODB_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
```

Inicia el servidor:
```bash
npm run dev
```

### Frontend
```bash
cd MiListaLibros
npm install
```

Crea un archivo `.env` con:
```
VITE_API_URL=http://localhost:5000/api
```

Inicia la app:
```bash
npm run dev
```

---

## 📁 Estructura del Proyecto

```
MiListaDeLibros-DEV-OPS/
│
├── MiListaLibros/              ← Frontend (React)
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   └── ModalLibro.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   └── Libros.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── variables.css
│   └── package.json
│
└── libros-backend/             ← Backend (Node.js)
    ├── src/
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── Libro.js
    │   │   └── Usuario.js
    │   ├── routes/
    │   │   ├── libros.js
    │   │   └── usuarios.js
    │   └── index.js
    └── package.json
```

---

## 🌐 API Endpoints

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/usuarios/registro` | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | Iniciar sesión |

### Libros (requieren token JWT)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/libros` | Obtener todos los libros del usuario |
| POST | `/api/libros` | Agregar nuevo libro |
| PUT | `/api/libros/:id` | Editar un libro |
| DELETE | `/api/libros/:id` | Eliminar un libro |
| GET | `/api/libros/estadisticas` | Ver estadísticas de lectura |

---



*Proyecto desarrollado para la materia Desarrollo de Software Web — 2026*
