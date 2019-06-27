import { MatDialog } from '@angular/material';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { signupComponent } from './../signup/signup.component';
import { PublicApiService } from '../../services/public-api.service';


@Component({
  selector: 'signup-option',
  templateUrl: './signup-option.component.html',
  styleUrls: ['./signup-option.component.css']
})
export class SignupOptionComponent implements OnInit {

  isSignupPopup: boolean = false;

  constructor(public dialog: MatDialog, private service: PublicApiService) { }

  openSignupDialog() {
    this.dialog.open(signupComponent, {
      disableClose: true,
      width: "800px",
      height: "600px"
    });
  }
  shareUserTypeCustomer() {
    this.service.userType = 2;
  }
  shareUserTypeSupplier() {
    this.service.userType = 1;
  }
  shareUserTypeCustomAgent() {
    this.service.userType = 3;
  }

  ngOnInit() {
  }

}