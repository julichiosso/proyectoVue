<template>
  <div class="main-ctn">
    <div class="section">
      <h1 class="principal-title">Editar perfil</h1>
      <p class="subtitle">Personalizá tu perfil acá</p>

      <div class="content">
        <div class="content-section">
          <h2>Nombre en pantalla</h2>
          <p>Ingresá tu nuevo nombre</p>

          <input
            type="text"
            v-model="nuevoNombre"
            class="input"
            placeholder="Tu nuevo nombre"
          />
          <button class="btn" @click="actualizarNombre">
            Actualizar mi nombre
          </button>
          <p class="proximamente">
            Proximamente podrás ponerte una foto tuya como icono!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const nuevoNombre = ref('')


function actualizarNombre() {
  if (nuevoNombre.value.trim() === '') return
  userStore.updateName(nuevoNombre.value.trim())
  nuevoNombre.value = ''
  alert('Actualizaste tu nombre del sistema satisfactoriamente');
}


</script>
<style scoped>
.main-ctn {
  border-radius: 6px;
  background: #f3f4f6;
  padding: 2rem;
  font-family: "Inter", sans-serif;
  color: #1e1e1e;
}

.principal-title {
  font-weight: 700;
}

.subtitle {
  color: #71717a;
  font-size: 16px;
  margin-bottom: 1.5rem;
}

p{
    color: #71717a;
}

.content {
  display: flex;
  gap: 1.5rem;
}

.content-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

.proximamente{
    font-weight: 700;
    float: right;
    margin: 0;
}
.btn {
  background: #4A0080;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 20px;
}

.btn:hover{
    background: #5b21b6;
}

.msg{
  font-weight: 400;
  color: #71717a;
}
</style>