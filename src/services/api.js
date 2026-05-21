let librosSimulados = [
  { _id: '1', titulo: 'Cien años de soledad', autor: 'García Márquez', year: 1967, review: 'Obra maestra del realismo mágico', estado: 'leido' },
  { _id: '2', titulo: 'El principito', autor: 'Saint-Exupéry', year: 1943, review: 'Clásico imprescindible', estado: 'pendiente' }
]

export const login = async ({ email, password }) => ({
  data: { usuario: { id: '1', nombre: 'Esteban', email } }
})

export const registrar = async (datos) => ({ data: { success: true } })

export const obtenerLibros = async () => ({ data: { data: librosSimulados } })

export const crearLibro = async (datos) => {
  const nuevo = { ...datos, _id: Date.now().toString() }
  librosSimulados.push(nuevo)
  return { data: { data: nuevo } }
}

export const actualizarLibro = async (id, datos) => {
  librosSimulados = librosSimulados.map(l => l._id === id ? { ...l, ...datos } : l)
  return { data: { data: datos } }
}

export const eliminarLibro = async (id) => {
  librosSimulados = librosSimulados.filter(l => l._id !== id)
  return { data: { success: true } }
}