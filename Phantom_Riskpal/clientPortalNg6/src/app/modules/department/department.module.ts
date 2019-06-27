import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from './department.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { appRoutes } from './department.routing';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    DepartmentComponent, DepartmentFormComponent
  ],
  entryComponents: [
    DepartmentFormComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(appRoutes),
    CommonComponentModule,
    NgSelectModule,
    MatDialogModule,
    CommonModule

  ],
  
})
export class DepartmentModule { }
