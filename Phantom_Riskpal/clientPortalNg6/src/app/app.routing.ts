/**
 * Created by Salman mustafa
 */
import {NgModule} from '@angular/core';
import { Routes, RouterModule, provideRoutes, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { SecureComponent } from './layout/secure/secure.component';
import { PublicComponent } from './layout/public/public.component';
import { LoginComponent } from './core/login/login.component';
import { NotfoundComponent } from '@app/core/notfound/notfound.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import {ActivateUserComponent } from './core/activate-user/activate-user.component';
import { AppPreloadingStrategy } from './app.preload-strategy';
import { AccessEmergencyComponent } from '@app/core/access-emergency/access-emergency.component';
const secureRoutes: Routes = [

  {
    path: 'dashboard',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard],
    data: { preload: true, delay: false },
  },
  {
    path: 'department',
    loadChildren: './modules/department/department.module#DepartmentModule',
    canActivate: [AuthGuard],
    data: { preload: true, delay: false }
  },
  {
    path: 'user',
    loadChildren: './modules/user/user.module#UserModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: false }
  },
  {
    path: 'profile',
    loadChildren: './modules/profile/profile.module#ProfileModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: true }
  },
  {
    path: 'client',
    loadChildren: './modules/client/client.module#ClientModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: true }
  },
  {
    path: 'ra-template',
    loadChildren: './modules/ra-template/ra-template.module#RaTemplateModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: false }
  },
  {
    path: 'supplier',
    loadChildren: './modules/supplier/supplier.module#SupplierModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: false }
  },
  {
    path: 'manage-riskpal',
    loadChildren: './modules/manage-riskpal/manage-riskpal.module#ManageRiskpalModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: false }
  },
  {
    path: 'ra',
    loadChildren: './modules/ra/ra.module#RaModule' ,
    canActivate: [AuthGuard],
    data: { preload: true, delay: false }
  },
  { path: '', redirectTo: 'dashboard', pathMatch: "full" }
];


// define main routes
const appRoutes: Routes = [
  { path: 'secure', component: SecureComponent, canActivate: [AuthGuard],
     data: { title: 'Secure View' }, children: secureRoutes },
  { path: 'login',  component: LoginComponent },
  { path: 'reset-password/:id',  component: ResetPasswordComponent },
  { path: 'activate-account/:id',  component: ActivateUserComponent },
  { path: 'access-emergency/:id/:status', component: AccessEmergencyComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'notfound', pathMatch: 'full' },
  // { path: 'notfound', component: NotfoundComponent },

];
// , {preloadingStrategy: PreloadAllModules}
@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: AppPreloadingStrategy, scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule],
    providers: [AppPreloadingStrategy]
  })
  export class AppRouters {}