import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './list/user.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { PageComponent } from './page/page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupComponent } from './group/group.component';
import { CreateGroupComponent } from './group/create-group/create-group.component';
import { UpdateGroupComponent } from './group/update-group/update-group.component';
import { ListComponent } from './rpstaff/list/list.component';
import { EmgRecApprovalComponent } from './emg-rec-approval/emg-rec-approval.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UserRoutingModule,
    CommonComponentModule
  ],
  entryComponents: [CreateGroupComponent, EmgRecApprovalComponent],
  declarations: [
    UserComponent,
    CreateComponent,
    UpdateComponent,
    PageComponent,
    // MedicalInformationComponent,
    // TrainingInformationComponent,
    GroupComponent,
    CreateGroupComponent,
    UpdateGroupComponent,
    ListComponent,
    EmgRecApprovalComponent,
    // EmergencyDetailsComponent
  ]
})
export class UserModule { }
