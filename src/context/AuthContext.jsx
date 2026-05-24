import { createContext, useContext, useState } from 'react'

export const AuthCtx = createContext()

export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario')) || null
  )

  const iniciarSesion = (datos) => {
    setUsuario(datos)
    localStorage.setItem('usuario', JSON.stringify(datos))
  }

const cerrarSesion = () => {
  setUsuario(null)
  localStorage.removeItem('usuario')
  localStorage.removeItem('token') 
}

  return (
    <AuthCtx.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthCtx.Provider>
  )
}