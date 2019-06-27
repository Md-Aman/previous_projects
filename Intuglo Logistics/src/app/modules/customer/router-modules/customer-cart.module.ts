import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarModule } from "ng-sidebar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from "ngx-modal";

import { CustomerCartsComponent } from './../pages/customer-carts/customer-carts.component';
import { CustomerCartComponent } from './../components/customer-cart/customer-cart.component';

import { CustomerShareModule } from './customer-share.module'


const routes = [
  {path: "", component: CustomerCartsComponent},
];
@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    CustomerShareModule,
    ModalModule 
    
  ],
  declarations: [
    CustomerCartsComponent,
    CustomerCartComponent,
  ]
})
export class CustomerCartModule { }
