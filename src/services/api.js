import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// Agrega el token automáticamente a cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// AUTH
export const registrar = (datos) => API.post('/usuarios/registro', datos)

export const login = async (datos) => {
  const respuesta = await API.post('/usuarios/login', datos)
  // Guardamos el token y adaptamos la respuesta al formato del frontend
  localStorage.setItem('token', respuesta.data.token)
  return {
    data: {
      usuario: {
        id: respuesta.data.id || respuesta.data._id,
        nombre: respuesta.data.nombre,
        email: datos.email
      }
    }
  }
}

// LIBROS — adaptamos year→anio y review→resena
export const obtenerLibros = async () => {
  const respuesta = await API.get('/libros')
  // Convertimos la respuesta del backend al formato del frontend
  const libros = respuesta.data.map(l => ({
    ...l,
    year: l.anio,
    review: l.resena
  }))
  return { data: { data: libros } }
}

export const crearLibro = async (datos) => {
  // Convertimos year→anio y review→resena antes de enviar
  const payload = {
    titulo: datos.titulo,
    autor: datos.autor,
    anio: datos.year,
    resena: datos.review,
    estado: datos.estado
  }
  const respuesta = await API.post('/libros', payload)
  return { data: { data: respuesta.data } }
}

export const actualizarLibro = async (id, datos) => {
  const payload = {
    titulo: datos.titulo,
    autor: datos.autor,
    anio: datos.year,
    resena: datos.review,
    estado: datos.estado
  }
  const respuesta = await API.put(`/libros/${id}`, payload)
  return { data: { data: respuesta.data } }
}

export const eliminarLibro = async (id) => {
  const respuesta = await API.delete(`/libros/${id}`)
  return { data: respuesta.data }
}