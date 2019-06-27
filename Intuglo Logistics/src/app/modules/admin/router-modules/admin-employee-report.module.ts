import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminShareModule } from './../router-modules/admin-share.module';
//import { AdminUserListComponent } from './../components/admin-user-list/admin-user-list.component';
import { MatTableModule } from '@angular/material';
import { MatCheckboxModule } from "@angular/material/checkbox";

import { AdminEmployeeReportComponent } from './../pages/admin-employee-report/admin-employee-report.component';
import { AdminEmployeeListComponent } from './../components/admin-employee-list/admin-employee-list.component';


import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatSliderModule} from '@angular/material';
import {MatInputModule} from '@angular/material';


//for new datepicker
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { BrowserModule } from '@angular/platform-browser';


const routes = [
    {path:"" ,component:AdminEmployeeReportComponent}
]

@NgModule({
    imports:[
        CommonModule,
        SidebarModule,
        ModalModule,
        ReactiveFormsModule,
        FormsModule,
        MatExpansionModule,
        MatToolbarModule,
        RouterModule.forChild(routes),
        AdminShareModule,
        MatTableModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule, 
        MatSliderModule,
        MatInputModule,
        DlDateTimePickerDateModule,
        // BrowserModule,
    ],
    providers: [FormsModule],
    bootstrap: [AdminEmployeeListComponent],
    declarations:[
        AdminEmployeeReportComponent,
        AdminEmployeeListComponent
      //  AdminUserListComponent
    ],
    exports:[]
})

export class AdminEmployeeReportModule { }



