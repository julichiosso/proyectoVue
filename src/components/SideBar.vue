<template>
  <aside class="sidebar">
    <div class="logo-container">
      <img src="../font/png/guyi9.jpg" alt="Crypto Coin Logo" />
      <h1 class="brand">Crypto Coin</h1>
    </div>

    <nav>
      <h2 class="menu-title">Menú</h2>
      <ul class="menu-list">
        <li><router-link to="/lista-de-tareas"><span>🪙</span> Comprar</router-link></li>
        <li><router-link to="/Historial"><span>📜</span>Historial de movimientos</router-link></li>
       
      </ul>
    </nav>
  </aside>
</template>

<script setup>
// Nada por ahora
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: #0c111f;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.logo-container img {
  width: 100px;
  height: 100px;
  border-radius: 20%;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
}

.brand {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.menu-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
  width: 100%;
  color: #7fc4ff;
}

.menu-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.menu-list li {
  margin-bottom: 10px;
}

.menu-list a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  text-decoration: none;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu-list a:hover {
  background-color: #1c273c;
  color: #7fc4ff;
}

.menu-list a.router-link-exact-active {
  background-color: #0052cc;
  color: white;
  font-weight: bold;
}
</style>