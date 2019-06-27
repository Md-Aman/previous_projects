import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { Router } from '@angular/router';
import { PublicApiService } from './../../services/public-api.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() loginAccessEvent = new EventEmitter<any>();
  // Create instance of User class and then call the property(variable) of the class
  user = new User();

  validUser: boolean = true;
  userDetails: any[];
  userDetailsValues: any[];
  accountDetails: any[];
  rawJsonError: any[];
  errorHandling: any[];

  abc: any;

  constructor(
    private service: PublicApiService,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }






  verifiedUser() {
    let user = {
      "userEmail": this.user.userEmail,
      "password": this.user.password
    }
    this.service.getLoginDetails(user)
      .subscribe(
        userLoginDetails => {
          this.abc = userLoginDetails
          console.log(userLoginDetails);
          this.validUser = false;
          // console.log("hello :",(userLoginDetails.UserName));
          // console.log(userLoginDetails.user_type)
          // console.log(typeof(userLoginDetails.user_type))
          sessionStorage.setItem("userName", JSON.stringify(userLoginDetails.UserName));

          sessionStorage.setItem("loginID", JSON.stringify(userLoginDetails.login_id));
          sessionStorage.setItem("sessionID", JSON.stringify(userLoginDetails.SessionID));
          sessionStorage.setItem("isOnBoarded", JSON.stringify(userLoginDetails.is_on_boarded));
          sessionStorage.setItem("userType", JSON.stringify(userLoginDetails.user_type));
          sessionStorage.setItem("merchantID", JSON.stringify(userLoginDetails.merchant_id));
          /* 
          Check user type - 1 for supplier - 2 for customer.
          then set session for respective user
        */


          if (userLoginDetails.user_type == 1) {
            this.validUser = true;
            // 0 means incomplete and 1 means complete profile
            if (userLoginDetails.is_on_boarded == 1) {
              this.router.navigateByUrl("/supplier/dashboard");
            } else {   // can put one more condition for 0 
              this.router.navigateByUrl("/supplier/profile");
            }
          }
          else if (userLoginDetails.user_type == 2) {

            this.validUser = true;
            //set cartID
            sessionStorage.setItem("cartID", JSON.stringify(userLoginDetails.cart_id));

            
            // 0 means incomplete and 1 means complete profile
            if (userLoginDetails.is_on_boarded != 1) {
              this.router.navigateByUrl("/customer/profile");
            }
            // emitting customer name
            this.loginAccessEvent.emit(userLoginDetails.UserName);
          }
          else if (userLoginDetails.user_type == 3) {
            this.validUser = true;
            // 0 means incomplete and 1 means complete profile
            if(userLoginDetails.is_on_boarded == 1){
              this.router.navigateByUrl("/customagent/dashboard");
            }else{
              this.router.navigateByUrl("/customagent/profile");
            }
            this.loginAccessEvent.emit(userLoginDetails.UserName);
          }
          else if (userLoginDetails.user_type == 0) {

            this.validUser = true;

            this.router.navigateByUrl("/admin/dashboard");
            // }
            // // emitting admin name
            // this.loginAccessEvent.emit(userLoginDetails.UserName);
          }
          else {
            this.loginAccessEvent.emit("");
          }
        },
        error => {
          this.validUser = false;
          this.rawJsonError = error;
          this.errorHandling = Object.values(this.rawJsonError)
          return this.errorHandling;
        }
      );
  }

  ngOnInit() {
  }

  //open-up dialog for password changing action
  openDialog() {
    // check for session
    let dialogRef = this.dialog.open(ForgotPasswordComponent, {
      disableClose: true
    });
  }

}
