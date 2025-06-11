// src/stores/weatherStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { getTemperaturas } from "../helpers/getWeather";

export const useWeatherStore = defineStore("weather", () => {
  const temperaturas = ref([]); 

  const setTemperaturas = (nuevasTemps) => {
    temperaturas.value = nuevasTemps;
  };

  const fetchTemperaturas = async () => {
    const datos = await getTemperaturas(); // ahora devuelve array completo
    setTemperaturas(datos);
  };

  const limpiarTemperaturas = () => {
    temperaturas.value = [];
  }
  return {
    temperaturas,
    setTemperaturas,
    fetchTemperaturas,
    limpiarTemperaturas,
  };
});