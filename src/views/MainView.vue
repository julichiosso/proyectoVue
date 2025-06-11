<template>
<body>
    

<div class="container">
    <Header></Header>
    <SideBar></SideBar>
    <div class="content">
        <router-view></router-view>
    </div>

</div>
</body>
</template>

<script setup>
import SideBar from '../components/SideBar.vue';
import Header from '../components/Header.vue';
</script>

<style>
body { 
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