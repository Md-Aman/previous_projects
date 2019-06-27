import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SidebarModule } from "ng-sidebar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimezonePickerModule } from 'ng2-timezone-selector';

import { CustomerProfilePageComponent } from "./../../customer/pages/customer-profile-page/customer-profile-page.component";
import { CustomerProfileComponent } from './../../customer/components/customer-profile/customer-profile.component';

import { CustomerShareModule } from './customer-share.module'
import { ModalModule } from "ngx-modal";
import {SharedModule} from '@shared/modules/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


const routes = [
  { path: "", component: CustomerProfilePageComponent }

];
@NgModule({
  exports:[  
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TimezonePickerModule,
    RouterModule.forChild(routes),
    CustomerShareModule,
    SidebarModule,
    ModalModule,
    NgxLoadingModule.forRoot({}),
    Ng4LoadingSpinnerModule.forRoot(),
    SharedModule,
    // MatProgressSpinnerModule
  ],
  declarations: [
    CustomerProfilePageComponent,
    CustomerProfileComponent
  ]
})
export class CustomerProfileModule { }
