import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';
import { AuthGuard } from './../../core/guards/auth.guard';

import { PageComponent } from './page/page.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { RaDetailsComponent } from './ra-details/ra-details.component';
import { RiskMitigationComponent } from './risk-mitigation/risk-mitigation.component';
import { ListComponent } from './list/list.component';
import { PendingRiskAssessmentComponent } from './pending-risk-assessment/pending-risk-assessment.component';
//shared componnets
import { CountryProfileComponent } from './../../shared/ra/country-profile/country-profile.component';
import { SupplierComponent } from './../../shared/ra/supplier/supplier.component';
import { CommunicationComponent } from './../../shared/ra/communication/communication.component';
import { ContingencyComponent } from './../../shared/ra/contingency/contingency.component';





export const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: 'pending', component: PendingRiskAssessmentComponent },
    {
        path: 'create', component: PageComponent,
        children: [
            { path: 'ra-details', component: RaDetailsComponent },
            { path: 'ra-details/:templateId', component: RaDetailsComponent },
            { path: 'ra-details/:templateId/:raId', component: RaDetailsComponent },
            { path: 'country-profile/:templateId/:raId/:countryIds', component: CountryProfileComponent },
            { path: 'risk-mitigation/:templateId/:raId', component: RiskMitigationComponent },
            { path: 'supplier/:templateId/:raId', component: SupplierComponent },
            { path: 'communication/:templateId/:raId', component: CommunicationComponent },
            { path: 'contingency/:templateId/:raId', component: ContingencyComponent },
            { path: 'other-details/:templateId/:raId', component: OtherDetailsComponent },

            { path: '', redirectTo: 'create/ra-details' }
        ],
    },
    { path: '', redirectTo: 'list' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RaRoutingModule { }