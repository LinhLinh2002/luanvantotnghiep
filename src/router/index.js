import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/HomeView.vue')
        },
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                //Admin
                {
                    path: '/books',
                    name: 'books',
                    component: () => import('@/views/pages/admin/books/index.vue')
                },
                {
                    path: '/books/add',
                    name: 'book_add',
                    component: () => import('@/views/pages/admin/books/create.vue')
                },
                {
                    path: '/books/:id/edit',
                    name: 'book_edit',
                    component: () => import('@/views/pages/admin/books/edit.vue')
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: () => import('@/views/pages/admin/categories/index.vue')
                },
                {
                    path: '/authors',
                    name: 'authors',
                    component: () => import('@/views/pages/admin/authors/index.vue')
                },
                {
                    path: '/translators',
                    name: 'translators',
                    component: () => import('@/views/pages/admin/translators/index.vue')
                },
                {
                    path: '/publishers',
                    name: 'publishers',
                    component: () => import('@/views/pages/admin/publishers/index.vue')
                },
                {
                    path: '/discount',
                    name: 'discount',
                    component: () => import('@/views/pages/admin/discount/index.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/admin/users/index.vue')
                },
                {
                    path: '/orders',
                    name: 'orders',
                    component: () => import('@/views/pages/admin/orders/index.vue')
                },

                //Form
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        //HomaPage
        {
            path: '/bookstore',
            name: 'bookstore',
            component: () => import('@/views/pages/Home/BookStore.vue')
        },
        {
            path: '/index2',
            name: 'index',
            component: () => import('@/views/pages/Home/index.vue')
        },
        {
            path: '/books/:id',
            name: 'bookdetails',
            component: () => import('@/views/pages/Home/BookDetails.vue'),
            props: true,

        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/pages/Home/Cart.vue'),

        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/pages/Home/Profile.vue'),

        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('@/views/pages/Home/Checkout.vue'),

        },
        {
            path: '/order',
            name: 'order',
            component: () => import('@/views/pages/Home/Order.vue'),

        },
        {
            path: '/order/:id',
            name: 'orderdetails',
            component: () => import('@/views/pages/Home/OrderDetails.vue'),

        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        //User
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },

        {
            path: '/auth/forgot',
            name: 'forgot',
            component: () => import('@/views/pages/auth/Forgot.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        }
    ]
});

export default router;
