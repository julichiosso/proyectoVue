<template>
<div class="lista-tareas">
    <h2>Lista de Tareas</h2>
    <input type="text" v-model="nuevaTarea" @keyup.enter="addTarea">
    <button class="boton-agregar" @click="addTarea">Agregar</button>
    
    <ul>
        <li v-for="(tarea, index) in tareas" :key="index">
            {{ tarea }}
            {{ nuevaTarea }}
            <button @click="deleteTarea(index)">Borrar</button>
            <button class="boton-modificar" @click="updateTarea(index)">Modificar</button>
        </li>
    </ul> 
</div>
</template>

<script setup>
import { ref } from 'vue';
const tareas = ref([]);
const nuevaTarea = ref('');
const addTarea  = () => {
    tareas.value.push(nuevaTarea.value);
    nuevaTarea.value = '';
}
const deleteTarea = (index) => {
    tareas.value.splice(index, 1);

}
const updateTarea = (index) => {
    const nuevaTarea = prompt('Modificar tarea:', tareas.value[index]);
    if (nuevaTarea !== null && nuevaTarea.trim() != ''){
        tareas.value[index] = nuevaTarea.trim();
    }
}
</script>

<style scoped>
.lista-tareas {
    background-color: #45ad;
    width: 30%;
    border-radius: 5px 30px 2px 2px;
    padding: 15px;
}

.lista-tareas h2 {
    font-family:Georgia, Times, 'Times New Roman', serif;

}

.lista-tareas input {
    width: 50%;
}
</style>