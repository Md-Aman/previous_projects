import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './account/create/create.component';
import { PageComponent } from './page/page.component';
import { PersonalDetailsComponent } from './../user/form/personal-details/personal-details.component';
import { ChangePasswordComponent } from './setting/change-password/change-password.component';
const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      {
        path: 'update', component: CreateComponent,
      },
      {
        path: 'change-password', component: ChangePasswordComponent,
      },
      {path: '', redirectTo: 'update'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
