import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { RaTemplateRoutingModule } from './ra-template.routing.module';
import { TemplateDetailsComponent } from './../../shared/ra/template-details/template-details.component';


import { ListComponent } from './list/list.component';
import { PageComponent } from './page/page.component';

import { RiskMitigationComponent } from './../../shared/ra/risk-mitigation/risk-mitigation.component';
import { CreateComponent as CreateRiskLabelComponent } from './../manage-riskpal/risk-label/create/create.component';
import { CreateComponent as CreateRiskQuestionComponent } from './../manage-riskpal/risk-question/create/create.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  imports: [
    CommonModule,
    RaTemplateRoutingModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    PopupComponent
  ],
  declarations: [
    TemplateDetailsComponent,
    PageComponent,
    ListComponent,
    RiskMitigationComponent,
    PopupComponent,
  ]
})
export class RaTemplateModule { }
