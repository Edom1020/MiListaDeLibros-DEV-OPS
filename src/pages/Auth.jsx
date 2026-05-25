import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, registrar } from '../services/api'

export default function Auth() {
  const [esLogin, setEsLogin] = useState(true)
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

 // Validación frontend
  if (!esLogin && form.nombre.trim().length < 2) {
    return setError('El nombre debe tener mínimo 2 caracteres')
  }
  if (!form.email.includes('@')) {
    return setError('El email no es válido')
  }
  if (form.password.length < 6) {
    return setError('La contraseña debe tener mínimo 6 caracteres')
  }
  
    try {
      if (!esLogin) await registrar(form)
      const respuesta = await login({ email: form.email, password: form.password })
      iniciarSesion(respuesta.data.usuario)
      navigate('/libros')
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error, intenta de nuevo')
    } finally {
      setCargando(false)
    }
  }


  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--azul-fondo)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--fuente-principal)'
    }}>
      <div style={{
        background: 'var(--blanco)',
        borderRadius: 'var(--radio-lg)',
        border: 'var(--borde)',
        boxShadow: 'var(--sombra)',
        width: '100%',
        maxWidth: '380px',
        overflow: 'hidden'
      }}>

        {/* Header azul */}
        <div style={{
          background: 'var(--azul-profundo)',
          padding: '28px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px' }}><img src="/images/books2.png" alt="Logo" style={{ width: '32px', height: '32px' }} /></div>
          <div style={{
            color: 'var(--blanco)',
            fontSize: '20px',
            fontWeight: '500',
            marginTop: '8px'
          }}>
            Mi Lista de Libros
          </div>
          <div style={{
            color: 'var(--azul-nav-texto)',
            fontSize: '13px',
            marginTop: '4px'
          }}>
            Tu biblioteca personal
          </div>
        </div>

        {/* Tabs Login / Registro */}
        <div style={{
          display: 'flex',
          borderBottom: 'var(--borde)'
        }}>
          <button
            onClick={() => { setEsLogin(true); setError('') }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: esLogin ? 'var(--azul-profundo)' : 'var(--azul-fondo)',
              color: esLogin ? 'var(--blanco)' : 'var(--azul-texto)',
              fontWeight: esLogin ? '500' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setEsLogin(false); setError('') }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: !esLogin ? 'var(--azul-profundo)' : 'var(--azul-fondo)',
              color: !esLogin ? 'var(--blanco)' : 'var(--azul-texto)',
              fontWeight: !esLogin ? '500' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <div style={{ padding: '24px' }}>

          {error && (
            <div style={{
              background: 'var(--rojo-suave)',
              color: 'var(--rojo-texto)',
              border: '0.5px solid #f7c1c1',
              borderRadius: 'var(--radio-md)',
              padding: '10px 14px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Campo nombre — solo en registro */}
            {!esLogin && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  fontSize: '12px',
                  color: 'var(--azul-texto)',
                  display: 'block',
                  marginBottom: '5px'
                }}>
                  Nombre completo
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: 'var(--borde)',
                    borderRadius: 'var(--radio-md)',
                    background: 'var(--azul-fondo)',
                    fontSize: '14px',
                    color: 'var(--azul-oscuro)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                fontSize: '12px',
                color: 'var(--azul-texto)',
                display: 'block',
                marginBottom: '5px'
              }}>
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="usuario@email.com"
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: 'var(--borde)',
                  borderRadius: 'var(--radio-md)',
                  background: 'var(--azul-fondo)',
                  fontSize: '14px',
                  color: 'var(--azul-oscuro)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '12px',
                color: 'var(--azul-texto)',
                display: 'block',
                marginBottom: '5px'
              }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: 'var(--borde)',
                  borderRadius: 'var(--radio-md)',
                  background: 'var(--azul-fondo)',
                  fontSize: '14px',
                  color: 'var(--azul-oscuro)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={cargando}
              style={{
                width: '100%',
                padding: '11px',
                background: cargando ? 'var(--azul-medio)' : 'var(--azul-profundo)',
                color: 'var(--blanco)',
                border: 'none',
                borderRadius: 'var(--radio-md)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: cargando ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {cargando ? 'Cargando...' : esLogin ? 'Entrar' : 'Crear cuenta'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}