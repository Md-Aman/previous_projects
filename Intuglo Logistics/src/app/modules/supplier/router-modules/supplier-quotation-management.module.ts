import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from "@angular/material/expansion";

import { SupplierQuotationListFilterComponent } from "./../components/supplier-quotation-list-filter/supplier-quotation-list-filter.component";
import { SupplierQuotationCountryFilterComponent } from "./../components/supplier-quotation-country-filter/supplier-quotation-country-filter.component";
import { SupplierQuotationTopMenuComponent } from './../components/supplier-quotation-top-menu/supplier-quotation-top-menu.component';
import { SupplierQuotationActionButtonComponent } from './../components/supplier-quotation-action-button/supplier-quotation-action-button.component';
import { SupplierQuotationListComponent } from "./../components/supplier-quotation-list/supplier-quotation-list.component";
import { SupplierQuotationManagementComponent } from "./../pages/supplier-quotation-management/supplier-quotation-management.component";

import { SupplierShareModule } from './supplier-share.module'


const routes = [
  {path: "", component: SupplierQuotationManagementComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SupplierShareModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SupplierQuotationListFilterComponent,
    SupplierQuotationListComponent,
    SupplierQuotationManagementComponent,
    SupplierQuotationTopMenuComponent,
    SupplierQuotationActionButtonComponent,
    SupplierQuotationCountryFilterComponent,
  ]
})
export class SupplierQuotationManagementModule { }
