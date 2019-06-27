import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { PageComponent } from './page/page.component';
import { CountryProfileComponent } from '@shared/ra/country-profile/country-profile.component';

const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      { path: 'list', component: ListComponent },
      {
        path: 'create', component: CreateComponent,
      },
      {
        path: 'profile/:countryIds/:realTime', component: CountryProfileComponent,
      },
      {
        path: 'update/:id', component: CreateComponent,
      },
      {path: '', redirectTo: 'list'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }
