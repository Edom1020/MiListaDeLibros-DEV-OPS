import { createContext, useContext, useState, useEffect } from 'react'
import { obtenerPerfil } from '../services/api'

export const AuthCtx = createContext()

export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [autenticando, setAutenticando] = useState(true)

  // Al cargar la app, verificamos si hay un token válido
  useEffect(() => {
    const verificarSesion = async () => {
      const token = sessionStorage.getItem('token')
      if (token) {
        try {
          const respuesta = await obtenerPerfil()
          setUsuario(respuesta.data)
        } catch (error) {
          cerrarSesion()
        }
      }
      setAutenticando(false)
    }
    verificarSesion()
  }, [])

  const iniciarSesion = (datos) => {
    setUsuario(datos)
  }

  const cerrarSesion = () => {
    setUsuario(null)
    sessionStorage.removeItem('token')
  }

  return (
    <AuthCtx.Provider value={{ usuario, autenticando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthCtx.Provider>
  )
}