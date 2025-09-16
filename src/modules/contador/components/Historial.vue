<template>
  <div class="transaction-history">
    <div class="header">
      <h1>Transaction History</h1>
      <p>Review all past buy and sell orders.</p>
    </div>

    <div class="transactions-box">
      <div class="transactions-header">
        <div>
          <h2>All Transactions</h2>
          <p>A complete record of all trades.</p>
        </div>
        <div class="actions">
          <select>
            <option>Filter by client...</option>
          </select>
          <button 
          :to="{name: 'AltaCompra'}"
          class="new-trade">+ New Trade</button>
        </div>
      </div>

      <table class="transactions-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Type</th>
            <th>Asset</th>
            <th>Amount</th>
            <th>Value (USD)</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tx, index) in transactions" :key="index">
            <td>{{ tx.client }}</td>
            <td><span class="tag">Purchase</span></td>
            <td>{{ tx.asset }}</td>
            <td>{{ tx.amount }}</td>
            <td class="value">{{ tx.value }}</td>
            <td>{{ tx.date }}</td>
            <td class="menu-cell">
              <button class="menu-btn" @click="toggleMenu(index)">⋯</button>
              <div v-if="activeMenu === index" class="dropdown">
                <p class="dropdown-title">Actions</p>
                <p @click="viewAction(tx)">View</p>
                <p @click="editAction(tx)">Edit</p>
                <p class="delete" @click="deleteAction(tx)">Delete</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeMenu: null,
      transactions: [
        { client: "Pedro Gonzales", asset: "₿ Bitcoin", amount: "0.5000 BTC", value: "$30.000", date: "1/10/2023" },
        { client: "Agustin Ruatta", asset: "♦ Ethereum", amount: "2.0000 ETH", value: "$4000", date: "2/10/2023" },
        { client: "Pedro Gonzales", asset: "💲 USD Coin", amount: "1000.0000 USDC", value: "$1000", date: "3/10/2023" },
        { client: "Fernando Cardona", asset: "₿ Bitcoin", amount: "0.1000 BTC", value: "$6500", date: "4/10/2023" },
        { client: "Pedro Gonzales", asset: "♦ Ethereum", amount: "1.0000 ETH", value: "$2100", date: "5/10/2023" }
      ]
    };
  },
  methods: {
    toggleMenu(index) {
      this.activeMenu = this.activeMenu === index ? null : index;
    },
    viewAction(tx) {
      alert(`Viewing transaction for ${tx.client}`);
    },
    editAction(tx) {
      alert(`Editing transaction for ${tx.client}`);
    },
    deleteAction(tx) {
      alert(`Deleting transaction for ${tx.client}`);
    }
  }
};
</script>

<style scoped>
.transaction-history {
  font-family: Arial, sans-serif;
  background: #f8f8f8;
  padding: 20px;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

.header p {
  color: #666;
  margin-top: 4px;
}

.transactions-box {
  background: white;
  border-radius: 8px;
  margin-top: 20px;
  padding: 20px;
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transactions-header h2 {
  margin: 0;
  font-size: 18px;
}

.transactions-header p {
  margin: 0;
  color: #777;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.new-trade {
  background: #4A0080;
  transition: background 0.2s;
  font-size: 14px;
  font-weight: 600;
  background-color: #c4c4c4;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.new-trade:hover{
  background: #5b21b6;
}
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transactions-table th {
  text-align: left;
  font-weight: bold;
  padding: 10px 0;
  color: #555;
}

.transactions-table td {
  padding: 12px 0;
  border-top: 1px solid #eee;
  font-size: 14px;
}


.tag {
  background: #e6f7ee;
  color: #2d9d4a;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.value {
  color: #c07a00;
}

/* Menú de 3 puntos */
.menu-cell {
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 25px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 120px;
  z-index: 10;
}

.dropdown p {
  margin: 0;
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown p:hover {
  background: #f5f5f5;
}

.dropdown-title {
  font-weight: bold;
  color: #444;
  cursor: default;
}

.delete {
  color: red;
}
</style>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'


const clientes = ref([])
const clienteSeleccionado = ref('')
const movimientos = ref([])

const activeMenu = ref(null);


const transactions = ref([
  { client: "Pedro Gonzales", asset: "₿ Bitcoin", amount: "0.5000 BTC", value: "$30.000", date: "1/10/2023" },
  { client: "Agustin Ruatta", asset: "♦ Ethereum", amount: "2.0000 ETH", value: "$4000", date: "2/10/2023" },
  { client: "Pedro Gonzales", asset: "💲 USD Coin", amount: "1000.0000 USDC", value: "$1000", date: "3/10/2023" },
  { client: "Fernando Cardona", asset: "₿ Bitcoin", amount: "0.1000 BTC", value: "$6500", date: "4/10/2023" },
  { client: "Pedro Gonzales", asset: "♦ Ethereum", amount: "1.0000 ETH", value: "$2100", date: "5/10/2023" }
]);

function toggleMenu(index) {
  activeMenu.value = activeMenu.value === index ? null : index;
}

function viewAction(tx) {
  alert(`Viewing transaction for ${tx.client}`);
}

function editAction(tx) {
  alert(`Editing transaction for ${tx.client}`);
}

function deleteAction(tx) {
  alert(`Deleting transaction for ${tx.client}`);
}


const datosformulario = ref({
  id: 0,
  cryptoCode: '',
  accion: '',
  cantidad: 0,
  monto: 0,
  fechayhora: ''
})

const cryptoNames = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'Tether',
  BNB: 'Bnb',
  // Agrega más según necesites
}

function getCryptoName(code) {
  return cryptoNames[code] || code
}

const ultimaTransaccion = ref(null)

function guardarTransaccion() {
  ultimaTransaccion.value = { ...datosformulario.value }
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5272/api/Cliente')
    clientes.value = Array.isArray(response.data) ? response.data : response.data.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
  }
})

const obtenerMovimientos = async () => {
  if (!clienteSeleccionado.value) {
    alert('Por favor seleccione un cliente.')
    return
  }

  try {
    const response = await axios.get(
      `http://localhost:5272/api/Transactions/byClient/${clienteSeleccionado.value}`
    )
    console.log("Raw movimientos:", response.data)  

    if (Array.isArray(response.data)) {
      movimientos.value = response.data.map(mov => ({
      id: mov.id,
      accion: mov.action === 'purchase' ? 'Compra' : 'Venta',
      cryptoCode: mov.crypto_code,
      cantidad: mov.crypto_amount,                // bien
      montoARS: isNaN(parseFloat(mov.money)) ? 0 : parseFloat(mov.money),
      fechaHora: mov.datetime ? mov.datetime : null
}))
    } else {
      movimientos.value = []
    }
  } catch (error) {
    console.error("Error al obtener las transacciones: ", error)
    movimientos.value = []
  }
}

function mostrarDetalle(mov) {
  datosformulario.value = {
    id: mov.id,
    cryptoCode: mov.cryptoCode,
    accion: mov.accion,
    cantidad: mov.cantidad,
    monto: mov.montoARS,
    fechayhora: mov.fechaHora
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
  return isNaN(date.getTime())
    ? 'Fecha inválida'
    : date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
}
</script>

  <style scoped>
.transaction-history {
  border-radius: 6px;
  font-family: Arial, sans-serif;
  background: #f8f8f8;
  padding: 20px;
}

.header h1 {
  color: #030711;
  font-size: 24px;
  margin: 0;
}

.header p {
  color: #71717a;
  margin-top: 4px;
}

.transactions-box {
  background: white;
  border-radius: 8px;
  margin-top: 20px;
  padding: 20px;
}

.transactions-header {
  color: #030711;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transactions-header h2 {
  margin: 0;
  font-size: 18px;
}

.transactions-header p {
  margin: 0;
  color: #71717a;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.new-trade {
  background-color: #6c2dc7;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transactions-table th {
  text-align: left;
  font-weight: bold;
  padding: 10px 0;
  color: #71717a;
}

.transactions-table td {
  color:#030711;
  padding: 12px 0;
  border-top: 1px solid #eee;
}

.tag {
  background: #e6f7ee;
  color: #2d9d4a;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.value {
  color: #c07a00;
}

.dropdown-title {
  font-size: 14px;
}
.dropdown{
  font-size: 14px;
}
</style>