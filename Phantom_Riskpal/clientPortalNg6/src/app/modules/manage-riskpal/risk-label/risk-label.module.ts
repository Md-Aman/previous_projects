import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { RiskLabelRoutingModule } from './risk-label-routing.module';
import { ListComponent } from './list/list.component';
// import { CreateComponent } from './create/create.component';
import { PageComponent } from './page/page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RiskLabelRoutingModule,
    CommonComponentModule
  ],
  declarations: [
    ListComponent,
    // CreateComponent,
    PageComponent,
  ]
})
export class RiskLabelModule { }
