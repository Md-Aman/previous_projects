import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from 'ng-sidebar';
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "ngx-modal";

import { CustomAgentNavbarComponent } from './../components/custom-agent-navbar/custom-agent-navbar.component';
import { CustomAgentLeftMenuComponent } from './../components/custom-agent-left-menu/custom-agent-left-menu.component';

@NgModule({
    exports:[
        CustomAgentNavbarComponent,
        CustomAgentLeftMenuComponent,
        SidebarModule,
        ModalModule,
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule
    ],
    imports:[
        CommonModule,
        MatToolbarModule,
        SidebarModule,
        ModalModule,
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule
    ],
    declarations:[
        CustomAgentNavbarComponent,
        CustomAgentLeftMenuComponent
    ]
})

export class CustomAgentSharemodule { }
