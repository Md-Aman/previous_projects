import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { AdminApiService } from '../../../admin/services/admin-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionStorage } from '../../../models/session-storage';
import { SharedService } from '../../../shared/services/shared.service';


@Component({
  selector: 'admin-order-action-button',
  templateUrl: './admin-order-action-button.component.html',
  styleUrls: ['./admin-order-action-button.component.css']
})
export class AdminOrderActionButtonComponent implements OnInit {
  @Output() hideAdminActionButtons = new EventEmitter();
  @Input() step: string;
  @Input() quotationId

  // stepBooking: boolean = false;
  // stepCargo: boolean = false;
  // stepPayment: boolean = false;

  // supplierDetails: any[];
  response: any[];
  // supplierLoginDetails: any[];
  session = new SessionStorage();   //Create instance of SessionStorage
  isPopup: boolean = false;
  getMessage: any[];
  message: string;

  display_message: string;

  failure_message: string = "You are not allowed to change the booking status of this booking";
  error: string = "Something happend wrong. Try again later.";
  session_expired = "It seems your session is expired! Please login and try again.";

  constructor(
    private adminApiService: AdminApiService,
    private toastr: ToastrService,
    public router: Router,
    private sharedService: SharedService
  ) {
  }

  // colorButtonBooking() {
  //   this.stepBooking = true;
  //   this.stepCargo = false;
  //   this.stepPayment = false;
  // }
  // colorButtonCargo() {
  //   this.stepBooking = false;
  //   this.stepCargo = true;
  //   this.stepPayment = false;
  // }
  // colorButtonPayment() {
  //   this.stepBooking = false;
  //   this.stepCargo = false;
  //   this.stepPayment = true;
  // }

  ngOnInit() {
  }
  openLoginAgainModal() {
    // this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
  }

  destroyAllSession() {
    sessionStorage.clear();
    this.router.navigateByUrl("/");
  }

  closePopup() {
    this.hideAdminActionButtons.emit(false);
    this.adminApiService.sendUpdateAdminOrderList();
  }


  // Change booking status to order dropped
  changeStatusToOrderDropped() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "ORDERDROPPED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to order dropped";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.adminApiService.sendUpdateAdminOrderList();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }

// Change booking status to order lock In
  changeStatusToOrderLockIn() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "LOCKEDIN"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
         response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to Order Lock In";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.adminApiService.sendUpdateAdminOrderList();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );

  }

// Changed booking status to cargo released
  changeStatusToCargoReleased() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "CARGORELEASED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to Cargo Released";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.adminApiService.sendUpdateAdminOrderList();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else{
            this.display_message = this.error;
          }
        }
      );

  }
  GeneratePaymentList() {
    this.router.navigate(['admin/dashboard']);
  }

}
