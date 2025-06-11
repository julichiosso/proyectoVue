import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     /*{
       path: '/',
       name: 'home',
       component: HomeView,
     },*/
     {
       path: '/Historial',
       name: 'Historial',

       component: () => import('../modules/contador/components/Historial.vue'),
     },
     {
      path: '/lista-de-tareas',
      name: 'lista-de-tareas',

      component: () => import('../modules/listaDeTareas/components/AltaCompra.vue'),
     },
     {
      path: '/registrar',
      name: '',

      component: () => import('../modules/registro/views/RegistrarView.vue'),
     }
  ],
})
 
export default router
