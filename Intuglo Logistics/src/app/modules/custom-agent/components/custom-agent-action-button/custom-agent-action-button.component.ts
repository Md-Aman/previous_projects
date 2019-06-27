import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CustomAgentApiService } from './../../services/custom-agent-api.service';
import { SessionStorage } from '../../../models/session-storage';

@Component({
  selector: 'custom-agent-action-button',
  templateUrl: './custom-agent-action-button.component.html',
  styleUrls: ['./custom-agent-action-button.component.css']
})
export class CustomAgentActionButtonComponent implements OnInit {
  @Input() documentLength: boolean;
  @Input() customStatus: string;
  @Output() hideAdminActionButtons = new EventEmitter();

  // http 202
  failure_message: string = "You are not allowed to change the booking status of this booking";
  error: string = "Something happend wrong. Try again later.";
  // http 401
  session_expired = "It seems your session is expired! Please login and try again.";
  message: string;
  isPopup: boolean = false;

  //Create instance of SessionStorage
  session = new SessionStorage();

  constructor(public customAgentApiService: CustomAgentApiService) { }

  ngOnInit() {
  }

  closePopup(){
    this.hideAdminActionButtons.emit(false);
    this.customAgentApiService.sendUpdateAdminBooking();
  }
  
  // Change Booking status to document submitted
  documentSubmitted() {
    let orderDetails = {
      "order_id": this.customAgentApiService.orderId,
      "current_order_status_code": this.customAgentApiService.cargoStatusCode,
      "order_status_code": "CLEARINGCUSTOMDEPARTURE"
    }
    this.customAgentApiService.changeCustomStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to document submitted";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customAgentApiService.sendUpdateAdminBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
  }

// Chage booking status to custom approved
  customApproved() {
    let orderDetails = {
      "order_id": this.customAgentApiService.orderId,
      "current_order_status_code": this.customAgentApiService.customStatusCode,
      "order_status_code": "CARGOCLEAREDDEPARTURE"
    }
    this.customAgentApiService.changeCustomStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to custom approved";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customAgentApiService.sendUpdateAdminBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
  }

  // Change booking status to rejected by custom
  customRejected(){
    let orderDetails = {
      "order_id": this.customAgentApiService.orderId,
      "current_order_status_code": this.customAgentApiService.customStatusCode,
      "order_status_code": "REJECTEDBYCUSTOM"
    }
    this.customAgentApiService.changeCustomStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to custom rejected";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customAgentApiService.sendUpdateAdminBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
  }
  
  // change booking status to hold by custom
  holdByCustom(){
    let orderDetails = {
      "order_id": this.customAgentApiService.orderId,
      "current_order_status_code": this.customAgentApiService.customStatusCode,
      "order_status_code": "HOLDBYCUSTOM"
    }
    this.customAgentApiService.changeCustomStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to hold by custom";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customAgentApiService.sendUpdateAdminBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
  }

}
