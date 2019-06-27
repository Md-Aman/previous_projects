import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DashboardComponent } from './dashboard.component';
import { appRoutes } from './dashboard.routing';
import { RouterModule } from '@angular/router';

import { CommonComponentModule } from '@shared/components/common/common.component.module';
@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    FormsModule,
    HttpModule,
    RouterModule.forChild(appRoutes),
    CommonComponentModule
  ]
})
export class DashboardModule { }
