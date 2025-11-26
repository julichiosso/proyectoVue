<template>
  <aside :class="['sidebar', { collapsed }]">
    <div>
      <div class="logo-section">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="2" stroke="currentColor" class="logo-icon">
          <path stroke-linecap="round" stroke-linejoin="round" 
                d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" />
        </svg>
        <span class="logo-text" v-if="!collapsed">CriptoVision</span>
      </div>

      <nav class="menu">
        <router-link :to="{ name: 'dashboard' }" class="menu-item" active-class="active">
          <span v-if="!collapsed">Panel</span>
        </router-link>

        <router-link :to="{ name: 'registro' }" class="menu-item" active-class="active">
          <span v-if="!collapsed">Clientes</span>
        </router-link>

        <router-link :to="{ name: 'historial' }" class="menu-item" active-class="active">
          <span v-if="!collapsed">Historial</span>
        </router-link>

        <router-link :to="{ name: 'lista-de-tareas' }" class="menu-item" active-class="active">
          <span v-if="!collapsed">Comprar</span>
        </router-link>

        <router-link :to="{ name: 'administration' }" class="menu-item" active-class="active">
          <span v-if="!collapsed">Admin</span>
        </router-link>
      </nav>
    </div>

    <div class="bottom-area">
      <button class="toggle-btn" @click="collapsed = !collapsed">
        <span v-if="!collapsed">←</span>
        <span v-else>→</span>
      </button>
      
      <div class="user-section">
        <div class="user-avatar">J</div>
        <router-link :to="{ name: 'usuario' }" class="menu-item" active-class="active">
          <span class="user-name" v-if="!collapsed">Julian C.</span>
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
const collapsed = ref(false)
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #e0e0e0;
  font-family: 'Inter', sans-serif;
  transition: width .25s ease-in-out;
}

.sidebar.collapsed { 
  width: 80px; 
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: black;
}

.logo-text {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.menu-item:hover {
  background-color: #e9ecef;
}

.bottom-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  color: #333;
  width: 100%;
  text-align: center;
  transition: 0.3s;
}

.toggle-btn:hover {
  transform: scale(1.15);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #1d1d1d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  transition: transform .4s ease;
}

.user-avatar:hover {
  transform: rotate(360deg) scale(1.1);
}

.user-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.sidebar.collapsed .user-section {
  justify-content: center;
  gap: 0;
}
</style>
