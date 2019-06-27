import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { PageComponent } from './page/page.component';
import { ListComponent } from './list/list.component';
//shared componnets
import { TemplateDetailsComponent } from './../../shared/ra/template-details/template-details.component';
import { CountryProfileComponent } from './../../shared/ra/country-profile/country-profile.component';
import { RiskMitigationComponent } from './../../shared/ra/risk-mitigation/risk-mitigation.component';
import { SupplierComponent } from './../../shared/ra/supplier/supplier.component';
import { CommunicationComponent } from './../../shared/ra/communication/communication.component';
import { ContingencyComponent } from './../../shared/ra/contingency/contingency.component';


export const routes: Routes = [
  { path: 'list', component: ListComponent },
  {
    path: 'create', component: PageComponent,
    children: [
      { path: 'template-details', component: TemplateDetailsComponent },
      { path: 'template-details/:templateId', component: TemplateDetailsComponent },
      { path: 'country-profile', component: CountryProfileComponent },
      { path: 'country-profile/:countryIds', component: CountryProfileComponent },
      { path: 'risk-mitigation/:templateId', component: RiskMitigationComponent },
      { path: 'supplier/:templateId', component: SupplierComponent },
      { path: 'communication/:templateId', component: CommunicationComponent },
      { path: 'contingency/:templateId', component: ContingencyComponent },

      { path: '', redirectTo: 'template-details' }
    ],
  },
  { path: '', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RaTemplateRoutingModule { }