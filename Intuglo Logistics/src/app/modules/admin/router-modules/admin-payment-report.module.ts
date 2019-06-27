import { AdminPaymentReportComponent } from './../pages/admin-payment-report/admin-payment-report.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminShareModule } from './../router-modules/admin-share.module';
import { MatTableModule } from '@angular/material';
import { MatCheckboxModule } from "@angular/material/checkbox";



import { AdminPaymentListComponent } from './../components/admin-payment-list/admin-payment-list.component';
//import { AdminPaymentFilterListComponent } from './../components/admin-payment-filter-list/admin-payment-filter-list.component';
//import { AdminPaymentCountryListComponent } from './../components/admin-payment-country-list/admin-payment-country-list.component';

//for datepicker
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatSliderModule} from '@angular/material';
import {MatInputModule} from '@angular/material';

//for new datepicker
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { BrowserModule } from '@angular/platform-browser';

const routes = [
    {path:"" ,component:AdminPaymentReportComponent}
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
        DlDateTimePickerDateModule 
    ],
    declarations:[
        AdminPaymentReportComponent,
        // AdminPaymentCountryListComponent,
        // AdminPaymentFilterListComponent,
        AdminPaymentListComponent
    ],
    exports:[
        
    ]
})

export class AdminPaymentReportModule { }