import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './list/user.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { PageComponent } from './page/page.component';
import { PersonalDetailsComponent } from './form/personal-details/personal-details.component';
import { MedicalInformationComponent } from './form/medical-information/medical-information.component';
import { TrainingInformationComponent } from './form/training-information/training-information.component';
import { GroupComponent } from './group/group.component';
import { ListComponent } from './rpstaff/list/list.component';
import { CreateRpstaffComponent } from './rpstaff/create-rpstaff/create-rpstaff.component';
import { EmergencyDetailsComponent } from './form/emergency-details/emergency-details.component';
const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      { path: 'list', component: UserComponent },
      {
        path: 'create', component: CreateComponent,
        children: [
          { path: 'personal-details', component: PersonalDetailsComponent},
          // { path: 'emergency-details', component: EmergencyDetailsComponent},
          // { path: 'medical-information', component: MedicalInformationComponent},
          // { path: 'training-information', component: TrainingInformationComponent},
          { path: '', redirectTo: 'personal-details' }
        ]
      },
      {
        path: 'update/:id', component: UpdateComponent,
        children: [
          { path: 'personal-details', component: PersonalDetailsComponent},
          { path: 'emergency-details', component: EmergencyDetailsComponent},
          { path: 'medical-information', component: MedicalInformationComponent},
          { path: 'training-information', component: TrainingInformationComponent},
          { path: '', redirectTo: 'personal-details' }
        ]
      },
      {
        path: 'group', component: PageComponent,
        children: [
          { path: 'list', component: GroupComponent },
          { path: 'create/:popup', component: GroupComponent }, // CreateGroupComponent
          { path: 'update/:id/:popup', component: GroupComponent},
          { path: '', redirectTo: 'list' }
        ]
      },
      {
        path: 'rpstaff', component: PageComponent,
        children: [
          { path: 'list', component: ListComponent },
          { path: 'create', component: CreateRpstaffComponent},
          { path: 'update/:id', component: CreateRpstaffComponent},
          { path: '', redirectTo: 'list' }
        ]
      },
      {path: '', redirectTo: 'list'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
