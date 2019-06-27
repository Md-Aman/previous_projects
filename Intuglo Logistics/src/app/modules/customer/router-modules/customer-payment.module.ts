import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPaymentComponent } from './../../customer/pages/customer-payment/customer-payment.component';
import { CustomerPaymentTemplateComponent } from './../../customer/components/customer-payment-template/customer-payment-template.component';
import { CustomerShareModule } from './customer-share.module'

import { SidebarModule } from "ng-sidebar";

import {NgxLoadingModule} from 'ngx-loading';
import {SharedModule} from '@shared/modules/shared.module';
const routes = [
  { path: "", component: CustomerPaymentComponent }

];
@NgModule({
  exports:[
  ],
  imports: [
    SidebarModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    CustomerShareModule,
    NgxLoadingModule.forRoot({}),
    SharedModule
  ],
  declarations: [
    CustomerPaymentComponent,
    CustomerPaymentTemplateComponent
  ]
})
export class CustomerPaymentModule { }
