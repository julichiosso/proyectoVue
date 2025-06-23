<template>
    <MainView></MainView>
</template>

<script setup>
import MainView from './views/MainView.vue';

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

body {
  background: linear-gradient(135deg, #0a0f1c, #1e3c72);
  font-family: 'Segoe UI', sans-serif;
}
main {
  flex: 1; /* Esto es clave: empuja al footer hacia abajo */
}
#app {
  flex: 1; /* ocupa todo el espacio posible */
  display: flex;
  flex-direction: column;
}
footer {
  background: linear-gradient(180deg, #0b1d42, #061124); /* o el color que uses */
  color: white;
  padding: 20px;
  text-align: center;
}
</style>