import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDashboardNavbarComponent } from "./../components/customer-dashboard-navbar/customer-dashboard-navbar.component";
import { CustomerLeftMenuComponent } from "./../components/customer-left-menu/customer-left-menu.component";

import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports:[
    CustomerDashboardNavbarComponent,
    CustomerLeftMenuComponent,
  ],
  imports: [
    CommonModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
  ],
  declarations: [
    // CustomerTopMenuComponent,
    CustomerDashboardNavbarComponent,
    CustomerLeftMenuComponent,
  ]
})
export class CustomerShareModule { }
