<template>
  <div class="history-container">
    <div class="card">
      <div class="card-header">
        <h2>📜 Historial de Movimientos</h2>
        <p class="compra">Compras y ventas realizadas por los clientes</p>

        <div class="buscarCliente">
          <p class="seleccion">Seleccione el cliente a buscar</p>
          <select id="clientes" v-model="clienteSeleccionado" required>
            <option disabled value="">Seleccione un cliente</option>
            <option class="opciones" v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
              {{ cliente.nombre.toUpperCase() }}
            </option>
          </select>
        </div>

        <button @click="obtenerMovimientos">Buscar</button>
      </div>

      <div v-if="movimientos.length === 0" class="empty-msg">
        No hay movimientos registrados todavía.
      </div>

      <div v-else>
        <ul class="movement-list">
          <li v-for="mov in movimientos" :key="mov.id" class="movement-card">
            <div class="movement-info">
              <h3>
                {{ mov.action === 'purchase' ? '🟢 Compra de' : '🔴 Venta de' }} {{ mov.crypto_code.toUpperCase() }}
              </h3>
              <p>👤 Cliente ID: <strong>{{ mov.client_id }}</strong></p>
              <p>💱 Cantidad: {{ parseFloat(mov.crypto_amount).toFixed(8) }} @ {{ formatCurrency(parseFloat(mov.money)) }} ARS</p>
            </div>
            <div class="movement-meta">
              <p class="amount">{{ formatCurrency(parseFloat(mov.money)) }} ARS</p>
              <p class="date">{{ formatFecha(mov.datetime) }}</p>
            </div>
            <button class="informacion" @click="mostrarInfo(mov)">Información</button>
            <button class="modificar">Modificar</button>
            <button class="eliminar">Eliminar</button>
          </li>
        </ul>
      </div>

      <div v-if="datosformulario.id !== 0" class="formulario-detalle">
        <div class="form-group">
          <label for="crypto">Criptomoneda:</label>
          <p id="crypto">{{ datosformulario.cryptoCode }}</p>
        </div>

        <div class="form-group">
          <label for="cantidad">Cantidad:</label>
          <p id="cantidad">{{ datosformulario.cantidad.toFixed(8) }}</p>
        </div>

        <div class="form-group">
          <label for="accion">Acción:</label>
          <p id="accion">{{ datosformulario.accion }}</p>
        </div>

        <div class="form-group">
          <label for="monto">Monto:</label>
          <p id="monto">{{ datosformulario.monto }}</p>
        </div>

        <div class="form-group">
          <label for="fechayhora">Fecha y Hora:</label>
          <p id="fechayhora">{{ formatFecha(datosformulario.fechayhora) }}</p>
        </div>

        <div class="form-group">
          <label for="id">ID:</label>
          <p id="id">{{ datosformulario.id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clientes = ref([])
const clienteSeleccionado = ref('')
const movimientos = ref([])

const datosformulario = ref({
  id: 0,
  cryptoCode: '',
  accion: '',
  cantidad: 0,
  monto: 0,
  fechayhora: ''
})

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5272/api/Cliente')
    console.log(response);
    clientes.value = response.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
  }
})

const obtenerMovimientos = async () => {
  if (!clienteSeleccionado.value) return
  try {
    const response = await axios.get(`http://localhost:5272/api/Transactions=${clienteSeleccionado.value}`)
    movimientos.value = response.data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
  } catch (error) {
    console.error('Error al obtener transacciones:', error)
  }
}

function formatCurrency(value) {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS'
  })
}

function formatFecha(fechaISO) {
  const date = new Date(fechaISO)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.opciones {
  
}
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #dfdcdc;
}
h2 {
  color: wheat;
}
p {
 
  color: #0984ff;
  padding: 10px;
  border-radius: 10px;
  font-weight: 500;
}

button {
  margin-top: 20px;
  padding: 12px 20px;
  border: 2px solid #ffffff;
  background-color: transparent;
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

button:hover {
  background-color: #ffffff;
  color: #003366;
  transform: translateY(-2px);
}
.clientes-container {
  width: 90%;
  max-width: 600px;
  margin: 40px auto;
  background-color: #007bff;
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.clientes-header {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 25px;
}

.clientes-header h2 {
  margin: 0;
  color: #003366;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.clientes-container select {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  background-color: white;
  color: #003366;
}

.eliminar, .modificar, .informacion{
background-color: #1e293b;
margin: 10px;
float: right;
align-items: center;
gap:20px
}
.eliminar:hover, .modificar:hover, .informacion:hover{
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    border: 2px solid #1e293b;
    background-color: #ffffff;
    color: black;
}

.card {
  max-height: 80vh; /* altura máxima visible */
  overflow-y: auto; /* activa scroll vertical */
  padding-right: 10px;
  scroll-behavior:smooth;  
}
#clientes {
  width: 80%;
  height: 20%;
  padding: 10px;
  border: 3px solid #0f172a;
  border-radius: 15px;
}
.history-container {
  background: #0f172a;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card {
  background: linear-gradient(to bottom right, #041d36, #5387cc);
  border-radius: 1.2rem;
  padding: 2rem;
  width: 100%;
  max-width: 720px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease;
}

.card-header {
  margin-bottom: 1.5rem;
  text-align: center;
}
select, option{
  color: black;
}
.card-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ececec;
}

.card-header p {
  font-size: 0.95rem;
  color: #475569;
}

.empty-msg {
  text-align: center;
  color: #64748b;
  padding: 2rem 0;
  font-size: 1rem;
}

.movement-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.movement-card {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background 0.3s ease;
}

.movement-card:hover {
  background-color: #f0f9ff;
}

.movement-info h3 {
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.movement-info p {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.3rem;
}

.movement-meta {
  text-align: right;
}

.amount {
  font-size: 1.1rem;
  font-weight: bold;
  color: #059669;
}

.date {
  font-size: 0.8rem;
  color: #94a3b8;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
  border-radius: 4px;
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
</style>