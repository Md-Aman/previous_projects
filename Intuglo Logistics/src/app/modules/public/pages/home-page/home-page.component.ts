import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicApiService } from './../../services/public-api.service';
import { MatDialog } from '@angular/material';
import { ForgetPasswordPopupComponent } from './../../components/forget-password-popup/forget-password-popup.component'
@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  tokenID: string;
  slideNav: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, public publicApiService: PublicApiService, public dialog: MatDialog) {

    this.activatedRoute.queryParams.filter(params => params.token)
      .subscribe(params => {
        this.tokenID = params.token;
      })
    let token = {
      "tokenID": this.tokenID
    }
    if (token.tokenID != undefined) {
      this.dialog.open(ForgetPasswordPopupComponent);
      this.publicApiService.resetPassword(token)
        .subscribe(
          status => {
            if (status == 200) {
              this.dialog.open(ForgetPasswordPopupComponent);
            } 
          });
    }

    

  }

  ngOnInit() {
    this.slideNav=false;
  }

  SlideNavigation(slideNav){
    this.slideNav = slideNav;
  }
}
