import { useState } from 'react'
import { crearLibro, actualizarLibro } from '../services/api'

export default function ModalLibro({ libro, usuarioId, onGuardado, onCerrar }) {
  const [form, setForm] = useState({
    titulo: libro?.titulo || '',
    autor: libro?.autor || '',
    year: libro?.year || '',
    review: libro?.review || '',
    estado: libro?.estado || 'pendiente'
  })
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      const datos = {
        ...form,
        year: form.year ? Number(form.year) : undefined,
        usuarioId
      }
      if (libro) {
        await actualizarLibro(libro._id, datos)
      } else {
        await crearLibro(datos)
      }
      onGuardado()
    } finally {
      setCargando(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: 'var(--borde)',
    borderRadius: 'var(--radio-md)',
    background: 'var(--azul-fondo)',
    fontSize: '13px',
    color: 'var(--azul-oscuro)',
    boxSizing: 'border-box',
    outline: 'none'
  }

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--azul-texto)',
    display: 'block',
    marginBottom: '4px'
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 40, 80, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--blanco)',
        borderRadius: 'var(--radio-lg)',
        border: 'var(--borde)',
        padding: '24px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: 'var(--sombra)'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--azul-oscuro)' }}>
            {libro ? '✏️ Editar libro' : '📖 Agregar nuevo libro'}
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--azul-texto)'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Título y Autor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Título *</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                placeholder="Título del libro"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Autor *</label>
              <input
                name="autor"
                value={form.autor}
                onChange={handleChange}
                required
                placeholder="Nombre del autor"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Año y Estado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Año</label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="2024"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="pendiente">Pendiente</option>
                <option value="leido">Leído</option>
              </select>
            </div>
          </div>

          {/* Reseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Reseña</label>
            <textarea
              name="review"
              value={form.review}
              onChange={handleChange}
              placeholder="Escribe tu reseña aquí..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCerrar}
              style={{
                background: 'var(--blanco)',
                color: 'var(--azul-profundo)',
                border: 'var(--borde)',
                borderRadius: 'var(--radio-md)',
                padding: '9px 18px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              style={{
                background: cargando ? 'var(--azul-medio)' : 'var(--azul-profundo)',
                color: 'var(--blanco)',
                border: 'none',
                borderRadius: 'var(--radio-md)',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: cargando ? 'not-allowed' : 'pointer'
              }}
            >
              {cargando ? 'Guardando...' : 'Guardar libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}