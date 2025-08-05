<template>
  <div class="layout">
    <main class="main-content main-grid">
      <!-- Formulario de Registro -->
      <div class="formulario-cliente">
        <h1>Registrar Cliente</h1>
        <form class="form" @submit.prevent="registrarCliente">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="datosCliente.nombre" placeholder="Tu nombre..." required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="datosCliente.email" placeholder="Ingresá tu email acá" required />
          </div>

          <button type="submit">Registrar</button>
          
          <div v-if="mensaje" class="mensaje-exitoso"><br>{{ mensaje }}</div>
          <div v-if="error" class="mensaje-error">{{ error }}</div>
          <div v-if="loading" class="mensaje-cargando">{{ loading }}</div>
        </form>
      </div>

      <!-- Tabla de Clientes -->
      <div class="clientes-cargados">
        <h2 class="titulo-clientes">Clientes Registrados</h2>
        <div class="tabla-contenedor">
          <table v-if="listaClientes.length > 0" class="tabla-clientes">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Registrado</th>
              </tr>
            </thead>
            <tbody>
              <tr
              v-for="(cliente, index) in listaClientes"
              :key="cliente.id"
              :class="{ 'nuevo-cliente': cliente.esNuevo }"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ cliente.nombre }}</td>
                <td>{{ cliente.email }}</td>
                <td>{{ new Date(cliente.fechaRegistro).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
</div>
  
</template>

<script setup>
// logica main registrar.vue
import { reactive, ref, onMounted } from 'vue'
  
import axios from 'axios'

const mensaje = ref('')
const error = ref('')
const loading = ref(false)

const listaClientes = ref([])

// Obtener lista de clientes desde el backend
const obtenerClientes = async () => {
  try {
    const res = await axios.get('http://localhost:5272/api/Cliente')
    listaClientes.value = res.data
  } catch (err) {
    console.error('Error al obtener clientes:', err)
    error.value = 'No se pudieron cargar los clientes.'
  }
}

// Se ejecuta automáticamente cuando se monta el componente
onMounted(() => {
  obtenerClientes();
})

const datosCliente = ref({
  nombre: '',
  email: ''
})

const registrarCliente = async () => {
  mensaje.value = ''
  error.value = ''

  if (!datosCliente.value.nombre || !datosCliente.value.email) {
    error.value = 'Todos los campos son obligatorios.'
    return
  }

  if (!datosCliente.value.email.includes('@')) {
    error.value = 'El email que ingresó es invalido.'
    return
  }

  try {
    loading.value = true

    const cliente = {
    nombre: datosCliente.value.nombre,
    email: datosCliente.value.email,
    fechaRegistro: new Date().toISOString()
    }

    const response = await axios.post('http://localhost:5272/api/Cliente', cliente)

    const clienteNuevo = {
      ...response.data,
      esNuevo: true, // ✅ marcar como "nuevo"
      fechaRegistro: new Date(response.data.fechaRegistro).toISOString() // congelar formato fijo

    }

    listaClientes.value.push(clienteNuevo) // lo mostramos arriba

    // ✅ Luego de 5s lo "normalizamos" y reordenamos por fecha
    setTimeout(() => {
      clienteNuevo.esNuevo = false

      listaClientes.value.sort((a, b) =>
        new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
      )
    }, 5000)

    mensaje.value = '✅ Cliente registrado correctamente'

    datosCliente.value = {
      nombre: '',
      email: ''
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error al guardar en SQL: ' + err.message 
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>

.nuevo-cliente {
  background-color: #22c55e !important; /* verde */
  color: white;
  font-weight: bold;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Proxima Nova', sans-serif;
  background: linear-gradient(135deg, #0a0f1c, #1e3c72);
  border-radius: 15px;
}

.main-content {
  flex: 1;
  padding: 2rem;
  padding-bottom: 0;
}

h1 {
  margin-bottom: 2rem;
  color: #818994;
}

.form {
    animation: fadeIn 0.6s ease-out;
  background: linear-gradient(135deg, #0a0f1c, #1e3c72);
  padding: 2rem;
  border-radius: 1.2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.719);
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f5f7fa;
}

input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #0a0f1c;
  font-size: 1rem;
  color: #1f2937;
}

input:focus {
  border-color: #2563eb;
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background-color: #1e40af;
    transition: 0.8s;
    transform: translateY(-3px);
}

.msjCargado, .msjError {
    color: #343a40;
    top: 40px;
    padding: 8px;
    border-radius: 5px;
    
}
.compraLink {
    text-decoration: none;
    font-size: 16px;
    color: #5682ad;
    margin-left: 30%;
}
.aError {
  text-decoration: none;
    font-size: 14px;
    color: #5682ad;
    margin-left: 28%;
}
.compraLink:hover {
  text-decoration: underline;
  color: #193b85;
  transition: 1s;
}
.aError:hover {
  text-decoration: underline;
  color: #193b85;
  transition: 1s;
}

#email {
  width: 95%;
}
#nombre {
  width: 95%;
}

@keyframes fadeIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
/*PARA VER LA TABLA CON LOS CLIENTES QUE YA ESTAN CARGADOS*/
.clientes-cargados {
  
  background-color: #0f172a;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease;
}

.titulo-clientes {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.tabla-contenedor {
  max-height: 300px; /* Altura máxima visible */
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #64748b transparent;
}

.tabla-contenedor::-webkit-scrollbar {
  width: 8px;
}

.tabla-contenedor::-webkit-scrollbar-track {
  background: transparent;
}

.tabla-contenedor::-webkit-scrollbar-thumb {
  background-color: #64748b;
  border-radius: 4px;
}
.tabla-clientes {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
}

.tabla-clientes thead {
  background-color: #1e3a8a;
  color: white;
}

.tabla-clientes th,
.tabla-clientes td {
  padding: 1rem;
  text-align: left;
  color: #e2e8f0;
  border-bottom: 1px solid #2c3e50;
}

.tabla-clientes tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transition: 0.3s;
}
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}

.formulario-cliente {
  animation: fadeIn 0.6s ease-in-out;
}

.clientes-cargados {
  background-color: #0f172a;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.6s ease-in-out;
}

.titulo-clientes {
  color: #f3f4f6;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.tabla-contenedor {
  overflow-x: auto;
}

.tabla-clientes {
  width: 100%;
  border-collapse: collapse;
  color: #e2e8f0;
  background-color: #1e293b;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tabla-clientes thead {
  background-color: #1d4ed8;
  color: white;
}

.tabla-clientes th,
.tabla-clientes td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #334155;
}

.tabla-clientes tbody tr:hover {
  background-color: #334155;
  transition: background-color 0.3s ease;
}



</style>