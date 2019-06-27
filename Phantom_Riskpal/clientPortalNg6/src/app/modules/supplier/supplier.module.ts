import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SupplierRouting } from './supplier.routing';
import { RouterModule } from '@angular/router';

import { CommonComponentModule } from './../../shared/components/common/common.component.module';
import { MatDialogModule } from '@angular/material';


import { ListComponent } from './list/list.component';
import { SupplierCreateUpdateModalComponent } from './supplier-create-update-modal/supplier-create-update-modal.component';

@NgModule({
  declarations: [
    ListComponent,
    SupplierCreateUpdateModalComponent
  ],
  entryComponents: [
    SupplierCreateUpdateModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonComponentModule,
    MatDialogModule,
    CommonModule,
    SupplierRouting
  ],
  providers:    [  ]
  
})
export class SupplierModule { }
