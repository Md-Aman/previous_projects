import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from "ng-sidebar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";

import { CustomAgentDashboardComponent } from './../pages/custom-agent-dashboard/custom-agent-dashboard.component';
import { CustomAgentCountryFilterComponent } from './../components/custom-agent-country-filter/custom-agent-country-filter.component';
import { CustomAgentBookingsComponent } from './../components/custom-agent-bookings/custom-agent-bookings.component';
import { CustomAgentActionButtonComponent } from './../components/custom-agent-action-button/custom-agent-action-button.component';

import { CustomAgentSharemodule } from './custom-agent-share.module';

const routes = [
    { path:"", component:CustomAgentDashboardComponent }
]

@NgModule({
    imports:[
        CommonModule,
        SidebarModule,
        MatExpansionModule,
        MatToolbarModule,
        ModalModule,
        ReactiveFormsModule,
        FormsModule,
        DataTableModule,
        RouterModule.forChild(routes),
        CustomAgentSharemodule
    ],
    declarations:[
        CustomAgentDashboardComponent,
        CustomAgentCountryFilterComponent,
        CustomAgentBookingsComponent,
        CustomAgentActionButtonComponent
    ]
})

export class CustomAgentDashboardModule { }