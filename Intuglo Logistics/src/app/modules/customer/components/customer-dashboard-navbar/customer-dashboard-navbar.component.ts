import { LoginComponent } from './../../../public/components/login/login.component';
import { PartnersComponent } from './../../../public/components/partners/partners.component';
import { Component, OnInit, Output, Input, EventEmitter, HostListener } from '@angular/core';
import { ICON_REGISTRY_PROVIDER } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CustomerSessionExpiredDialogComponent } from '../customer-session-expired-dialog/customer-session-expired-dialog.component';
import { SharedService } from '../../../shared/services/shared.service';
import { SessionStorage } from '../../../models/session-storage';
@Component({
  selector: 'customer-dashboard-navbar',
  templateUrl: './customer-dashboard-navbar.component.html',
  styleUrls: ['./customer-dashboard-navbar.component.css']
})

export class CustomerDashboardNavbarComponent {
  session = new SessionStorage();
  display: boolean = false;
  logisticMenu: boolean = false;
  @Output() controlSideBar = new EventEmitter()
  @Input() Logo: boolean;
  @Input() customerName: boolean;
  isToggle: boolean = true;
  userName;
  logo;
  showMenu: boolean = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) {

  }
  
  ngOnChanges() {
    if (this.Logo) {
      this.getProfilePicture();
    }
    if (this.customerName) {
      this.userName = this.session.userName;
    }
  }
  ngOnInit() {
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

  customerLandingPage() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/");
        }
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
        }
      }
      );
  }
  customerProfile() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/customer/profile");
        }
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
        }
      }
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
    this.showMenu = false;
  }
  hideLogisticOption() {
    this.showMenu = !this.showMenu;
  }
  goCart() {
    this.router.navigateByUrl("customer/cart");
  }
}