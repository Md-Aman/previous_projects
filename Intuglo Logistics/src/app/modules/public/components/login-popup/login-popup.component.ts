import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PublicApiService } from './../../services/public-api.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { BookNowComponent } from '../book-now/book-now.component';
import { signupComponent } from './../signup/signup.component';
import { UserOnboardComponent } from '../user-onboard/user-onboard.component';

@Component({
  selector: 'login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent implements OnInit {

  @Output() loginAccessEvent = new EventEmitter<any>();
  userEmail: string;
  password: string;
  validUser: boolean = true;
  userDetails: any[];
  userDetailsValues: any[];
  rawJsonError: any[];
  errorHandling: any[];

  constructor(private service: PublicApiService, private router: Router, public thisDialogRef: MatDialogRef<LoginPopupComponent>, public dialog: MatDialog) { }

  verifiedUser() {
    let user = {
      "userEmail": this.userEmail,
      "password": this.password
    }
    this.service.getLoginDetails(user)
      .subscribe(
        userLoginDetails => {
          this.validUser = false;
          sessionStorage.setItem("userName", JSON.stringify(userLoginDetails.UserName));
          sessionStorage.setItem("loginID", JSON.stringify(userLoginDetails.login_id));
          sessionStorage.setItem("sessionID", JSON.stringify(userLoginDetails.SessionID));
          sessionStorage.setItem("isOnBoarded", JSON.stringify(userLoginDetails.is_on_boarded));
          sessionStorage.setItem("userType", JSON.stringify(userLoginDetails.user_type));
          /* 
            Check user type - 1 for supplier - 2 for customer.
            then set session for respective user
          */

          if (userLoginDetails.user_type == 1) {
            this.validUser = true;
            this.thisDialogRef.close();
            // 0 means incomplete and 1 means complete profile
            if (userLoginDetails.is_on_boarded == 1) {
              this.router.navigateByUrl("/supplier/dashboard");
            } else {
              this.router.navigateByUrl("/supplier/profile");
            }
          }

          else if (userLoginDetails.user_type == 2) {
            this.validUser = true;
            this.thisDialogRef.close();
            this.service.sendUserName(userLoginDetails.UserName);
            if (userLoginDetails.is_on_boarded == 1) {
              this.dialog.open(BookNowComponent);
            } else if (userLoginDetails.is_on_boarded == 0) {
              this.dialog.open(UserOnboardComponent);
            }
          }
        },
        userLoginError => {
          this.validUser = false;
          this.rawJsonError = userLoginError;
          this.errorHandling = Object.values(this.rawJsonError)
          return this.errorHandling;
        }
      );
  }


  openSignupDialog() {
    this.dialog.open(signupComponent, {
      width: "1150px",
      height: "650px"
    });
  }
  onCloseCancel() {
    this.thisDialogRef.close();
  }
  shareUserTypeCustomer() {
    this.service.userType = 2;
  }
  shareUserTypeSupplier() {
    this.service.userType = 1;
  }
  ngOnInit() {
  }

  

}
