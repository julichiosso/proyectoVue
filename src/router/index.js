import { createRouter, createWebHistory } from 'vue-router'
import Historial from '../modules/contador/components/Historial.vue'
import Dashboard from '../modules/dashboard/views/Dashboard.vue'
import ListaDeTareas from '../modules/listaDeTareas/components/AltaCompra.vue'
import Registro from '../modules/registro/views/RegistrarView.vue'
import Admin from '../modules/adm/components/views/AdminView.vue'
import Usuario from '../modules/user/views/UsuarioView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     /*{
       path: '/',
       name: 'home',
       component: HomeView,
     },*/
     {
      path: '/dashboard',
      name: 'dashboard',

      component: Dashboard

     },
     {
       path: '/historial',
       name: 'historial',

       component: Historial
     },
     {
      path: '/lista-de-tareas',
      name: 'lista-de-tareas',

      component: ListaDeTareas,
     },
     {
      path: '/registro',
      name: 'registro',

      component: Registro
     },
     {
      path: '/administration',
      name: 'administration',

      component: Admin
     },
     {
      path: '/usuario',
      name: 'usuario',
      
      component: Usuario
     },
  ],
})
 
export default router
