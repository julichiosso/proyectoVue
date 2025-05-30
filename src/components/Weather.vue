<template>
    <div class="info-temp">
        <button class="verMas" @click="verMas">Ver más</button>
        <button class="verMenos" @click="verMenos">Ver menos</button>
        <p>Temperaturas del dia de hoy en la ciudad de Bs.As:</p>
        <ul>
            <li v-for="(temp, index) in weatherStore.temperaturas" :key="index">
          {{ index }} hs: {{ temp }} °C
            </li>
        </ul>
        
    </div>

  </template>
  
  <script setup>

  import { useWeatherStore } from "../stores/weatherStore";
  import { ref } from 'vue';
  const weatherStore = useWeatherStore();

  function verMas(){
    weatherStore.fetchTemperaturas();
  }
  function verMenos(){
    weatherStore.limpiarTemperaturas();
  }

  </script>
  
  <style scoped>
  .info-temp {
    background-color: rgb(102, 102, 95);
    color: white;
    padding: 10px;
    border-radius: 5px;
    width: fit-content;
  }
  </style>