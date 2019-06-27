import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from "angular2-datatable";
import { SidebarModule } from "ng-sidebar";
import { MatTableModule } from '@angular/material';

import { CustomerHswikiPageComponent } from './../pages/customer-hswiki-page/customer-hswiki-page.component';
import { CustomerHswikiListComponent } from './../components/customer-hswiki-list/customer-hswiki-list.component';
import { CustomerShareModule } from './customer-share.module';
import { MatInputModule, MatToolbarModule, MatSortModule, MatPaginatorModule, MatFormFieldModule } from "@angular/material"; 
const routes = [
    {path:"", component: CustomerHswikiPageComponent}
]

@NgModule({
    imports:[
        CommonModule,
        SidebarModule,
        MatToolbarModule,
        RouterModule.forChild(routes),
        DataTableModule,
        MatTableModule,
        CustomerShareModule,
        MatInputModule, 
        MatSortModule, 
        MatPaginatorModule, 
        MatFormFieldModule 
    ],
    declarations:[
        CustomerHswikiPageComponent,
        CustomerHswikiListComponent
    ],
    exports:[]
})

export class CustomerHswikiModule { }
  