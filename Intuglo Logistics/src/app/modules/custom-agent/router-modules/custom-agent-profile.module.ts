import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SidebarModule } from "ng-sidebar";
import { MatExpansionModule } from "@angular/material/expansion";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimezonePickerModule } from 'ng2-timezone-selector';

import { CustomAgentProfileComponent } from './../components/custom-agent-profile/custom-agent-profile.component';
import { CustomAgentProfilePageComponent } from './../pages/custom-agent-profile-page/custom-agent-profile-page.component';

import { CustomAgentSharemodule } from './custom-agent-share.module';
import { SharedModule } from '@shared/modules/shared.module'

const routes = [
    {
        path: "", component: CustomAgentProfilePageComponent
    }
]

@NgModule({
    exports:[],
    imports:[
        CustomAgentSharemodule,
        CommonModule,
        RouterModule.forChild(routes),  
        SidebarModule,
        FormsModule, 
        TimezonePickerModule,
        ReactiveFormsModule,
        MatExpansionModule,
        ModalModule,
        SharedModule
    ],
    declarations:[
        CustomAgentProfileComponent,
        CustomAgentProfilePageComponent        
    ]
})

export class CustomAgentProfileModule { }