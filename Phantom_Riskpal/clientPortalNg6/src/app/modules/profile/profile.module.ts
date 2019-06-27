import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { CreateComponent } from './account/create/create.component';
import { PageComponent } from './page/page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './setting/change-password/change-password.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProfileRoutingModule,
    CommonComponentModule
  ],
  entryComponents: [],
  declarations: [
    CreateComponent,
    PageComponent,
    ChangePasswordComponent]
})
export class ProfileModule { }
