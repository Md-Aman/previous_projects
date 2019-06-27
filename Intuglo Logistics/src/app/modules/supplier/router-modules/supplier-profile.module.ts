import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SidebarModule } from "ng-sidebar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimezonePickerModule } from 'ng2-timezone-selector';

import { SupplierProfilePageComponent } from "./../../supplier/pages/supplier-profile-page/supplier-profile-page.component";
import { SupplierProfileComponent } from './../../supplier/components/supplier-profile/supplier-profile.component';

import { SupplierShareModule } from './../router-modules/supplier-share.module';
import { ModalModule } from "ngx-modal";
import {SharedModule} from '@shared/modules/shared.module';
const routes = [
  { path: "", component: SupplierProfilePageComponent }

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
    SupplierShareModule,
    SidebarModule,
    ModalModule,
    SharedModule
  
  ],
  declarations: [
    SupplierProfilePageComponent,
    SupplierProfileComponent,
  ]
})
export class SupplierProfileModule { }
