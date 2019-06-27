import { CustomAgentApiService } from './../../services/custom-agent-api.service';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation } from './password-validation';
import { SessionStorage } from '../../../models/session-storage';
import { CustomAgentSessionExpiredDialogComponent } from '../custom-agent-session-expired-dialog/custom-agent-session-expired-dialog.component'

@Component({
  selector: 'custom-agent-password-popup',
  templateUrl: './custom-agent-password-popup.component.html',
  styleUrls: ['./custom-agent-password-popup.component.css']
})
export class CustomAgentPasswordPopupComponent implements OnInit {

  form: FormGroup;
  session = new SessionStorage();   //Create instance of SessionStorage

  constructor(private service: CustomAgentApiService, public thisDialogRef: MatDialogRef<CustomAgentPasswordPopupComponent>, public dialog:MatDialog, fb: FormBuilder) { 
    this.form = fb.group({
      // define your control in you form
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    })
  }

  showFormPages : boolean = true;
  customAgentDetails: any[];
  customAgentLoginDetails: any[];
  oldPassword: string;
  newPassword: string;
  rawJsonError:any[];
  message:any[];
  status: boolean = false;
  error_message: boolean = false;
  show_message: boolean = false;
  passwordOne:string;
  passwordTwo:string;
  success_message: boolean = false;

    // showFormPages : boolean = true;

  changePassword(){
    this.show_message = true;
    let customAgentPasswords = {
      "old_password"   : this.oldPassword,
      "new_password" : this.passwordOne
    }
    this.service.updateCustomAgentPassword(this.session.loginID, this.session.sessionID, customAgentPasswords)
    .subscribe(
      status =>{
        this.rawJsonError = status;
        this.success_message = true;
        this.message = Object.values(this.rawJsonError)
      },
      error => {
        if(error.status == 400){
          this.thisDialogRef.close();
          this.dialog.open(CustomAgentSessionExpiredDialogComponent,{disableClose: true});
        }
      }
    );
  }

  checkSamePassword(confirmPassword) {
    if (this.passwordOne == confirmPassword) {
      this.newPassword = confirmPassword;
    } else {
      this.error_message = false;
      this.success_message = false;
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close();
  }

  ngOnInit() {
  }

}
