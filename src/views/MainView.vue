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
</template>

<script setup>
import RegistrarCliente from '@/modules/registro/views/RegistrarView.vue'
import SideBar from '../components/SideBar.vue';
import Header from '../components/Header.vue';

</script>

<style>

body { 
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