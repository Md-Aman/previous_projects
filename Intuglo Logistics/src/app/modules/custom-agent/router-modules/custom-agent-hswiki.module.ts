import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from "angular2-datatable";

import { SidebarModule } from "ng-sidebar";
import { MatToolbarModule } from "@angular/material";
// import { MatTableDataSource } from '@angular/material'; 
import { MatTableModule } from '@angular/material';
import { CustomAgentSharemodule } from './custom-agent-share.module';

import { CustomAgentHswikiPageComponent } from './../pages/custom-agent-hswiki-page/custom-agent-hswiki-page.component';
import { CustomAgentHswikiListComponent } from './../components/custom-agent-hswiki-list/custom-agent-hswiki-list.component';


import { MatInputModule, MatSortModule, MatPaginatorModule, MatFormFieldModule } from "@angular/material"; 

const routes = [
    {path: "", component: CustomAgentHswikiPageComponent},
  ];

  @NgModule({
      imports:[
        CommonModule,
        SidebarModule,
        MatToolbarModule,
        // MatTableDataSource,
        MatTableModule,
        RouterModule.forChild(routes),
        DataTableModule,
        CustomAgentSharemodule,
        MatInputModule, 
        MatSortModule, 
        MatPaginatorModule, 
        MatFormFieldModule 
      ],
      declarations:[
        CustomAgentHswikiPageComponent,
        CustomAgentHswikiListComponent
      ]
  })
  
export class CustomAgentHswikiModule {}
