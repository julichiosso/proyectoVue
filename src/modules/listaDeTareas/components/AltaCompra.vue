<template>
  <div class="purchase-container">
    <div class="card">
      <div class="card-header">
        <h2>Comprar Criptomoneda</h2>
      </div>

      <div class="form-group">
        <label for="ClienteId">Cliente</label>
        <input type="number" v-model="datosformulario.ClienteId" required placeholder="ID de Cliente" />
      </div>

      <div class="form-group">
        <label for="crypto">Criptomoneda</label>
        <select v-model="datosformulario.cryptoCode" id="crypto">
          <option disabled value="">Elegí una criptomoneda</option>
          <option v-for="crypto in criptosDisponibles" :key="crypto" :value="crypto">{{ crypto.toUpperCase() }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="cryptoCode">Crypto code:</label>
        <input type="text" v-model="datosformulario.cryptoCode" placeholder="Ingrese el código de la cripto" required />
      </div>

      <div class="form-group">
        <label for="accion">Acción:</label>
        <select v-model="datosformulario.accion" id="accion" required>
          <option disabled value="">¿Qué acción va a realizar?</option>
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Cantidad</label>
        <input type="number" :value="datosformulario.cantidad.toFixed(8)" @input="e => datosformulario.cantidad = parseFloat(e.target.value)" step="0.00000001" min="0.00000001" placeholder="Ej: 0.00000001" />
      </div>

      <div class="form-group">
        <label for="amount">Monto (ARS)</label>
        <input type="text" :value="datosformulario.monto.toLocaleString('es-AR')" readonly placeholder="Precio en pesos" />
        <input type="hidden" v-model="datosformulario.monto" />
      </div>

      <div class="form-group">
        <label for="datetime">Fecha y hora: {{ fechaHoraActual }}</label>
      </div>

      <button @click="registro">Confirmar Compra</button>
      <p v-if="loading" class="loading-mensaje">Cargando...</p>
      <div v-if="mensaje" class="mensaje-exitoso">{{ mensaje }}</div>
      <div v-if="error" class="mensaje-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const mensaje = ref('')
const error = ref('')
const loading = ref(false)

const datosformulario = ref({
  cryptoCode: '',
  accion: 'purchase',
  ClienteId: 1,
  cantidad: 0.00000001,
  monto: 0,
  fechayhora: ''
})

const criptosDisponibles = ['bitcoin', 'ethereum', 'usdc', 'bnb']


const preciosCryptos = async () => {
  try {
    const url = `https://criptoya.com/api/bybit/BTC/ARS/0.1`
    const respuesta = await axios.get(url)
    return respuesta.data.ask
  } catch (err) {
    console.error('Error al obtener precio de cripto:', err)
    throw new Error('No se pudo obtener el precio de la cripto')
  }
}

const calcularMonto = async () => {
  const cripto = datosformulario.value.cryptoCode
  const cantidad = datosformulario.value.cantidad

  if (!cripto || cantidad <= 0) {
    datosformulario.value.monto = 0
    return
  }

  try {
    const precio = await preciosCryptos(cripto)
    const montoTotal = cantidad * precio
    datosformulario.value.monto = parseFloat(montoTotal.toFixed(2))
  } catch (err) {
    error.value = 'No se pudo calcular el monto'
    datosformulario.value.monto = 0
  }
}


watch(() => [datosformulario.value.cryptoCode, datosformulario.value.cantidad], calcularMonto)

const registro = async () => {
  mensaje.value = ''
  error.value = ''

  if (!datosformulario.value.cryptoCode || !datosformulario.value.cantidad) {
    error.value = 'Complete los campos obligatorios'
    return
  }

  if (datosformulario.value.cantidad <= 0) {
    error.value = 'La cantidad debe ser mayor a 0'
    return
  }

  try {
    loading.value = true
    await calcularMonto()

    const compra = {
      cryptoCode: datosformulario.value.cryptoCode,
      accion: datosformulario.value.accion,
      ClienteId: datosformulario.value.ClienteId,
      cantidad: parseFloat(datosformulario.value.cantidad),
      monto: parseFloat(datosformulario.value.monto),
      fechaHora: new Date().toISOString()
    }

    console.log("Enviando al backend:", JSON.stringify(compra, null, 2))
    await axios.post('http://localhost:5272/api/Transactions', compra)

    mensaje.value = '✅ Datos enviados al backend'

    datosformulario.value = {
      cryptoCode: '',
      accion: 'purchase',
      ClienteId: 1,
      cantidad: 0.00000001,
      monto: 0,
      fechayhora: ''
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error al enviar los datos al backend'
  } finally {
    loading.value = false
  }
}

const fechaHoraActual = ref('')

function formatearFechaHora(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

function actualizarFechaHora() {
  fechaHoraActual.value = formatearFechaHora(new Date())
}

let intervalo

onMounted(() => {
  actualizarFechaHora()
  intervalo = setInterval(actualizarFechaHora, 60000)
})

onBeforeUnmount(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.purchase-container {
  border-radius: 15px;
  background: linear-gradient(135deg, #0a0f1c, #1e3c72);
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
margin-bottom: 40px;
  background: linear-gradient(to bottom right, #f8fafc, #e2e8f0);
  border-radius: 1.2rem;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
}

.card-header p {
  font-size: 0.95rem;
  color: #475569;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 0.4rem;
}
.select-crypto {
  width: 95%;
}
input,
select {
  width: 95%;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  background: white;
  color: #0f172a;
  transition: all 0.3s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.25);
}

button {
  width: 100%;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(14, 165, 233, 0.35);
  transition: all 0.2s;
}

button:hover {
  transform: scale(1.02);
  background: linear-gradient(135deg, #0284c7, #0369a1);
}

.error-msg {
  margin-top: 1rem;
  color: #dc2626;
  font-size: 0.9rem;
  text-align: right;
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
.mensaje-exitoso {
  color: #0f172a;
}

.mensaje-error {
  color: #0f172a;
}

.fechaHora {
  border: 2px solid #0f172a;
  padding: 10px;
  box-shadow: #0f172a;
  border-radius: 0.5rem;
}

.mensaje-error {
  color: #dc2626;
}
.loading-mensaje {
  
  color: #141414;
}


</style>