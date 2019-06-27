import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SupplierModifyQuotationComponent } from '@app/modules/supplier/pages/supplier-modify-quotation/supplier-modify-quotation.component'
// import { SupplierQuotationTemplateComponent } from "./../components/supplier-quotation-template/supplier-quotation-template.component";
import { SupplierViewQuotationComponent } from '@app/modules/supplier/pages/supplier-view-quotation/supplier-view-quotation.component';

import { SupplierShareModule } from '@app/modules/supplier/router-modules/supplier-share.module'
const routes = [
  {path: "", component: SupplierViewQuotationComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SupplierShareModule
  ],
  declarations: [
    SupplierViewQuotationComponent,
    
  ]
})
export class SupplierViewQuotationModule { }
