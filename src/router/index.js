import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/HomeView.vue'),
            meta: { title: 'Home' } ,
        },
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { title: 'Admin ' } ,
                },
                //Admin
                {
                    path: '/books',
                    name: 'books',
                    component: () => import('@/views/pages/admin/books/index.vue'),
                    meta: { title: 'Admin - Books' } ,
                },

                {
                    path: '/books/add',
                    name: 'book_add',
                    component: () => import('@/views/pages/admin/books/create.vue'),
                    meta: { title: 'Admin - BookAdd' } ,
                },
                {
                    path: '/books/:id/edit',
                    name: 'book_edit',
                    component: () => import('@/views/pages/admin/books/edit.vue'),
                    meta: { title: 'Admin - BookEdit' } ,
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: () => import('@/views/pages/admin/categories/index.vue'),
                    meta: { title: 'Admin - Categories' } ,
                },
                {
                    path: '/authors',
                    name: 'authors',
                    component: () => import('@/views/pages/admin/authors/index.vue'),
                    meta: { title: 'Admin - Authors' } ,
                },
                {
                    path: '/translators',
                    name: 'translators',
                    component: () => import('@/views/pages/admin/translators/index.vue'),
                    meta: { title: 'Admin - Translators' } ,
                },
                {
                    path: '/publishers',
                    name: 'publishers',
                    component: () => import('@/views/pages/admin/publishers/index.vue'),
                    meta: { title: 'Admin - Publishers' } ,
                },
                {
                    path: '/discount',
                    name: 'discount',
                    component: () => import('@/views/pages/admin/discount/index.vue'),
                    meta: { title: 'Admin - Discount' } ,
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/admin/users/index.vue'),
                    meta: { title: 'Admin - Users' } ,
                },
                {
                    path: '/orders',
                    name: 'orders',
                    component: () => import('@/views/pages/admin/orders/index.vue'),
                    meta: { title: 'Admin - Order' } ,

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
            path: '/filter-books',
            name: 'FilterBooks',
            component: () => import('@/views/pages/Home/FilterBooks.vue')
            ,
            props: (route) => ({
                type: route.query.type || null,
                id: route.query.id || null,
            }),
            meta: { title: 'Lọc Sách' } ,

        },
        {
            path: '/search',
            name: 'SearchResults',
            component: () => import('@/views/pages/Home/SearchResults.vue'),
            props: (route) => ({ query: route.query.query }), // Truyền query dưới dạng props
            meta: { title: 'Tìm Kiếm Kết Quả' } ,

        }
        ,

        {
            path: '/text',
            name: 'text',
            component: () => import('@/views/pages/Home/index.vue')
        },
        {
            path: '/books/:id',
            name: 'bookdetails',
            component: () => import('@/views/pages/Home/BookDetails.vue'),
            props: true,
            meta: { title: 'Chi Tiết Sách' } ,

        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/pages/Home/Cart.vue'),
            meta: { title: 'Chi Tiết Giỏ HàngHàng' } ,

        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/pages/Home/Profile.vue'),
            meta: { title: 'Tài Khoản Cá Nhân' } ,

        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('@/views/pages/Home/Checkout.vue'),
            meta: { title: 'Thanh Toán' } ,

        },
        {
            path: '/order',
            name: 'order',
            component: () => import('@/views/pages/Home/Order.vue'),
            meta: { title: 'Đơn Hàng' } ,

        },
        {
            path: '/order/:id',
            name: 'orderdetails',
            component: () => import('@/views/pages/Home/OrderDetails.vue'),
            meta: { title: 'Chi tiết Đơn Hàng' } ,
        },
        {
            path: '/wishlist',
            name: 'wishlist',
            component: () => import('@/views/pages/Home/WishlistPage.vue'),
            meta: { title: 'Yêu Thích Sách' } ,

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
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: { title: 'Đăng Nhập ' } ,

        },  
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue'),
            meta: { title: 'Đăng Kí ' } ,
        },
        {
            path: '/auth/google/callback',
            name: 'GoogleCallback',
            component: () => import('@/views/pages/auth/Callback.vue')
        },{
            path: '/auth/facebook/callback',
            name: 'FacebookCallback',
            component: () => import('@/views/pages/auth/FCallback.vue')
        },
        {
            path: '/auth/forgot',
            name: 'forgot',
            component: () => import('@/views/pages/auth/Forgot.vue')
        },
        {
            path: '/auth/reset',
            name: 'resetpassword',
            component: () => import('@/views/pages/auth/Resetpassword.vue')
        },
      
    ]
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'BOOKSTORE'; 
    next();
});

export default router;
