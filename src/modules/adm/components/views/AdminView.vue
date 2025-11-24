<template>
  <div class="transaction-history">
    <div class="header">
      <h1>Administración de Clientes</h1>
      <p>Gestioná todos los clientes registrados en el sistema.</p>
    </div>

    <div class="transactions-box">
      <div class="transactions-header">
        <div>
          <h2>Lista de Clientes</h2>
          <p>Administrá, modificá o eliminá clientes.</p>
        </div>
      </div>

      <!-- LOADING y ERROR -->
      <p v-if="loading">Cargando clientes...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <!-- TABLA -->
      <table v-if="clients.length > 0" class="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(cl, index) in clients" :key="cl.id">
            <td>{{ cl.id }}</td>
            <td>{{ cl.nombre }}</td>
            <td>{{ cl.email }}</td>

            <!-- MENÚ -->
            <td class="menu-cell">
              <button class="menu-btn" @click.stop="toggleMenu(index)">⋯</button>

              <div v-if="activeMenu === index" class="dropdown" @click.stop>
                <p class="dropdown-title">Acciones</p>
                <p @click.stop="viewClient(cl)">Ver</p>
                <p @click.stop="openEdit(cl)">Editar</p>
                <p class="delete" @click.stop="openDelete(cl)">Eliminar</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No hay clientes registrados.</p>

      <!-- ===== MODAL OVERLAY ===== -->
      <div v-if="modal.visible" class="modal-overlay" @click="closeModal"></div>

      <!-- ===== MODAL CARD ===== -->
      <div v-if="modal.visible" class="modal-card">
        <h3 class="modal-title">{{ modal.title }}</h3>

        <div class="modal-body">

          <!-- VER -->
          <div v-if="modal.type === 'view'">
            <p><strong>ID:</strong> {{ modal.data.id }}</p>
            <p><strong>Nombre:</strong> {{ modal.data.nombre }}</p>
            <p><strong>Email:</strong> {{ modal.data.email }}</p>
          </div>

          <!-- EDITAR -->
          <div v-if="modal.type === 'edit'" class="edit-form">
            <label>Nombre</label>
            <input v-model="editData.nombre" />

            <label>Email</label>
            <input v-model="editData.email" />

            <button class="primary-btn" @click="guardarEdicion">Guardar Cambios</button>
          </div>

          <!-- ELIMINAR -->
          <div v-if="modal.type === 'delete'">
            <p>¿Seguro que deseas eliminar al cliente <strong>{{ modal.data.nombre }}</strong>?</p>
            <button class="delete-btn" @click="confirmDelete">Eliminar</button>
          </div>

        </div>

        <button class="close-btn" @click="closeModal">Cerrar</button>
      </div>

      <!-- TOAST -->
      <div v-if="toast.visible" class="toast">{{ toast.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";

/* ---------------- TOAST ---------------- */
const toast = ref({ visible: false, message: "" });
function showToast(msg) {
  toast.value.message = msg;
  toast.value.visible = true;
  setTimeout(() => (toast.value.visible = false), 2500);
}

/* ---------------- ESTADOS ---------------- */
const clients = ref([]);
const loading = ref(false);
const error = ref("");

const activeMenu = ref(null);

const modal = ref({
  visible: false,
  type: null,
  title: "",
  data: null,
});

const editData = ref({
  id: null,
  nombre: "",
  email: "",
});

/* ---------------- MENU ---------------- */
function toggleMenu(index) {
  activeMenu.value = activeMenu.value === index ? null : index;
}

function handleClickOutside(event) {
  const cell = event.target.closest(".menu-cell");
  const drop = event.target.closest(".dropdown");
  if (!cell && !drop) activeMenu.value = null;
}

/* ---------------- MODAL ---------------- */
function closeModal() {
  modal.value.visible = false;
  activeMenu.value = null;
}

function viewClient(cl) {
  modal.value = {
    visible: true,
    type: "view",
    title: "Detalles del Cliente",
    data: { ...cl },
  };
}

function openEdit(cl) {
  modal.value = {
    visible: true,
    type: "edit",
    title: "Editar Cliente",
    data: cl,
  };

  editData.value = {
    id: cl.id,
    nombre: cl.nombre,
    email: cl.email,
  };
}

function openDelete(cl) {
  modal.value = {
    visible: true,
    type: "delete",
    title: "Eliminar Cliente",
    data: cl,
  };
}

/* ---------------- EDITAR ---------------- */
async function guardarEdicion() {
  try {
    await axios.put(`http://localhost:5272/api/Cliente/${editData.value.id}`, {
      id: editData.value.id,
      nombre: editData.value.nombre,
      email: editData.value.email,
    });

    await cargarClientes();
    showToast("Cliente actualizado correctamente");
    closeModal();
  } catch (err) {
    console.error(err);
  }
}

/* ---------------- ELIMINAR ---------------- */
async function confirmDelete() {
  try {
    await axios.delete(`http://localhost:5272/api/Cliente/${modal.value.data.id}`);
    clients.value = clients.value.filter(c => c.id !== modal.value.data.id);
    showToast("Cliente eliminado");
    closeModal();
  } catch (err) {
    console.error(err);
  }
}

/* ---------------- CARGAR CLIENTES ---------------- */
async function cargarClientes() {
  loading.value = true;
  try {
    const resp = await axios.get("http://localhost:5272/api/Cliente");
    clients.value = resp.data;
  } catch {
    error.value = "Error al cargar clientes.";
  }
  loading.value = false;
}

/* ---------------- MOUNT ---------------- */
onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await cargarClientes();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Copiado exactamente desde historial.vue para misma estética */

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

/* ---- MENÚ ---- */
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

/* ---- MODAL ---- */
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

.edit-form label {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.edit-form input {
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

/* TOAST */
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

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}
</style>
