<template>
  <div class="register-client-container">
    <!-- Título -->
    <h1 class="page-title">New Client</h1>
    <p class="subtitle">Register a new client in the system.</p>

    <!-- Card -->
    <div class="card">
      <h2 class="section-title">Client Details</h2>
      <p class="section-subtitle">Enter the information for the new client.</p>

      <!-- Form -->
      <div class="form-grid">
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            class="input"
            placeholder="Enter full name"
            v-model="datosCliente.nombre"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            class="input"
            placeholder="Enter email address"
            v-model="datosCliente.email"
          />
        </div>
      </div> <!-- 🔹 cierre de .form-grid -->

      <!-- Botón -->
      <button class="btn-primary" @click="registrarCliente">Register Client</button>
      <p v-if="mensaje" style="color: green">{{ mensaje }}</p>
      <p v-if="error" style="color: red">{{ error }}</p>
    </div> <!-- 🔹 cierre de .card -->
  </div> <!-- 🔹 cierre de .register-client-container -->
</template>


<script setup>
import { ref, onMounted } from 'vue'
  
import axios from 'axios'

const mensaje = ref('')
const error = ref('')
const loading = ref(false)

const mostrarPopup = ref(false)
const mostrarConfirmacion = ref(false)

const clienteAEliminar = ref(null)
const clienteEditado = ref({ nombre: '', email: '', id: null })
const clienteSeleccionado = ref(null)
const listaClientes = ref([])

const datosCliente = ref({
  nombre: '',
  email: ''
})

const mostrarMensajeTemporal = async (tipo, texto) => {
  if (tipo === 'exito') mensaje.value = texto
  if (tipo === 'error') error.value = texto

  await nextTick()

  setTimeout(() => {
    if (tipo === 'exito') mensaje.value = ''
    if (tipo === 'error') error.value = ''
  }, 3500)
}

const obtenerClientes = async () => {
  try {
    loading.value = true
    const res = await axios.get('http://localhost:5272/api/Cliente')
    listaClientes.value = res.data
  } catch (err) {
    console.error('Error al obtener clientes:', err)
    mostrarMensajeTemporal('error', 'No se pudieron cargar los clientes.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  obtenerClientes()
})

const registrarCliente = async () => {
  mensaje.value = ''
  error.value = ''

  if (!datosCliente.value.nombre.trim() || !datosCliente.value.email.trim()) {
    mostrarMensajeTemporal('error', 'Todos los campos son obligatorios.')
    return
  }

  if (!datosCliente.value.email.includes('@')) {
    mostrarMensajeTemporal('error', 'El email que ingresó es inválido.')
    return
  }

  try {
    loading.value = true

    const cliente = {
      nombre: datosCliente.value.nombre.trim(),
      email: datosCliente.value.email.trim(),
      fechaRegistro: new Date().toISOString()
    }

    const response = await axios.post('http://localhost:5272/api/Cliente', cliente)

    const clienteNuevo = {
      ...response.data,
      esNuevo: true,
      fechaRegistro: new Date(response.data.fechaRegistro).toISOString()
    }

    listaClientes.value.push(clienteNuevo)


  
    setTimeout(() => {

      clienteNuevo.esNuevo = false
      listaClientes.value.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
    }, 5000)

    mostrarMensajeTemporal('exito', '✅ Cliente registrado correctamente')

    datosCliente.value = {
      nombre: '',
      email: ''
    }
  } catch (err) {
    console.error(err)
    mostrarMensajeTemporal('error', 'Error al guardar en SQL: ' + err.message)
  } finally {
    loading.value = false
  }
}

const eliminarCliente = (cliente) => {
      if (!cliente) {
        mostrarMensajeTemporal('error', 'Seleccioná un cliente primero.')
      return
  } 
  clienteAEliminar.value = cliente
  mostrarConfirmacion.value = true
}

const confirmarEliminacion = async () => {
  try {
    loading.value = true
    await axios.delete(`http://localhost:5272/api/Cliente/${clienteAEliminar.value.id}`)
    listaClientes.value = listaClientes.value.filter(c => c.id !== clienteAEliminar.value.id)
    if (clienteSeleccionado.value?.id === clienteAEliminar.value.id) clienteSeleccionado.value = null
    mostrarMensajeTemporal('exito', 'Cliente eliminado con éxito.')
  } catch (err) {
    mostrarMensajeTemporal('error', 'Error al eliminar cliente.')
  } finally {
    loading.value = false
    mostrarConfirmacion.value = false
  }
}

const modificarCliente = (cliente) => {
  if (!cliente) return mostrarMensajeTemporal('error', 'Seleccioná un cliente para modificar.')
  clienteEditado.value = { ...cliente }
  mostrarPopup.value = true
}

const cerrarPopup = () => {
  mostrarPopup.value = false
  clienteEditado.value = { nombre: '', email: '', id: null }
}

const guardarCambios = async () => {
  if (!clienteEditado.value.nombre.trim() || !clienteEditado.value.email.trim()) {
    mostrarMensajeTemporal('error', 'Todos los campos son obligatorios.')
    return
  }
  if (!clienteEditado.value.email.includes('@')) {
    mostrarMensajeTemporal('error', 'El email que ingresó es inválido.')
    return
  }
  try {
    loading.value = true
    await axios.put(`http://localhost:5272/api/Cliente/${clienteEditado.value.id}`, clienteEditado.value)
    const index = listaClientes.value.findIndex(c => c.id === clienteEditado.value.id)
    if (index !== -1) listaClientes.value[index] = { ...clienteEditado.value }
    mostrarMensajeTemporal('exito', 'Cliente modificado con éxito.')
    cerrarPopup()
  } catch (err) {
    mostrarMensajeTemporal('error', 'Error al guardar cambios.')
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
/* Layout General */
.register-client-container {
  border-radius: 6px;
  background: #f3f4f6;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #030711;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
}

.subtitle {
  color: #71717a;
  margin-bottom: 1.5rem;
}

/* Card */
.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  padding: 0px 0px 0px;/**en 0 pero varía depende, estimados: 8px 0px 6px; 6px 0px 8px; 8px 0px 8px*/

}

.section-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

/* Formularios */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

.input:focus {
  border-color: #6d28d9;
  box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.2);
}

/* Botón */
.btn-primary {
  background: #4A0080;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5b21b6;
}
</style>