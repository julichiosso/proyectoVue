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
    width: 200px;
    background-color: #f0f0f0;
    padding: 20px;

}
</style>