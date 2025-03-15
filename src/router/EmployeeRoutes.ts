import EmployeeList from '@/views/Configuration/Empleados/EmployeeList.vue';
import EmployeeForm from '@/views/Configuration/Empleados/EmployeeForm.vue';

const EmployeeRoutes = {
  path: 'empleados',
  children: [
    {
      path: '',
      name: 'employee-list',
      component: EmployeeList,
    },
    {
      path: 'nuevo',
      name: 'employee-create',
      component: EmployeeForm,
    },
    {
      path: 'editar/:id',
      name: 'employee-edit',
      component: EmployeeForm,
    },
  ],
};

export default EmployeeRoutes;