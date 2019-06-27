import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from './../../shared/components/common/common.component.module';
import { RaRoutingModule } from './ra.routing.module';
import { PendingRiskAssessmentComponent } from './pending-risk-assessment/pending-risk-assessment.component';
import { RaApprovalModalComponent } from './ra-approval-modal/ra-approval-modal.component';

import { PageComponent } from './page/page.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { RaDetailsComponent } from './ra-details/ra-details.component';
import { TemplateListComponent } from './../ra/template-list/template-list.component';
import { RiskMitigationComponent } from './risk-mitigation/risk-mitigation.component';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    RaRoutingModule,
    CommonComponentModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  entryComponents: [
    TemplateListComponent,
    RaApprovalModalComponent,
  ],
  declarations: [
    PageComponent,
    OtherDetailsComponent,
    RaDetailsComponent,
    TemplateListComponent,
    RiskMitigationComponent,
    ListComponent,
    PendingRiskAssessmentComponent,
    RaApprovalModalComponent,
  ]
})
export class RaModule { }
