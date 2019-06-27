import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDashboardComponent } from "./../pages/customer-dashboard/customer-dashboard.component";
import { CustomerActionButtonComponent } from "./../components/customer-action-button/customer-action-button.component";
import { CustomerBookingsComponent } from "./../components/customer-bookings/customer-bookings.component";
import { CustomerCountryFilterComponent } from "./../components/customer-country-filter/customer-country-filter.component";
import { CustomerTopMenuComponent } from "./../components/customer-top-menu/customer-top-menu.component";

import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { GroupByPipe } from "./../../group-by.pipe";

import { CustomerShareModule } from './customer-share.module'
import { SupplierShareModule } from './../../supplier/router-modules/supplier-share.module'
import { NgxLoadingModule } from 'ngx-loading';
import {SharedModule} from '@shared/modules/shared.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

const routes = [
  {path: "", component: CustomerDashboardComponent},
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
    NgxLoadingModule.forRoot({}),
    CustomerShareModule,
    Ng4LoadingSpinnerModule.forRoot(),
    SharedModule
  ],
  declarations: [
    CustomerDashboardComponent,
    CustomerActionButtonComponent,
    CustomerBookingsComponent,
    CustomerCountryFilterComponent,
    CustomerTopMenuComponent,
    // GroupByPipe
  ]
})
export class CustomerDashboardModule { }
