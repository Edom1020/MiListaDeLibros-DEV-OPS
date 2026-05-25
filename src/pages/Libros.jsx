import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerLibros, eliminarLibro } from '../services/api'
import ModalLibro from '../components/ModalLibro'

export default function Libros() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [libros, setLibros] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [libroEditando, setLibroEditando] = useState(null)
  const [filtroYear, setFiltroYear] = useState('todos')

  useEffect(() => {
    cargarLibros()
  }, [])

  const cargarLibros = async () => {
    const respuesta = await obtenerLibros(usuario.id)
    setLibros(respuesta.data.data)
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  const handleEditar = (libro) => {
    setLibroEditando(libro)
    setMostrarModal(true)
  }

  const handleNuevo = () => {
    setLibroEditando(null)
    setMostrarModal(true)
  }

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar este libro?')) {
      await eliminarLibro(id)
      cargarLibros()
    }
  }

  const handleGuardado = () => {
    setMostrarModal(false)
    cargarLibros()
  }

  const years = ['todos', ...new Set(libros.map(l => l.year).filter(Boolean).sort((a, b) => b - a))]

  const librosFiltrados = filtroYear === 'todos'
    ? libros
    : libros.filter(l => l.year === Number(filtroYear))

  const totalLibros = libros.length
  const leidos = libros.filter(l => l.estado === 'leido').length
  const pendientes = libros.filter(l => l.estado === 'pendiente').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--azul-fondo)', fontFamily: 'var(--fuente-principal)' }}>

      {/* Navbar */}
      <nav style={{
        background: 'var(--azul-profundo)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--sombra)'
      }}>
        <div style={{ color: 'var(--blanco)', fontSize: '16px', fontWeight: '500' }}>
          <img src="/images/books.png" alt="Logo" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
          Mi Lista de Libros
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--azul-nav-texto)', fontSize: '13px' }}>
            Hola, {usuario.nombre}
          </span>
          <button
            onClick={handleCerrarSesion}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'var(--blanco)',
              border: 'none',
              borderRadius: 'var(--radio-sm)',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Título y botón agregar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '500', color: 'var(--azul-oscuro)' }}>
            Mis libros
          </div>
          <button
            onClick={handleNuevo}
            style={{
              background: 'var(--azul-profundo)',
              color: 'var(--blanco)',
              border: 'none',
              borderRadius: 'var(--radio-md)',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            + Agregar libro
          </button>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {[
            { num: totalLibros, label: 'Total libros' },
            { num: leidos, label: 'Leídos' },
            { num: pendientes, label: 'Pendientes' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--blanco)',
              border: 'var(--borde)',
              borderRadius: 'var(--radio-md)',
              padding: '14px',
              textAlign: 'center',
              boxShadow: 'var(--sombra)'
            }}>
              <div style={{ fontSize: '26px', fontWeight: '500', color: 'var(--azul-profundo)' }}>
                {stat.num}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--azul-texto)', marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filtros por año */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setFiltroYear(String(year))}
              style={{
                background: filtroYear === String(year) ? 'var(--azul-profundo)' : 'var(--blanco)',
                color: filtroYear === String(year) ? 'var(--blanco)' : 'var(--azul-texto)',
                border: 'var(--borde)',
                borderRadius: '20px',
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: filtroYear === String(year) ? '500' : '400',
                cursor: 'pointer'
              }}
            >
              {year === 'todos' ? 'Todos' : year}
            </button>
          ))}
        </div>

        {/* Lista de libros */}
        {librosFiltrados.length === 0 ? (
          <div style={{
            background: 'var(--blanco)',
            border: 'var(--borde)',
            borderRadius: 'var(--radio-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--azul-texto)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
            <div style={{ fontSize: '15px' }}>No hay libros aún</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>¡Agrega tu primer libro!</div>
          </div>
        ) : (
          librosFiltrados.map(libro => (
            <div key={libro._id} style={{
              background: 'var(--blanco)',
              border: 'var(--borde)',
              borderRadius: 'var(--radio-lg)',
              padding: '16px 20px',
              marginBottom: '12px',
              boxShadow: 'var(--sombra)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--azul-oscuro)', marginBottom: '4px' }}>
                    {libro.titulo}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--azul-texto)', marginBottom: '6px', display: 'flex', gap: '10px' }}>
                    <span> <img src="/images/writing.png" alt="Autor" style={{ width: '15px', height: '15px', marginRight: '4px' }} /> {libro.autor}</span>
                    {libro.year && <span><img src="/images/calendar.png" alt="Año" style={{ width: '15px', height: '15px', marginRight: '4px' }} /> {libro.year}</span>}
                  </div>
                  {libro.review && (
                    <div style={{ fontSize: '13px', color: 'var(--texto-suave)', fontStyle: 'italic' }}>
                      "{libro.review}"
                    </div>
                  )}
                </div>

                {/* Badge estado */}
                <span style={{
                  background: libro.estado === 'leido' ? 'var(--azul-claro)' : 'var(--amarillo-suave)',
                  color: libro.estado === 'leido' ? 'var(--azul-profundo)' : 'var(--amarillo-texto)',
                  borderRadius: '20px',
                  padding: '3px 12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  marginLeft: '12px'
                }}>
                  {libro.estado === 'leido' ? 'Leído' : 'Pendiente'}
                </span>
              </div>

              {/* Línea divisora */}
              <div style={{ borderTop: 'var(--borde)', margin: '12px 0' }} />

              {/* Botones */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditar(libro)}
                  style={{
                    background: 'var(--azul-claro)',
                    color: 'var(--azul-profundo)',
                    border: 'none',
                    borderRadius: 'var(--radio-sm)',
                    padding: '5px 14px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <img src="/images/edit.png" alt="Editar" style={{ width: '15px', height: '15px', marginRight: '4px' }} />
                   Editar
                </button>
                <button
                  onClick={() => handleEliminar(libro._id)}
                  style={{
                    background: 'var(--rojo-suave)',
                    color: 'var(--rojo-texto)',
                    border: 'none',
                    borderRadius: 'var(--radio-sm)',
                    padding: '5px 14px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <img src="/images/delete.png" alt="Eliminar" style={{ width: '15px', height: '15px', marginRight: '4px' }} />
                   Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <ModalLibro
          libro={libroEditando}
          usuarioId={usuario.id}
          onGuardado={handleGuardado}
          onCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}