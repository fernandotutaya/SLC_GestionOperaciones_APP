import EmployeRoutes from './EmployeeRoutes';
import SucursalRoutes from './SucursalRoutes';
import MaquinaRoutes from './MaquinaRoutes';

const MainRoutes = {
    path: '/app',
    name: 'app',
    component: () => import('@/layouts/main/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
        {
            path: '',
            name: 'dashboard',
            component: () => import('@/views/dashboard/DefaultDashboard.vue')
        },
        {
            path: 'operacion',
            name: 'operacion',
            component: () => import('@/layouts/procesos/DefaultProcesoLayout.vue'),
            children: [
                {
                    path: 'lavado',
                    name: 'lavado',
                    component: () => import('@/views/procesos/Lavado.vue')
                },
                {
                    path: 'secado',
                    name: 'secado',
                    component: () => import('@/views/procesos/Secado.vue')
                },
                {
                    path: 'doblado',
                    name: 'doblado',
                    component: () => import('@/views/procesos/Doblado.vue')
                },
                {
                    path: 'planchado',
                    name: 'planchado',
                    component: () => import('@/views/procesos/Planchado.vue')
                }
            ]
        },
        {
            path: 'new',
            name: 'new',
            component: () => import('@/pages/defaults/operation/NewOperacion.vue')
        },
        {
            path: 'config',
            name: 'config',
            component: () => import('@/views/Configuration/ConfigurationView.vue')
        },
        EmployeRoutes,
        SucursalRoutes,
        MaquinaRoutes
    ]
}

export default MainRoutes;