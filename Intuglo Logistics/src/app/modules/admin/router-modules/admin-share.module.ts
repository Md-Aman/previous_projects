import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminNavbarComponent } from './../components/admin-navbar/admin-navbar.component';
import { AdminLeftMenuComponent } from './../components/admin-left-menu/admin-left-menu.component';

import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { DataTableModule } from "angular2-datatable";
import { SupplierShareModule } from './../../supplier/router-modules/supplier-share.module'
import { UniquePipe } from './../unique.pipe';
import { GroupByPipe } from "./../group-by.pipe";

@NgModule({
  exports:[
    AdminNavbarComponent,
    AdminLeftMenuComponent,
    MyDatePickerModule,
    DataTableModule,
    UniquePipe,
    GroupByPipe

  ],
  imports: [
    CommonModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MyDatePickerModule,
    DataTableModule,
    SupplierShareModule
    
  ],
  declarations: [
    AdminNavbarComponent,
    AdminLeftMenuComponent,
    UniquePipe,
    GroupByPipe
  ]
})
export class AdminShareModule { }
