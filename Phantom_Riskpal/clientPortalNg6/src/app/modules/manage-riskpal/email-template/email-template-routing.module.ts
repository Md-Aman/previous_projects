import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      { path: 'list', component: ListComponent },
      {
        path: 'create/:popup', component: ListComponent,
      },
      {
        path: 'update/:id/:popup', component: ListComponent,
      },
      {path: '', redirectTo: 'list'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailTemplateRoutingModule { }
