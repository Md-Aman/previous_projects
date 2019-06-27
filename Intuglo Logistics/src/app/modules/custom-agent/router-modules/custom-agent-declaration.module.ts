import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from "ng-sidebar";
import { MatExpansionModule } from "@angular/material/expansion";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";

import { CustomAgentDeclarationPageComponent } from './../pages/custom-agent-declaration-page/custom-agent-declaration-page.component';
import { CustomAgentDeclarationComponent } from './../components/custom-agent-declaration/custom-agent-declaration.component';

import { CustomAgentSharemodule } from './custom-agent-share.module';

const routes = [
    { path:"", component:CustomAgentDeclarationPageComponent }
]

@NgModule({
    imports:[
        CommonModule,
        SidebarModule,
        MatExpansionModule,
        ModalModule,
        ReactiveFormsModule,
        FormsModule,
        DataTableModule,
        RouterModule.forChild(routes),
        CustomAgentSharemodule
    ],
    exports:[],
    declarations:[
        CustomAgentDeclarationPageComponent,
        CustomAgentDeclarationComponent
    ]
})

export class CustomAgentDeclarationModule { }