<template>
  <div class="layout">
    <SideBar class="sidebar" />
    
    <div class="main-content">
      <Header />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/SideBar.vue'
import Header from '../components/Header.vue'
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

/* para q el sidebar quede fijo siempre+ */
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left .25s ease-in-out;
}

.sidebar.collapsed + .main-content {
  margin-left: 80px;
}
</style>
