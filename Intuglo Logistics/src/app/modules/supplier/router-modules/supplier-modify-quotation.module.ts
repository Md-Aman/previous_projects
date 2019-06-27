import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SupplierModifyQuotationComponent } from './../../supplier/pages/supplier-modify-quotation/supplier-modify-quotation.component'
// import { SupplierQuotationTemplateComponent } from "./../components/supplier-quotation-template/supplier-quotation-template.component";
import { SupplierModifyQuotationTemplateComponent } from './../components/supplier-modify-quotation-template/supplier-modify-quotation-template.component'

import { SupplierShareModule } from './supplier-share.module'

const routes = [
  {path: "", component: SupplierModifyQuotationComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SupplierShareModule
  ],
  declarations: [
    SupplierModifyQuotationComponent,
    // SupplierQuotationTemplateComponent,
    SupplierModifyQuotationTemplateComponent
  ]
})
export class SupplierModifyQuotationModule { }
