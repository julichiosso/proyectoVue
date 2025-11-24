import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const nombre = ref('Julian C.') // nombre inicial
  const inicialLetra = ref('J')     // inicial para el círculo

  function updateName(nuevoNombre) {
    nombre.value = nuevoNombre
    inicialLetra.value = nuevoNombre ? nuevoNombre.charAt(0).toUpperCase() : '-'
  }

  return { nombre, inicialLetra, updateName }
})