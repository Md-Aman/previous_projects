import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CommonComponentModule } from '../shared/components/common/common.component.module';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { TimeoutModalComponent } from './timeout-modal/timeout-modal.component';
import { AccessEmergencyComponent } from './access-emergency/access-emergency.component';

@NgModule({
  declarations: [
    LoginComponent,
    NotfoundComponent,
    ResetPasswordComponent,
    ActivateUserComponent,
    TimeoutModalComponent,
    AccessEmergencyComponent
  ],
  entryComponents:[TimeoutModalComponent],
  imports: [
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    ReactiveFormsModule ,
    NgxLoadingModule.forRoot({}),
    CommonModule,
    CommonComponentModule
  ]
})
export class CoreModule { }
