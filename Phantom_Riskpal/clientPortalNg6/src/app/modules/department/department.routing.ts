import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard';
import { DepartmentComponent } from './department.component';


// define main routes
export const appRoutes: Routes = [
  {
    path: '', component: DepartmentComponent, canActivate: [AuthGuard]
  },
];