<template>
  <div class="transaction-history">
    <div class="header">
      <h1>Historial de Transacciones</h1>
      <p>Revise todas las órdenes de compra y venta anteriores.</p>
    </div>

    <div class="transactions-box">
      <div class="transactions-header">
        <div>
          <h2>Todas las transacciones</h2>
          <p>Un registro completo de todas las operaciones.</p>
        </div>
        <div class="actions">
          <select v-model="clienteSeleccionado" @change="obtenerMovimientos">
            <option value="">Filtrar por cliente...</option>
            <option
            v-for="cliente in clientesUnicos"
            :key="cliente.id"
            :value="cliente.id"
            >
              {{ cliente.nombre }}
            </option>

          </select>

          <!-- Botón de nueva compra -->
          <router-link to="/lista-de-tareas" class="new-trade">+ Nueva Compra</router-link>
        </div>
      </div>

      <table class="transactions-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Crypto</th>
            <th>Cantidad</th>
            <th>Valor (ARS)</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(tx, index) in movimientos" :key="tx.id">
            <td>{{ getClientName(tx.clientId) }}</td>
            <td>
              <span class="tag" :class="{ 'tag-sell': tx.accion === 'Venta' }">
                {{ tx.accion === 'Venta' ? 'Venta' : 'Compra' }}
              </span>
            </td>
            <td>{{ getCryptoIcon(tx.cryptoCode) }} {{ getCryptoName(tx.cryptoCode) }}</td>
            <td>{{ tx.cantidad }} {{ tx.cryptoCode }}</td>
            <td class="value">${{ formatUSD(tx.montoARS) }}</td>
            <td>{{ formatDate(tx.fechaHora) }}</td>
            <td class="menu-cell">
              <button class="menu-btn" @click.stop="toggleMenu(index)">⋯</button>
              <div v-if="activeMenu === index" class="dropdown" @click.stop>
                <p class="dropdown-title">Acciones</p>
                <p @click.stop="viewAction(tx)">Ver</p>
                <p @click.stop="editAction(tx)">Editar</p>
                <p class="delete" @click.stop="deleteAction(tx)">Eliminar</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ===== MODAL OVERLAY ===== -->
      <div v-if="modal.visible" class="modal-overlay" @click="closeModal"></div>

      <!-- ===== MODAL CARD ===== -->
      <div v-if="modal.visible" class="modal-card">
        <h3 class="modal-title">{{ modal.title }}</h3>

        <div class="modal-body">
          <!-- Ver -->
          <div v-if="modal.type === 'view'">
            <p><strong>Cliente:</strong> {{ getClientName(modal.tx.clientId) }}</p>
            <p><strong>Tipo:</strong> {{ modal.tx.accion }}</p>
            <p><strong>Crypto:</strong> {{ getCryptoName(modal.tx.cryptoCode) }}</p>
            <p><strong>Cantidad:</strong> {{ modal.tx.cantidad }}</p>
            <p><strong>Valor:</strong> ${{ formatUSD(modal.tx.montoARS) }}</p>
            <p><strong>Fecha:</strong> {{ formatDate(modal.tx.fechaHora) }}</p>
          </div>

          <!-- Edit -->
          <div v-if="modal.type === 'edit'" class="edit-form">
            <label>Cripto</label>
            <select v-model="editData.cryptoCode" class="input">
              <option value="btc">BTC</option>
              <option value="eth">ETH</option>
              <option value="usdc">USDC</option>
            </select>

            <label>Cantidad</label>
            <input v-model="editData.cantidad" type="number" step="0.0001" />

            <label>Valor (ARS)</label>
            <input
              type="text"
              v-model="editData.valorARS"
              class="input"
              readonly
            />

            <button class="primary-btn" @click="guardarEdicion">Guardar Cambios</button>
          </div>

          <!-- Delete -->
          <div v-if="modal.type === 'delete'">
            <p>¿Seguro que deseas eliminar esta transacción?</p>
            <button class="delete-btn" @click="confirmDelete(modal.tx)">Eliminar</button>
          </div>
        </div>

        <button class="close-btn" @click="closeModal">Cerrar</button>
      </div>

      <div v-if="movimientos.length === 0" class="no-transactions">
        <p>No se encontraron transacciones</p>
      </div>
    </div>

    <div v-if="toast.visible" class="toast">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
// ---------- TOAST ----------
const toast = ref({
  visible: false,
  message: ""
})

function showToast(msg) {
  toast.value.message = msg
  toast.value.visible = true
  setTimeout(() => toast.value.visible = false, 2500)
}


// ---------- STATE ----------
const clientes = ref([])
const clienteSeleccionado = ref('')
const movimientos = ref([])
const activeMenu = ref(null)

const modal = ref({
  visible: false,
  type: null,
  title: '',
  tx: null
})

const editData = ref({
  id: null,
  cryptoCode: '',
  cantidad: 0,
  valorARS: 0
})

// ---------- MENU ----------
function toggleMenu(index) {
  activeMenu.value = activeMenu.value === index ? null : index
}

function handleClickOutside(event) {
  const isMenuCell = event.target.closest('.menu-cell')
  const isDropdown = event.target.closest('.dropdown')
  if (isMenuCell || isDropdown) return
  activeMenu.value = null
}

// ---------- MODAL ACTIONS ----------
function viewAction(tx) {
  modal.value = { visible: true, type: 'view', title: 'Detalles de la Transacción', tx: { ...tx } }
}

function editAction(tx) {
  modal.value = {
    visible: true,
    type: 'edit',
    title: 'Editar Transacción',
    tx
  }

  editData.value = {
    id: tx.id,
    cryptoCode: tx.cryptoCode.toLowerCase(),
    cantidad: Number(tx.cantidad),
    valorARS: Number(tx.montoARS)
  }
}

function deleteAction(tx) {
  modal.value = {
    visible: true,
    type: 'delete',
    title: 'Eliminar transacción',
    tx
  }
}

function closeModal() {
  modal.value.visible = false
  activeMenu.value = null
}

// ---------- API HELPERS ----------
const obtenerPrecioActual = async (cripto) => {
  try {
    const resp = await axios.get(`http://localhost:5272/api/Transactions/precio/${cripto}`)
    return resp.data
  } catch {
    return 0
  }
}

// ---------- ACTUALIZAR (PUT robusto: GET -> modify -> PUT) ----------
async function guardarEdicion() {
  try {
    const id = editData.value.id

    if (!id) return console.error("No hay id para editar")

    // 1. Obtener la transacción original del backend
    const getResp = await axios.get(`http://localhost:5272/api/Transactions/${id}`)
    const original = getResp.data

    // 2. Calcular monto nuevo
    let precio = await obtenerPrecioActual(editData.value.cryptoCode)
    let montoARSFinal = precio * Number(editData.value.cantidad)

    // 3. Payload limpio SOLO con lo que el backend quiere
    const payload = {
      id: original.id,
      clientId: original.clientId,
      action: original.action, // buy | sell
      cryptoCode: editData.value.cryptoCode.toUpperCase(),
      cryptoAmount: Number(editData.value.cantidad),
      montoARS: Number(montoARSFinal),
      fechaHora: original.fechaHora
    }

    // 4. PUT al backend
    await axios.put(`http://localhost:5272/api/Transactions/${id}`, payload)

    // 5. Refrescar UI
    modal.value.visible = false
    await obtenerMovimientos()

  } catch (err) {
    console.error("Error guardando edición:", err)
    console.log("Respuesta backend:", err?.response?.data)
  }
}


// ---------- ELIMINAR ----------
async function confirmDelete(tx) {
  try {
    await axios.delete(`http://localhost:5272/api/Transactions/${tx.id}`)
    movimientos.value = movimientos.value.filter(m => m.id !== tx.id)
    closeModal()
    showToast("Transacción eliminada correctamente")
  } catch (err) {
    console.error("Error al borrar:", err)
  }
}



// ---------- HELPERS ----------
function getClientName(id) {
  const c = clientes.value.find(cl => cl.id === id)
  return c ? c.nombre : `Cliente ${id}`
}

const cryptoNames = { btc:"Bitcoin", eth:"Ethereum", usdc:"USD Coin" }
function getCryptoName(code) {
  return cryptoNames[code?.toLowerCase()] || code
}

const cryptoIcons = { btc:"₿", eth:"♦", usdc:"💲" }
function getCryptoIcon(code) {
  return cryptoIcons[code?.toLowerCase()] || "•"
}

function formatUSD(amount) {
  return Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })
}

function formatDate(dateString) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("es-AR")
}

// ---------- MAPEO API REAL ----------
const mapTransaccion = mov => ({
  id: mov.id,
  clientId: mov.clientId,
  accion: mov.action === "buy" ? "Compra" : "Venta",
  cryptoCode: mov.cryptoCode,
  cantidad: Number(mov.cryptoAmount),
  montoARS: Number(mov.montoARS),
  fechaHora: mov.fechaHora
})


// ---------- API TRANSACCIONES ----------
async function obtenerHistorial() {
  try {
    const resp = await axios.get("http://localhost:5272/api/Transactions")
    movimientos.value = resp.data.map(mapTransaccion)
  } catch (err) {
    console.error(err)
  }
}

async function obtenerMovimientos() {
  try {
    const url = clienteSeleccionado.value
      ? `http://localhost:5272/api/Transactions/by-client/${clienteSeleccionado.value}`
      : `http://localhost:5272/api/Transactions`

    const resp = await axios.get(url)
    movimientos.value = resp.data.map(mapTransaccion)
  } catch {
    movimientos.value = []
  }
}

// ---------- WATCH ----------
watch(() => editData.value.cantidad, async () => {
  if (!editData.value.cryptoCode) return
  const precio = await obtenerPrecioActual(editData.value.cryptoCode)
  editData.value.valorARS = (precio * Number(editData.value.cantidad)).toFixed(2)
})

watch(() => editData.value.cryptoCode, async () => {
  if (!editData.value.cantidad) return
  const precio = await obtenerPrecioActual(editData.value.cryptoCode)
  editData.value.valorARS = (precio * Number(editData.value.cantidad)).toFixed(2)
})

// ---------- MOUNT ----------
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  const resp = await axios.get("http://localhost:5272/api/Cliente")
  clientes.value = resp.data

  await obtenerHistorial()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// clientes únicos
const clientesUnicos = computed(() => {
  const mapa = new Map()
  for (const c of clientes.value) {
    if (!mapa.has(c.id)) mapa.set(c.id, c)
  }
  return [...mapa.values()]
})
</script>

<style scoped>
/* === Mantengo todos tus estilos originales === */
.transaction-history {
  font-family: Arial, sans-serif;
  background: #f8f8f8;
  padding: 20px;
  border-radius: 6px;
}

.header h1 {
  font-size: 24px;
  margin: 0;
  color: #030711;
}

.header p {
  color: #71717A;
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
  color: #030711;
}

.transactions-header p {
  margin: 0;
  color: #71717A;  
}

.actions {
  display: flex;
  gap: 10px;
}

.actions select {
  color: #505050;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.new-trade {
  background: #6d28d9;
  color: white;
  transition: background 0.2s;
  font-size: 12px;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
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
  color: #71717A;
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

.tag-sell {
  background: #fde8e8;
  color: #dc2626;
}

.value {
  color: #c07a00;
}

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

.no-transactions {
  text-align: center;
  padding: 20px;
  color: #666;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(2px);
  z-index: 90;
}

.modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 10px;
  padding: 22px;
  width: 320px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

.modal-title {
  margin: 0 0 12px 0;
  color: #111;
  font-size: 18px;
  font-weight: 600;
}

.modal-body p {
  margin: 4px 0;
  color: #444;
}

.edit-form label {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.edit-form input,
.edit-form select {
  width: 100%;
  margin-top: 4px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.primary-btn {
  width: 100%;
  margin-top: 14px;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: #6d28d9;
  color: white;
  cursor: pointer;
  font-size: 14px;
}
.primary-btn:hover {
  background: #5b21b6;
}

.delete-btn {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: #dc2626;
  color: white;
  cursor: pointer;
  font-size: 14px;
}
.delete-btn:hover {
  background: #b91c1c;
}

.close-btn {
  width: 100%;
  margin-top: 14px;
  padding: 6px;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #111827;
  color: white;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  opacity: 0;
  animation: toastIn 0.3s ease forwards;
  z-index: 200;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
