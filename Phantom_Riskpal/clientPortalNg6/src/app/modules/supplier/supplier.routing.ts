import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';

import { AuthGuard } from './../../core/guards/auth.guard';

import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { ListComponent } from './list/list.component';

// define main routes
export const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: 'create', component: SupplierFormComponent},
    { path: '', redirectTo: 'list'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SupplierRouting { }