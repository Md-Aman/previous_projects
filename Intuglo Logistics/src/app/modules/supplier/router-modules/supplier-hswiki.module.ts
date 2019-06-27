import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SupplierHswikiListComponent } from './../components/supplier-hswiki-list/supplier-hswiki-list.component';
import { SupplierHswikiPageComponent } from './../pages/supplier-hswiki-page/supplier-hswiki-page.component';
import { SupplierShareModule } from './supplier-share.module';
import { DataTableModule } from "angular2-datatable";
import { MatTableModule } from '@angular/material';
import { MatInputModule, MatToolbarModule, MatSortModule, MatPaginatorModule, MatFormFieldModule } from "@angular/material"; 
import { SidebarModule } from "ng-sidebar";

const routes = [
    {path: "", component: SupplierHswikiPageComponent},
  ];

@NgModule({
imports: [
    CommonModule,
    SidebarModule,
    MatToolbarModule,
    RouterModule.forChild(routes),
    SupplierShareModule,
    DataTableModule,
    MatTableModule,
    MatInputModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatFormFieldModule 
],
declarations: [
    SupplierHswikiListComponent,
    SupplierHswikiPageComponent
    // GroupByPipe
]
})
export class SupplierHswikiModule { }
  