<template>
  <div class="register-client-container">
    <!-- Título -->
    <h1 class="page-title">Nuevo Cliente</h1>
    <p class="subtitle">Registrá un nuevo cliente en el sistema.</p>

    <!-- Card -->
    <div class="card">
      <h2 class="section-title">Detalles del cliente</h2>
      <p class="section-subtitle">Ingresá la información para el nuevo cliente</p>

      <!-- Form -->
      <div class="form-grid">
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Nombre</label>
          <input
            id="name"
            type="text"
            class="input"
            placeholder="Nombre completo"
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
            placeholder="Email que utiliza"
            v-model="datosCliente.email"
          />
        </div>
      </div> <!-- cierre .form-grid -->

      <!-- Botón -->
      <button class="btn-primary" @click="registrarCliente">Registrar Cliente</button>

      <p v-if="mensaje" style="color: green">{{ mensaje }}</p>
      <p v-if="error" style="color: red">{{ error }}</p>
    </div> <!-- cierre card -->
  </div> <!-- cierre container -->
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'

const mensaje = ref('')
const error = ref('')
const loading = ref(false)

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

    await axios.post('http://localhost:5272/api/Cliente', cliente)

    mostrarMensajeTemporal('exito', 'Cliente registrado correctamente')

    datosCliente.value = {
      nombre: '',
      email: ''
    }
  } catch (err) {
    mostrarMensajeTemporal('error', 'Error al guardar en SQL: ' + err.message)
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

input {
  border: 1px solid transparent;
  background: #fafcff;
  border-radius: 10px;
  font-size: 15px;
  padding: 10px 14px;
  transition: 0.25s ease;
}

input:hover {
  background: #f2edf5;
}

input:focus {
  border: 1px solid #ffffff;
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
