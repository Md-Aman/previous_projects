import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { ManageRiskpalRoutingModule } from './manage-riskpal-routing.module';
import { PageComponent } from './page/page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ManageRiskpalRoutingModule,
    CommonComponentModule
  ],
  declarations: [
    PageComponent,
  ]
})
export class ManageRiskpalModule { }
