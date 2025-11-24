<template>
  <div class="dashboard">
    <!-- Header -->
    <h1 class="title">Panel Principal</h1>

    <!-- Tarjetas de estadísticas -->
    <div class="cards">
      <div class="card">
        <p class="label">Valor total de la cartera</p>
        <p class="value">${{ summary.totalPortfolioValue?.toLocaleString() || "0.00" }}</p>
        <p class="change positive">+{{ summary.changePercent || 0 }}% respecto al período anterior</p>
      </div>

      <div class="card">
        <p class="label">Rendimiento 24h</p>
        <p class="value positive">+ ${{ summary.dailyPerformance?.toLocaleString() || "0.00" }}</p>
        <p class="change positive">+{{ summary.dailyChange || 0 }}% respecto al período anterior</p>
      </div>

      <div class="card">
        <p class="label">Ganancia / Pérdida total</p>
        <p class="value">${{ summary.totalPL?.toLocaleString() || "0.00" }}</p>
        <p class="change positive">+{{ summary.profitPercent || 0 }}% respecto al período anterior</p>
      </div>

      <div class="card">
        <p class="label">Peor Cripto (24h)</p>
        <p class="value">{{ summary.worstPerformer || "-" }}</p>
        <p class="change negative">{{ summary.worstPerformerChange || 0 }}% desde el último período</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main">
      <!-- Transacciones recientes -->
      <div class="transactions">
        <div class="transactions-header">
          <div>
            <h2>Transacciones recientes</h2>
            <p class="subtitle">Últimas 5 transacciones de todos los clientes.</p>
          </div>
          <router-link to="/historial" class="view-all">Ver todas</router-link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Valor (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in recentTransactions" :key="tx.id">
              <td>
                <p class="client-name">{{ tx.clientName }}</p>
                <p class="client-email">{{ tx.clientEmail }}</p>
              </td>
              <td><span class="tag purchase">{{ tx.type }}</span></td>
              <td>{{ tx.amount }} {{ tx.crypto }}</td>
              <td>${{ tx.valueUsd?.toLocaleString() || "0.00" }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 📊 Gráfico con precio actual -->
<div class="chart-card">
  <div class="chart-header">
    <div class="price-header">
      <h3>Evolución de precios</h3>
      <p class="current-price" v-if="currentPrice">
        Precio actual {{ selectedCrypto.toUpperCase() }}:
        <span>${{ currentPrice.toLocaleString() }}</span>
      </p>
    </div>

    <!-- 🔥 BOTONES EN VEZ DE SELECT -->
    <div class="crypto-buttons">
      <button
        v-for="c in ['btc', 'eth', 'usdc']"
        :key="c"
        :class="['crypto-btn', { active: selectedCrypto === c }]"
        @click="selectedCrypto = c; fetchData();"
      >
        {{ c.toUpperCase() }}
      </button>
    </div>
  </div>

  <Line v-if="chartData" :data="chartData" :options="chartOptions" />
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, CategoryScale, LinearScale, PointElement
} from 'chart.js'
import { eventBus } from "@/eventBus";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const selectedCrypto = ref('btc')
const chartData = ref(null)
const currentPrice = ref(null)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: { enabled: true }
  },
  scales: {
    y: {
      ticks: { color: '#4F46E5' },
      grid: { color: 'rgba(0,0,0,0.05)' }
    },
    x: {
      ticks: { color: '#4B5563' },
      grid: { display: false }
    }
  }
}

const fetchData = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:5272/api/Transactions/precio/historial/${selectedCrypto.value}`
    );

    currentPrice.value = data[data.length - 1]?.precio || null;

    // 📉 MEDIA MÓVIL (SMA 5)
    const sma = data.map((d, i, arr) =>
      i < 4 ? null : arr.slice(i - 4, i + 1).reduce((a, b) => a + b.precio, 0) / 5
    );

    chartData.value = {
      labels: data.map(item =>
        new Date(item.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
      ),
      datasets: [
        {
          label: `${selectedCrypto.value.toUpperCase()} - Precio real`,
          data: data.map(item => item.precio),
          borderColor: "#2563eb",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
          backgroundColor: (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
            g.addColorStop(0, "rgba(37,99,235,0.4)");
            g.addColorStop(1, "rgba(37,99,235,0)");
            return g;
          }
        },
        {
          label: "Media móvil (SMA 5)",
          data: sma,
          borderColor: "#9333ea",
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [5, 5]
        }
      ]
    };
  } catch (error) {
    console.error("Error al cargar datos del gráfico:", error);
  }
};

onMounted(fetchData)


// ------------------------------
// 📊 Estado del dashboard
// ------------------------------
const summary = ref({
  totalPortfolioValue: 0,
  changePercent: 0,
  dailyPerformance: 0,
  dailyChange: 0,
  totalPL: 0,
  profitPercent: 0,
  worstPerformer: "-",
  worstPerformerChange: 0,
});

const recentTransactions = ref([]);


// ------------------------------
// 🔄 FUNCIÓN CENTRAL QUE RECARGA TODO EL DASHBOARD
// ------------------------------
async function cargarDashboard() {
  try {
    const summaryRes = await axios.get("http://localhost:5272/api/Dashboard/summary");
    const transactionsRes = await axios.get("http://localhost:5272/api/Transactions/recent");

    summary.value = summaryRes.data;
    recentTransactions.value = transactionsRes.data;

    await actualizarPrecios();
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
  }
}


// ------------------------------
// 🎯 AL INICIAR, LO CARGA
// ------------------------------
onMounted(() => {
  cargarDashboard();
});


// ------------------------------
// 🟢 ESCUCHAR EVENTO PARA ACTUALIZAR DASHBOARD EN TIEMPO REAL
// ------------------------------
eventBus.on("transaccion-creada", async () => {
  console.log("Recibido evento de nueva transacción → refrescando dashboard...");
  await cargarDashboard();   // 🔥 Recarga todo automáticamente
});


// ------------------------------
// 💰 Obtener precios desde backend
// ------------------------------
async function actualizarPrecios() {
  try {
    const [btc, eth] = await Promise.all([
      axios.get("http://localhost:5272/api/Transactions/precio/btc"),
      axios.get("http://localhost:5272/api/Transactions/precio/eth"),
    ]);

    // Si querés, podés usarlos.
    // No los toco porque tu UI actual no los usa directamente.
  } catch (error) {
    console.warn("No se pudieron actualizar los precios:", error);
  }
}
</script>


<style scoped>
.dashboard {
  border-radius: 6px;
  color: #030711;
  background: #f3f4f6;
  min-height: 100vh;
  padding: 24px;
  font-family: sans-serif;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.label {
  
  font-size: 14px;
  color: #030711;
}

.value {
  font-size: 22px;
  font-weight: bold;
  margin: 4px 0;
}

.value.positive {
  color: #16a34a;
}

.change {
  font-size: 12px;
}

.positive {
  color: #16a34a;
}

.negative {
  color: #dc2626;
}

.main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.transactions, .portfolio {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  padding: 16px;
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.subtitle {
  color: #6b7280;
  font-size: 12px;
}

.view-all {
  text-decoration: none;
  background: #6d28d9;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  color: #6b7280;
}

th, td {
  padding: 8px 0;
  text-align: left;
}

tr {
  border-bottom: 1px solid #e5e7eb;
}

.client-name {
  font-weight: 500;
}

.client-email {
  font-size: 12px;
  color: #6b7280;
}

.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.purchase {
  background: #dcfce7;
  color: #15803d;
}

.portfolio {
  text-align: center;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
select {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
}
select:hover {
  border-color: #4F46E5;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  gap: 24px;
  margin-top: 20px;
}

.price-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.current-price {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.current-price span {
  color: #16a34a;
  font-weight: 600;
}


.crypto-buttons {
  display: flex;
  gap: 8px;
}

.crypto-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.crypto-btn:hover {
  background: #f3f4f6;
}

.crypto-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

</style>
