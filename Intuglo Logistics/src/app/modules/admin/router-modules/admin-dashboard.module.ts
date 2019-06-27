import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';



import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminOrderManagementComponent } from './../pages/admin-order-management/admin-order-management.component';
import { AdminOrderCountryListComponent } from './../components/admin-order-country-list/admin-order-country-list.component';
import { AdminOrderFirstFilterListComponent } from './../components/admin-order-first-filter-list/admin-order-first-filter-list.component';
import { AdminOrderSecondFilterListComponent } from './../components/admin-order-second-filter-list/admin-order-second-filter-list.component';
import { AdminOrderActionTopMenuComponent } from './../components/admin-order-action-top-menu/admin-order-action-top-menu.component';
import { AdminOrderActionButtonComponent } from './../components/admin-order-action-button/admin-order-action-button.component';
import { AdminOrderListComponent } from './../components/admin-order-list/admin-order-list.component';
import { AdminTablePaginationComponent } from './../components/admin-table-pagination/admin-table-pagination.component';

import { AdminShareModule } from './../router-modules/admin-share.module';
import { SharedModule } from '@shared/modules/shared.module';

const routes = [
  {path: "", component: AdminOrderManagementComponent},
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
    AdminShareModule,
    SharedModule
  ],
  declarations: [
    AdminOrderManagementComponent,
    AdminOrderCountryListComponent,
    AdminOrderFirstFilterListComponent,
    AdminOrderSecondFilterListComponent,
    AdminOrderActionTopMenuComponent,
    AdminOrderActionButtonComponent,
    AdminOrderListComponent,
    AdminTablePaginationComponent

  ]
})
export class AdminDashboardModule { }
