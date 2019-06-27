import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierNavbarComponent } from "./../components/supplier-navbar/supplier-navbar.component";
import { SupplierLeftMenuComponent } from "./../components/supplier-left-menu/supplier-left-menu.component";

import { MatToolbarModule } from "@angular/material";
import { SidebarModule } from "ng-sidebar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "ngx-modal";
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatExpansionModule } from "@angular/material/expansion";
import { UniquePipe } from './../../unique.pipe';
import { GroupByPipe } from "./../../group-by.pipe";
import { MyDatePickerModule } from 'mydatepicker';
import {SharedModule} from '@shared/modules/shared.module';

import { SupplierQuotationTemplateComponent } from "./../components/supplier-quotation-template/supplier-quotation-template.component";
import {ControlMessagesComponent} from "@shared/components/validation/control-messages.component";

@NgModule({
  exports:[
    SupplierNavbarComponent,
    SupplierLeftMenuComponent,
    SupplierQuotationTemplateComponent,
    ControlMessagesComponent,
    SidebarModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
    MatCheckboxModule,
    MatExpansionModule,
    GroupByPipe,
    UniquePipe,
    MyDatePickerModule,
    SharedModule
  ],
  imports: [
    CommonModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    ModalModule,
    Ng2AutoCompleteModule,
    MatCheckboxModule,
    MatExpansionModule,
    MyDatePickerModule,
    SharedModule

  ],
  declarations: [
    SupplierNavbarComponent,
    SupplierLeftMenuComponent,
    GroupByPipe,
    UniquePipe,
    SupplierQuotationTemplateComponent,
    ControlMessagesComponent
  ]
})
export class SupplierShareModule { }
