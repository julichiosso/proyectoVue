<template>
  <div class="layout">
    <SideBar />

    <main class="main-content">
      <h1>Registrar Cliente</h1>
      <form class="form" @submit.prevent="registrarCliente">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="cliente.nombre" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="cliente.email" required />
        </div>

        <button type="submit" @click="limpiarCargado">Registrar</button> <br>
        
            <p class="msjCargado">Cliente registrado exitosamente ✔️ <span><a href="https://criptoya.com/" target="_blank" class="compraLink">Comprar</a></span></p>
            
      
        
      </form>

     
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import SideBar from '@/components/SideBar.vue'

const cliente = reactive({
  nombre: '',
  email: ''
})

function registrarCliente() {
  console.log('Cliente registrado:', cliente)
}

</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Proxima Nova', sans-serif;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #1f2937;
}

.form {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

input:focus {
  border-color: #2563eb;
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background-color: #1e40af;
    transition: 0.8s;
    transform: translateY(-3px);
}

.msjCargado {
    color: #343a40;
    top: 40px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #343a40;
}
.compraLink {
    text-decoration: none;
    font-size: 18px;
    color: #5682ad;
    margin-left: 30%;
}

select, option {
  color: black;
}
a:hover {
    transition: 1s;
    transform: translateY(15px);
}
</style>