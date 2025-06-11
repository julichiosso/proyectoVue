<template>
<div class="sidebar">
    <h2>Menu</h2>
    <ul>
        <li><router-link to="/contador">Contador</router-link></li>
        <li><router-link to="/lista-de-tareas">Lista de tareas</router-link></li>
        <li><router-link to="/registrar">Registrar</router-link></li>
        
    </ul>
</div>
</template>

<script setup>

</script>

<style>
.sidebar {
    margin-top: 160px;
    width: 220px;
    background-color: #1E2A38; /* gris azulado moderno */
    padding: 20px 16px;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    font-family: 'Segoe UI', sans-serif;
    color: #ffffff;
    transition: all 0.3s ease;
}

.sidebar:hover {
    border-radius: 22px;
    background-color: #253449; /* un poco más claro al hacer hover */
}

.sidebar h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
}

.sidebar a {
    display: block;
    color: #ffffff;
    text-decoration: none;
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 8px;
    transition: background-color 0.2s ease;
}

.sidebar a:hover {
    background-color: #1976D2; /* azul vibrante al pasar el mouse */
}
</style>