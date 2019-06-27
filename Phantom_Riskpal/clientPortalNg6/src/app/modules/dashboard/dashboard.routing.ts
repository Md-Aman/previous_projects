/**
 * Created by Salman mustafa
 */
import {NgModule} from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard';
import { SecureComponent } from '@app/layout/secure/secure.component';
import { DashboardComponent } from '@app/modules/dashboard/dashboard.component';


// define main routes
export const appRoutes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard],
     data: { title: 'Secure View' }
  },
];