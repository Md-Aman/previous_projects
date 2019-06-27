import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { PublicApiService } from './../../../public/services/public-api.service';

@Component({
  selector: 'custom-agent-session-expired-dialog',
  templateUrl: './custom-agent-session-expired-dialog.component.html',
  styleUrls: ['./custom-agent-session-expired-dialog.component.css']
})
export class CustomAgentSessionExpiredDialogComponent implements OnInit {

  userEmail: string;
  password: string;
  validUser: boolean = true;
  rawJsonError: any[];
  errorHandling: any[];
  customAgentAccess: boolean = false;

  constructor(
    public DialogRef: MatDialogRef<CustomAgentSessionExpiredDialogComponent>,
    private router: Router,
    private publicApiService: PublicApiService
  ) { }

  ngOnInit() {
  }

  verifiedUser(){
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
        if (userLoginDetails.user_type == 3) {
          this.validUser = true;
          this.DialogRef.close();
          if (userLoginDetails.is_on_boarded == 1) {
            window.location.reload();
          }
          else {
            this.router.navigateByUrl("/customagent/profile");
          }
        }
      },
      error => {
        // this.customAgentAccess = false;
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
  }

}
