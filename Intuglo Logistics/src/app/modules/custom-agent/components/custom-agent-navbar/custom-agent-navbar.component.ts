// import { SharedService, SharedService } from './../../../shared/services/shared.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { SessionStorage } from '../../../models/session-storage';

@Component({
  selector: 'custom-agent-navbar',
  templateUrl: './custom-agent-navbar.component.html',
  styleUrls: ['./custom-agent-navbar.component.css']
})
export class CustomAgentNavbarComponent implements OnInit {
  @Input() customAgentName: boolean;
  @Input() Logo: boolean;
  logo;
  session = new SessionStorage();
  display: boolean = false;
  logisticMenu: boolean = false;
  userName;

  @Output() controlSideBar = new EventEmitter()
  isToggle: boolean = true;

  constructor(
    private router: Router,
    private sharedService: SharedService) { }

  ngOnChanges() {
    if (this.Logo) {
      this.getProfilePicture();
    }
    if (this.customAgentName) {
      this.userName = this.session.userName;
    }
  }
  ngOnInit() {
    this.userName = this.session.userName;
    this.getProfilePicture();
  }
  getProfilePicture() {
    this.userName = this.session.userName;
    this.sharedService.getProfileLogo(this.session.loginID, this.session.sessionID, this.session.userType)
      .subscribe(url => {
        this.logo = '';
        this.logo = url;
      });
  }

  customAgentDashboard() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/customagent/dashboard");
        }
      },
      // error => {
      //   if(error.status == 400){
      //     this.dialog.open(SupplierSessionExpiredDialogComponent,{disableClose: true});
      //   }
      // }
    );
  }

  customAgentProfile() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/customagent/profile");
        }
      },
      // error => {
      //   if(error.status == 400){
      //     this.dialog.open(SupplierSessionExpiredDialogComponent,{disableClose: true});
      //   }
      // }
    );
  }
  CustomAgentLandingPage() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/");
        }
      },
      // error => {
      //   if(error.status == 400){
      //     this.dialog.open(SupplierSessionExpiredDialogComponent,{disableClose: true});
      //   }
      // }
    );
  }
  toggleSideBar() {
    this.isToggle = !this.isToggle;
    this.controlSideBar.emit(this.isToggle);
  }

  clickDropdown() {
    this.display = !this.display;
  }

  clickLogisticMenu() {
    this.logisticMenu = !this.logisticMenu;
  }

  sessionExpiry() {
    this.router.navigateByUrl("/");
    sessionStorage.clear();
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:click', ['event']) clickedOutside($event) {
    this.display = false;
  }
}
