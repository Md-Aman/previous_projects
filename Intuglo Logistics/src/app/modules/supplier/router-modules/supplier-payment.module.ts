import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SupplierPaymentComponent } from './../pages/supplier-payment/supplier-payment.component';
import { SupplierPaymentListComponent } from './../components/supplier-payment-list/supplier-payment-list.component';

//for datepicker
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatSliderModule} from '@angular/material';
import {MatInputModule, MatTableModule} from '@angular/material';

import { SupplierShareModule } from './supplier-share.module'

// for new datepicker
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { BrowserModule } from '@angular/platform-browser';

const routes = [
  {path: "", component: SupplierPaymentComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SupplierShareModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSliderModule,
    MatInputModule,
    MatTableModule,
    DlDateTimePickerDateModule

  ],
  declarations: [
    SupplierPaymentListComponent,
    SupplierPaymentComponent
  ]
})
export class SupplierPaymentModule { }
