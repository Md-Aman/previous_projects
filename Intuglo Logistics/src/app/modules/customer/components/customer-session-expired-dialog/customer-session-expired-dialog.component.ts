import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { PublicApiService } from './../../../public/services/public-api.service';

@Component({
  selector: 'app-customer-session-expired-dialog',
  templateUrl: './customer-session-expired-dialog.component.html',
  styleUrls: ['./customer-session-expired-dialog.component.css']
})
export class CustomerSessionExpiredDialogComponent implements OnInit {
  userEmail: string;
  password: string;
  validUser: boolean = true;
  rawJsonError: any[];
  errorHandling: any[];
  supplierAccess: boolean = false;

  constructor(
    public DialogRef: MatDialogRef<CustomerSessionExpiredDialogComponent>,
    private router: Router,
    private publicApiService: PublicApiService) {

  }

  ngOnInit() {
  }
  verifiedUser() {
    let user = {
      "userEmail": this.userEmail,
      "password": this.password
    }
    this.publicApiService.getLoginDetails(user)
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
          if (userLoginDetails.user_type == 2) {
            this.validUser = true;
            this.DialogRef.close();
            this.publicApiService.sendUserName(userLoginDetails.UserName);
            if (userLoginDetails.is_on_boarded == 1) {

              if (this.router.url != "/searchresult") {
                window.location.reload();
              }
            }
            else {
              this.router.navigateByUrl("/customer/profile");
            }
          }
          else if (userLoginDetails.user_type == 1) {
            this.supplierAccess = true;
          }
        },
        error => {
          this.supplierAccess = false;
          this.validUser = false;
          this.rawJsonError = error;
          this.errorHandling = Object.values(this.rawJsonError)
          return this.errorHandling;
        }
      );
  }
  onCloseCancel() {
    this.DialogRef.close();
    sessionStorage.clear();
    this.router.navigateByUrl("/");
    this.publicApiService.sendUserName("");
    // window.location.reload();
  }

}
