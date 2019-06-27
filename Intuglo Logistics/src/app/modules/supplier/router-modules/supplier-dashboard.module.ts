import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SupplierDashboardComponent } from "./../pages/supplier-dashboard/supplier-dashboard.component";
import { SupplierActionButtonComponent } from "./../../supplier/components/supplier-action-button/supplier-action-button.component";
import { SupplierCountryFilterComponent } from "./../components/supplier-country-filter/supplier-country-filter.component";
import { SupplierListFilterComponent } from "./../components/supplier-list-filter/supplier-list-filter.component";
import { SupplierTopMenuComponent } from './../components/supplier-top-menu/supplier-top-menu.component';
import { SupplierBookingsComponent } from './../components/supplier-bookings/supplier-bookings.component'
import { SupplierTablePaginationComponent } from './../components/supplier-table-pagination/supplier-table-pagination.component'

import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";
import { GroupByPipe } from "./../../group-by.pipe";

import { SupplierShareModule } from './supplier-share.module'

const routes = [
  {path: "", component: SupplierDashboardComponent},
];

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatToolbarModule,
    RouterModule.forChild(routes),
    SupplierShareModule,
    DataTableModule
  ],
  declarations: [
    SupplierDashboardComponent,
    SupplierActionButtonComponent,
    SupplierCountryFilterComponent,
    SupplierListFilterComponent,
    SupplierTopMenuComponent,
    SupplierBookingsComponent,
    SupplierTablePaginationComponent

    // GroupByPipe
  ]
})
export class SupplierDashboardModule { }
