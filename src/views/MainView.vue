<template>
    

    <body>
        <div class="container">
    <Header></Header>
    <SideBar></SideBar>
    
    <div class="content">
        <router-view></router-view>
    </div>
    <div class="datos-notebook">
       
        
    
    </div>
    
</div>
    </body>


<Footer/>
</template>

<script setup>

import SideBar from '../components/SideBar.vue';
import Header from '../components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<style>


main {
  flex: 1; /* Esto hace que el contenido principal ocupe el espacio restante */
}
body { 
    display: flex;
  flex-direction: column;
  min-height: 100vh;
    margin: 0;
    background-color: #0F3D57;
    color: #ECEFF1;
}
.container {
    display: flex;
}
.content {
    
    flex: 1;
    padding: 20px;
}
</style>