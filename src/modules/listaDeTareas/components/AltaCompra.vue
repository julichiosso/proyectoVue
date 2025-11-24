<template>
  <div class="new-trade-container">
    <h1 class="page-title">Nueva compra</h1>
    <p class="subtitle">Registrá una nueva compra o venta de cripto.</p>

    <div class="content-wrapper">
      <div class="card trade-details">
        <h2 class="section-title">Detalles de la Transacción</h2>
        <p class="section-subtitle">Información acerca de la compra.</p>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Tipo de transacción</label>
            <select v-model="datosformulario.action" class="input">
              <option value="buy">Compra</option>
              <option value="sale">Venta</option>
            </select>
          </div>

          <div class="form-group">
            <label>Fecha</label>
            <div class="date-wrapper">
            <input 
              type="datetime-local"
              v-model="datosformulario.date"
              class="input date-input"
              />
              
            </div>
          </div>

          <div class="form-group full-width">
            <label>Cliente</label>
            <select v-model="selectedClientId" class="input">
              <option disabled value="">Seleccioná un cliente</option>
              <option v-for="cliente in clients" :key="cliente.id" :value="cliente.id">{{ cliente.id }} -
                {{ cliente.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Cripto</label>
            <select v-model="datosformulario.cryptoCode" class="input">
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="usdc">USDC</option>
            </select>
          </div>

          <div class="form-group">
            <label>Cantidad</label>
            <input 
              type="number"
              step="0.00000001"
              min="0.00000001"
              v-model="datosformulario.cryptoAmount"
              class="input"
              placeholder="Ej: 0.005"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Precio estimado</label>
          <input 
            type="text"
            :value="estimatedPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
            class="input"
            readonly
          />
        </div>

        <button 
          type="button"
          class="btn-primary"
          @click="registro"
          :disabled="loading"
        >
          {{ loading ? "Guardando..." : "Confirmar y enviar" }}
        </button>

        <p v-if="mensaje" style="color: green; margin-top:10px">{{ mensaje }}</p>
        <p v-if="error" style="color: red; margin-top:10px">{{ error }}</p>
      </div>

      <div class="card recommendation market-panel">
        <h2 class="market-title">Resumen del Mercado</h2>
        <div class="market-grid">
          <div class="market-asset">
            <div class="asset-header">
              <span class="asset-name">Bitcoin</span>
              <span class="asset-code">BTC</span>
            </div>
            <div class="asset-price">
              {{ btcPriceARS ? '$' + btcPriceARS.toLocaleString('es-AR', { maximumFractionDigits: 0 }) : 'Cargando...' }}
            </div>
          </div>

          <div class="market-asset">
            <div class="asset-header">
              <span class="asset-name">Ethereum</span>
              <span class="asset-code">ETH</span>
            </div>
            <div class="asset-price">
              {{ ethPriceARS ? '$' + ethPriceARS.toLocaleString('es-AR', { maximumFractionDigits: 0 }) : 'Cargando...' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { eventBus } from '@/eventBus'  //  <-- AGREGADO

// --- STATE DEL FORMULARIO ---
const selectedClientId = ref('')     
const mensaje = ref('')              
const error = ref('')                
const loading = ref(false)           
const clients = ref([])              

const datosformulario = ref({
  cryptoCode: 'bitcoin',
  action: 'buy',
  cryptoAmount: '0.00000001',
  date: new Date().toISOString().slice(0, 16)
})

// --- CARGA CLIENTES ---
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5272/api/Cliente')
    clients.value = response.data
  } catch (err) {
    console.error('Error al cargar clientes:', err)
    error.value = 'No se pudieron cargar los clientes'
  }
})

// --- REGISTRAR COMPRA ---
const registro = async () => {
  mensaje.value = ''
  error.value = ''

  const rawAmount = String(datosformulario.value.cryptoAmount || '').replace(',', '.')
  const amountParsed = parseFloat(rawAmount)

  if (!selectedClientId.value) {
    error.value = 'Seleccioná un cliente.'
    return
  }
  if (!datosformulario.value.cryptoCode) {
    error.value = 'Seleccioná una cripto.'
    return
  }
  if (isNaN(amountParsed) || amountParsed <= 0) {
    error.value = 'La cantidad debe ser mayor a 0.'
    return
  }
  if (!datosformulario.value.date) {
    error.value = 'Seleccioná una fecha válida.'
    return
  }

  try {
    loading.value = true

    const cryptoMap = {
      bitcoin: 'btc',
      ethereum: 'eth',
      usdc: 'usdc'
    }

    const mapped = cryptoMap[datosformulario.value.cryptoCode.toLowerCase()]

    const payload = {
      cryptoCode: mapped,
      action: 'buy',
      clientId: Number(selectedClientId.value),
      cryptoAmount: Number(amountParsed),
      datetime: new Date(datosformulario.value.date).toISOString()
    }

    const resp = await axios.post(
      'http://localhost:5272/api/Transactions',
      payload
    )

    mensaje.value = '✅ Transacción registrada con éxito'
    error.value = ''

    // 🔥 AVISAR AL DASHBOARD QUE HAY UNA NUEVA TRANSACCIÓN
    eventBus.emit("transaccion-creada")   // <-- AGREGADO

    datosformulario.value.cryptoAmount = '0.00000001'
    datosformulario.value.date = new Date().toISOString().slice(0,16)

  } catch (err) {
    console.error('❌ Error enviando transacción:', err)

    const serverData = err?.response?.data

    if (serverData) {
      if (typeof serverData === 'string') {
        error.value = serverData
      } else if (serverData.errors || serverData.title || serverData.message) {
        error.value = JSON.stringify(serverData)
      } else {
        error.value = JSON.stringify(serverData)
      }
    } else {
      error.value = 'Error al procesar la transacción.'
    }

  } finally {
    loading.value = false
  }
}

// --- PRECIOS ---
const btcPriceARS = ref(0)
const ethPriceARS = ref(0)

onMounted(async () => {
  try {
    const resp = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=ars`
    )
    btcPriceARS.value = resp.data.bitcoin.ars
    ethPriceARS.value = resp.data.ethereum.ars
  } catch {
    console.error('Error cargando precios iniciales')
  }
})

const estimatedPrice = computed(() => {
  const cripto = datosformulario.value.cryptoCode
  const cantidad = parseFloat(datosformulario.value.cryptoAmount) || 0

  const precioUnitario =
    cripto === 'bitcoin'
      ? btcPriceARS.value
      : cripto === 'ethereum'
      ? ethPriceARS.value
      : 0

  return cantidad * precioUnitario
})
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

/* --- INPUTS MÁS MINIMALISTAS --- */
input, select {
  border: 1px solid transparent;
  background: #fafcff;
  border-radius: 10px;
  font-size: 15px;
  padding: 10px 14px;
  transition: 0.25s ease;
}

input:hover, select:hover {
  background: #f2edf5;
}

input:focus, select:focus {
 
  border: 1px solid #ffffff;
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

  .btn-secondary{
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

  .btn-secondary:hover{
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


  /* badge nivel */
.nivel-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.nivel-badge {
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* texto y errores */
.texto-recomendacion {
  margin-top: 10px;
  color: #374151; /* gris oscuro */
}
.error {
  color: #b91c1c;
  margin-top: 8px;
}
.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
/* ===== Market panel styling ===== */
.market-panel {
  max-width: 360px;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  border-left: 4px solid #4A0080; /* acento morado */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* título */
.market-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* grid de activos */
.market-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

/* tarjeta de cada activo */
.market-asset {
  background: #f8fafc; /* gris muy claro */
  border-radius: 0.6rem;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 68px;
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.asset-price {
  margin-top: 6px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.asset-change {
  margin-top: 3px;
  font-size: 0.8rem;
  font-weight: 600;
}

.asset-change.positive { color: #16A34A; }
.asset-change.negative { color: #DC2626; }

/* chart box */
.market-chart { margin-top: 4px; }
.chart-label { font-size: 0.9rem; color: #475569; margin-bottom: 6px; }
.chart-wrapper {
  background: #f8fafc;
  border-radius: 0.6rem;
  padding: 0.6rem;
  height: 120px;
  position: relative;
}

/* noticias */
.market-news { margin-top: 4px; }
.news-title { font-size: 0.95rem; color: #0f172a; font-weight: 600; margin-bottom: 8px; }
.market-news ul {
  margin: 0;
  padding-left: 1rem;
  color: #374151;
  font-size: 0.92rem;
  line-height: 1.35;
}
.market-news li { margin-bottom: 6px; }

/* responsive: apila en pantallas pequeñas */
@media (max-width: 920px) {
  .content-wrapper { flex-direction: column; }
  .market-panel { max-width: 100%; width: 100%; }
}


  </style>