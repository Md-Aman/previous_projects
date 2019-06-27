import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      { path: "sector", loadChildren: './sector/sector.module#SectorModule'},
      { path: "country", loadChildren: './country/country.module#CountryModule'},
      { path: "risk-label", loadChildren: './risk-label/risk-label.module#RiskLabelModule'},
      { path: "question", loadChildren: './risk-question/question.module#QuestionModule'},
      { path: "category", loadChildren: './category/category.module#CategoryModule'},
      { path: "email-template", loadChildren: './email-template/email-template.module#EmailTemplateModule'},
      {path: '', redirectTo: 'sector'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRiskpalRoutingModule { }
