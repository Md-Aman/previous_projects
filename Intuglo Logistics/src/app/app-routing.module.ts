import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { customerRouterConfig } from './modules/customer/router-modules/customer-routing.module';
import { supplierRouterConfig } from './modules/supplier/router-modules/supplier-routing.module';
import { adminRouterConfig } from './modules/admin/router-modules/admin-routing.module';
import { customAgentRouterConfig } from './modules/custom-agent/router-modules/custom-agent-routing.module';



const indexRoute: Route = {
    path: '',
    loadChildren: './modules/public/router-modules/public.module#PublicModule'
};

const fallbackRoute: Route = {
    path: '**',
    loadChildren: './modules/public/router-modules/public.module#PublicModule'
};

export const routeConfig = [
    {
        path: '',
        loadChildren: './modules/public/router-modules/public.module#PublicModule'
    },
    ...customerRouterConfig,
    ...supplierRouterConfig,
    ...adminRouterConfig,
    ...customAgentRouterConfig,

    fallbackRoute,
    indexRoute

];
