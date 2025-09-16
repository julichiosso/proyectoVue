<template>
  <div class="new-trade-container">
    <!-- Título -->
    <h1 class="page-title">New Trade</h1>
    <p class="subtitle">Log a new crypto purchase or sale for a client.</p>
  
    <div class="content-wrapper">
      <!-- Trade Details -->
      <div class="card trade-details">
        <h2 class="section-title">Trade Details</h2>
        <p class="section-subtitle">Enter the information for the new trade.</p>
        
        <div class="form-grid">
          <!-- Transaction Type -->
          <div class="form-group">
            <label>Transaction Type</label>
            <select v-model="datosformulario.action" class="input">
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <!-- Date -->
          <div class="form-group">
            <label>Date of Transaction</label>
            <input type="datetime-local" v-model="datosformulario.date" class="input" />
          </div>

          <!-- Client -->
          <div class="form-group full-width">
            <label>Client</label>
            <select v-model="datosformulario.clientId" class="input">
              <option v-for="client in clients" :key="client.Id" :value="client.Id">
                {{ client.nombre }}
              </option>
            </select>
          </div>

          <!-- Cryptocurrency -->
          <div class="form-group">
            <label>Cryptocurrency</label>
            <select v-model="datosformulario.cryptoCode" class="input">
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="usdc">USDC</option>
            </select>
          </div>

          <!-- Amount -->
          <div class="form-group">
            <label>Amount</label>
            <input 
              type="number" 
              v-model.number="datosformulario.cryptoAmount" 
              step="0.00000001" 
              min="0.00000001"
              class="input"
            />
          </div>
        </div>
        

        <!-- Botón, tener cuidado con el margin-top-->
        <button class="btn-primary" @click="registro" :disabled="loading">
          {{ loading ? "Saving..." : "Log Transaction" }}
        </button>

        <p v-if="mensaje" style="color: green; margin-top:10px">{{ mensaje }}</p>
        <p v-if="error" style="color: red; margin-top:10px">{{ error }}</p>
      </div>

      <!-- AI Trade Recommendation (mock) -->
      <div class="card recommendation">
        <h2 class="section-title">AI Trade Recommendation</h2>
        <p class="section-subtitle">
          Get an AI-powered recommendation based on the client's risk profile.
        </p>
        <p class="risk-value">Risk Score: 50</p>
        <div class="risk-score">
          <span style="color: #16A34A;">Low</span>
          <input type="range" min="0" max="100" value="50" class="slider" />
          <span style="color: #DC2626;">High</span>
        </div>
        <button class="btn-primary">Get Recommendation</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const mensaje = ref('')
const error = ref('')
const loading = ref(false)
const clients = ref([])

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5272/api/Cliente")
    clients.value = response.data
  } catch (err) {
    console.error("Error al cargar clientes", err)
    error.value = "Error loading clients"
  }
})

const datosformulario = ref({
  cryptoCode: "bitcoin",
  action: "purchase",
  clientId: null,
  cryptoAmount: 0.00000001,
  date: new Date().toISOString().slice(0, 16)
})

const registro = async () => {
  mensaje.value = ''
  error.value = ''

  if (!datosformulario.value.cryptoCode || 
      !datosformulario.value.clientId || 
      datosformulario.value.cryptoAmount <= 0) {
    error.value = 'Complete all fields correctly'
    return
  }

  try {
    loading.value = true
    
    // Formatear la fecha correctamente para la API
    const payload = {
      ...datosformulario.value,
      date: new Date(datosformulario.value.date).toISOString()
    }

    await axios.post("http://localhost:5272/api/Transactions", payload)
    mensaje.value = '✅ Transaction completed successfully'

    // Resetear formulario
    datosformulario.value.cryptoAmount = 0.00000001
    datosformulario.value.date = new Date().toISOString().slice(0, 16)
    
  } catch (err) {
    console.error('Error:', err)
    error.value = err?.response?.data?.message || err?.response?.data || 'Error sending data'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tus estilos existentes se mantienen igual */
.new-trade-container {
  border-radius: 6px;
  background: #f3f4f6;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #1e1e1e;
}

.page-title {
  color: #030711;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  color: #71717a;
  font-size: 16px;
  margin-bottom: 1.5rem;
}

.content-wrapper {
  display: flex;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.trade-details {
  flex: 2;
}

.recommendation {
  flex: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
}

.section-subtitle {
  font-size: 14px;
  color: #71717a;
  margin: 6px 0px 0px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  color: #030711;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 1px;
  margin-top: 5px;
}

.input {
  background: #f0f0f0;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  margin: 8px 0px 0px;
  padding: 8px 12px;
  font-size: 0.95rem;
  outline: none;
}

.input:focus {
  border-color: #6d28d9;
  box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.2);
}

.btn-recommendation {
  margin-top: 20px;
  background: #4A0080;
  color: #fafafa;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  margin-top: 20px;
  background: #4A0080;
  color: #fafafa;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5b21b6;
}

.risk-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.slider {
  flex: 1;
  accent-color: #6d28d9;
}

.risk-value {
  margin: 8px 0px 6px;
  font-weight: 600;
  font-size: 14px;
}
</style>