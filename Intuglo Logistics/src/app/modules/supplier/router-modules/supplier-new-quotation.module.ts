import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// import { SupplierQuotationTemplateComponent } from "./../components/supplier-quotation-template/supplier-quotation-template.component";
import { SupplierNewQuotationComponent } from "./../pages/supplier-new-quotation/supplier-new-quotation.component";

import { SupplierShareModule } from './supplier-share.module'
const routes = [
  {path: "", component: SupplierNewQuotationComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SupplierShareModule
  ],
  declarations: [
    // SupplierQuotationTemplateComponent,
    SupplierNewQuotationComponent,
  ]
})
export class SupplierNewQuotationModule { }
