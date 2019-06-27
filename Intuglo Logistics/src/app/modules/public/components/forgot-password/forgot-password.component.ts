import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SessionStorage } from '../../../models/session-storage';
import { PublicApiService } from './../../services/public-api.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  email: string;

  constructor(
    public thisDialogRef: MatDialogRef<ForgotPasswordComponent>,
    public dialog: MatDialog,
    fb: FormBuilder,
    public publicApiService: PublicApiService) {

  }

  sent_email: boolean = false;
  account_status_not_active: boolean = false;
  registered: boolean = false;

  demo: boolean = true;


  onCloseCancel() {
    this.thisDialogRef.close();
  }

  ngOnInit() {
    this.form = new FormGroup({
      Email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])
    }
    )
  }

  resetPassword() {
    if (this.form.valid) {
      this.publicApiService.checkEmailValidity(this.email)
        .subscribe(status => {
          this.demo = false;
          this.account_status_not_active = false;  // Account status yet to be completed. API resource need be updated to implement 
          console.log("tyoe of :", typeof (status));
          if (status == 200) {
            this.sent_email = true;
          } else if (status == 204) {
            this.registered = true;
          }
          console.log("this is the status :", status);
        })


      // if(this.form.valid){
      // this.demo = false;
      // this.sent_email = true;
      // this.account_status_not_active = true;
      // this.registered = true;
    }
  }
}
