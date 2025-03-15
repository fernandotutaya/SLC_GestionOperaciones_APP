
import SucursalList from '@/views/Configuration/Sucursales/SucursalList.vue';
import SucursalForm from '@/views/Configuration/Sucursales/SucursalForm.vue';

const SucursalRoutes = {
  path: 'sucursales',
  children: [
    {
      path: '',
      name: 'sucursal-list',
      component: SucursalList,
    },
    {
      path: 'nuevo',
      name: 'sucursal-create',
      component: SucursalForm,
    },
    {
      path: 'editar/:id',
      name: 'sucursal-edit',
      component: SucursalForm,
    },
  ],
};

export default SucursalRoutes;