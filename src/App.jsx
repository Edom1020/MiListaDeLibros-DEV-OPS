import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Auth from './pages/Auth'
import Libros from './pages/Libros'

function RutaProtegida({ children }) {
  const { usuario, autenticando } = useAuth()

  // Mientras se valida el token con el backend, mostramos una pantalla de carga
  if (autenticando) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Cargando sesión...</div>
  }

  return usuario ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/libros" element={
            <RutaProtegida>
              <Libros />
            </RutaProtegida>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}