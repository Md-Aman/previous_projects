import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { ModalModule } from "ngx-modal";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminShareModule } from './../router-modules/admin-share.module';
import { AdminUserManagementComponent } from './../pages/admin-user-management/admin-user-management.component';
import { AdminUserListComponent } from './../components/admin-user-list/admin-user-list.component';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from '@angular/material/select';
const routes = [
    {path:"" ,component:AdminUserManagementComponent}
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
        MatSelectModule,
        MatPaginatorModule
    ],
    declarations:[
        AdminUserManagementComponent,
        AdminUserListComponent
    ],
    exports:[]
})

export class AdminUserManagementModule { }