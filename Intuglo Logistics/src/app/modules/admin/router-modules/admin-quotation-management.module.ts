import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';



import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminQuotationCountryListComponent } from './../components/admin-quotation-country-list/admin-quotation-country-list.component';
import { AdminQuotationFilterListComponent } from './../components/admin-quotation-filter-list/admin-quotation-filter-list.component';
import { AdminQuotationTopMenuComponent } from './../components/admin-quotation-top-menu/admin-quotation-top-menu.component';
import { AdminQuotationActionButtonComponent } from './../components/admin-quotation-action-button/admin-quotation-action-button.component';
import { AdminQuotationManagementComponent } from './../pages/admin-quotation-management/admin-quotation-management.component';
import { AdminQuotationListComponent } from './../components/admin-quotation-list/admin-quotation-list.component';
import { AdminViewQuotationTemplateComponent } from './../components/admin-view-quotation-template/admin-view-quotation-template.component';

import { AdminShareModule } from './../router-modules/admin-share.module'
import { SharedModule } from '@shared/modules/shared.module';

const routes = [
  {path: "", component: AdminQuotationManagementComponent},
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
    AdminQuotationCountryListComponent,
    AdminQuotationFilterListComponent,
    AdminQuotationTopMenuComponent,
    AdminQuotationActionButtonComponent,
    AdminQuotationListComponent,
    AdminQuotationManagementComponent,

  ]
})
export class AdminQuotationManagementModule { }
