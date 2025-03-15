const AuthRoutes = {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/layouts/blank/blankLayout.vue'),
    children:  [
        {
            name: 'Login',
            path: '/auth/login',
            component: () => import('@/views/Authentication/auth/LoginPage.vue')
        },
        {
            name: 'Register',
            path: '/auth/register',
            component: () => import('@/views/Authentication/auth/RegisterPage.vue')
        }
    ]
}

export default AuthRoutes;