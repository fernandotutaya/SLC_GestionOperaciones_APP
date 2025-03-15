import MaquinaList from '@/views/Configuration/Maquinas/MaquinaList.vue';
import MaquinaForm from '@/views/Configuration/Maquinas/MaquinaForm.vue';

const MaquinaRoutes = {
  path: 'maquinas',
  children: [
    {
      path: '',
      name: 'maquina-list',
      component: MaquinaList,
    },
    {
      path: 'nuevo',
      name: 'maquina-create',
      component: MaquinaForm,
    },
    {
      path: 'editar/:id',
      name: 'maquina-edit',
      component: MaquinaForm,
    },
  ],
};

export default MaquinaRoutes;
