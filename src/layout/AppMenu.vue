<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Admin',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    // {
    //     label: 'UI Components',
    //     items: [
    //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
    //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
    //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
    //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
    //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
    //         { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
    //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
    //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
    //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
    //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
    //         { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    //     ]
    // },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Book Store',
                icon: 'pi pi-fw pi-globe',
                to: '/bookstore'
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Register',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/register'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/forgot'
                    }
                ]
            },
        ]
    },
    {
        label: 'BOOK',
        items: [
            {
                label: 'Authors',
                icon: 'pi pi-fw pi-clone',
                to: '/authors'
            },
            {
                label: 'Books',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'List Books',
                        icon: 'pi pi-fw pi-list',
                        to: '/books'
                    },
                    {
                        label: 'Add Book',
                        icon: 'pi pi-fw pi-list',
                        to: '/books/add'
                    }
                ]
            },
            {
                label: 'Categories',
                icon: 'pi pi-fw pi-id-card',
                to: '/categories'
            },
           
            {
                label: 'Publishers',
                icon: 'pi pi-fw pi-share-alt',
                to: '/publishers'
            },

            {
                label: 'Translator',
                icon: 'pi pi-fw pi-comment',
                to: '/translators'
            },
        ]
    },
    {
        label: 'ADMIN',
        items: [
            {
                label: 'Discount',
                icon: 'pi pi-fw pi-circle',
                to: '/discount'
            },
            {
                label: 'Users',
                icon: 'pi pi-fw pi-sign-in',
                to: '/users'
            },
           
            {
                label: 'Orders',
                icon: 'pi pi-fw pi-calendar',
                to: '/buys'
            },

        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
