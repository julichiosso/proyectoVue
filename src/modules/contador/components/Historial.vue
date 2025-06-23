  <template>
    <div class="history-container">
      <div class="card">
        <div class="card-header">
          <h2>📜 Historial de Movimientos</h2>
          <p class="compra" style="color: whitesmoke;">
            Compras y ventas realizadas por los clientes
          </p>

          <div class="buscarCliente"> 
            <p class="seleccion" style="color: whitesmoke;">
              Seleccione el cliente a buscar
            </p>
            <select  id="clientes" v-model="clienteSeleccionado" required>
            <option
            v-for="cliente in clientes"
            :key="cliente.id"
            :value="cliente.id"
            >
            {{ cliente.nombre.toUpperCase() }}
            </option>
            </select>

            <p style="color: #e2e8f0;">Clientes cargados: {{ clientes.length }}</p>
            <p style="color: #e2e8f0;">Movimientos cargados: {{ movimientos.length }}</p>
          </div>

          <button @click="obtenerMovimientos">Buscar</button>
        </div>

      <div v-if="movimientos.length === 0" class="empty-msg">
        No hay movimientos registrados todavía.
      </div>
 
      <div v-if="movimientos.length > 0" class="modern-movements">
  <div
    v-for="(mov, index) in movimientos"
    :key="index"
    class="movement-card"
  >
    <div class="movement-icon" :class="mov.accion === 'Compra' ? 'buy' : 'sell'">
      <span class="material-symbols-outlined">
        {{ mov.accion === 'Compra' ? 'trending_up' : 'trending_down' }}
      </span>
    </div>

    <div class="movement-info">
      <div class="movement-header">
        <h3>{{ mov.cryptoCode.toUpperCase() }}</h3>
        <span class="action-tag" :class="mov.accion === 'Compra' ? 'buy' : 'sell'">
          {{ mov.accion }}
        </span>
      </div>

      <div class="movement-body">
        <p class="monto">{{ formatCurrency(mov.montoARS) }}</p>
        <p class="detalle">Cantidad: {{ mov.cantidad }}</p>
        <p class="detalle">Fecha: {{ formatFecha(mov.fechaHora) }}</p>
      </div>
    </div>
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
  const ultimaTransaccion = ref(null)

  function guardarTransaccion() {
    // Lógica para guardar (ejemplo simulado aquí)
    ultimaTransaccion.value = { ...datosformulario.value }
  }
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:5272/api/Cliente')
      console.log('Respuesta cruda de API clientes:', response.data)
      
      // Ajuste según la estructura real
      clientes.value = Array.isArray(response.data) ? response.data : response.data.data

      console.log('Clientes cargados en clientes.value:', clientes.value)
    } catch (error) {
      console.error('Error al obtener clientes:', error)
    }
  })
  const obtenerMovimientos = async () => {
    

    try {
      const response = await axios.get(
        `http://localhost:5272/api/Transactions/${clienteSeleccionado.value}`
      );

      console.log('Datos recibidos API:', response.data);

      if (Array.isArray(response.data)) {
        movimientos.value = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        movimientos.value = response.data.data;
      } else {
        movimientos.value = [];
      }
      } catch (error) {
      console.error('Error al obtener transacciones:', error);
      movimientos.value = [];
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
    border-radius: 15px;
    background: linear-gradient(135deg, #0a0f1c, #1e3c72);
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
    color: #a0afc4;
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

  .movement-cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.movement-card-gradient {
  background: linear-gradient(135deg, #1e3a8a, #0ea5e9);
  padding: 1.5rem;
  border-radius: 1.2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  color: #f8fafc;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.movement-card-gradient:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.4);
}

.card-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.crypto-code {
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.badge.compra {
  background-color: #22c55e;
  color: #fff;
}

.badge.venta {
  background-color: #ef4444;
  color: #fff;
}

.card-body-info p {
  margin: 0.2rem 0;
  font-size: 0.95rem;
  color: #e2e8f0;
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


.modern-movements {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.movement-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.movement-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.movement-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.2rem;
}

.movement-icon.buy {
  background: #10b981;
}

.movement-icon.sell {
  background: #ef4444;
}

.material-symbols-outlined {
  color: white;
  font-size: 28px;
}

.movement-info {
  flex: 1;
}

.movement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.movement-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #f1f5f9;
}

.action-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  color: white;
}

.action-tag.buy {
  background: #10b981;
}

.action-tag.sell {
  background: #ef4444;
}

.movement-body {
  margin-top: 6px;
}

.monto {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 4px 0;
}

.detalle {
  font-size: 0.85rem;
  color: #cbd5e1;
  margin: 2px 0;
}
  </style>