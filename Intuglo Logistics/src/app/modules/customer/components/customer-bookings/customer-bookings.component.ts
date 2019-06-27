import { Component, OnInit, Output, EventEmitter, Input, NgModule } from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';
import { SharedService } from '../../../shared/services/shared.service';
import { GroupByPipe } from './../../../group-by.pipe';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CustomerSessionExpiredDialogComponent } from '../customer-session-expired-dialog/customer-session-expired-dialog.component';
import { SessionStorage } from '../../../models/session-storage';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'customer-bookings',
  templateUrl: './customer-bookings.component.html',
  styleUrls: ['./customer-bookings.component.css']
})
// @NgModule({
//   declarations: [GroupByPipe]
// })
export class CustomerBookingsComponent {
  @Input() country: String;
  @Output() shareIsCheckedChecboxToDashboard = new EventEmitter();

  session = new SessionStorage();

  customerBookings = [];
  customerDetails: any[];
  sessionDetails: any[];
  // session: any[];
  rawJsonBookingDetails: any[];
  customerBookingsValues;
  isSessionExpired: any[];
  selectDisabled: boolean = true;

  count: number = 0;
  select: boolean;
  selectedAll: any;
  checkbox_length: number;
  subscription: Subscription;
  documents: any;
  constructor(
    private service: CustomerApiService,
    private sharedService: SharedService,
    private router: Router,
    public dialog: MatDialog) {
    this.subscription = this.service.getUpdateCustomerBooking().subscribe(details => {
      this.ngOnChanges();
      // this.ngOnInit();
    });

  }

  // get booking list based on selected country
  ngOnChanges() {
    this.service.getCustomerBookings(this.session.loginID, this.session.sessionID)
      .subscribe(getQuotationInfo => {
        this.rawJsonBookingDetails = getQuotationInfo.filter((item) => {
          return item.country === (this.country)
        });
      },
      // error => {
      //   //if session if expired or error status is returned
      //   if (error.status == 400) {
      //     this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
      //   }
      // }
    );

  }


  // get list of bookings upon page reloading
  ngOnInit() {
    this.service.getCustomerBookings(this.session.loginID, this.session.sessionID)
      .subscribe(getBookingInfo => {
        this.rawJsonBookingDetails = getBookingInfo;
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  // update checkbox selection
  updateSelection(position, rawJsonBookingDetails) {
    rawJsonBookingDetails.forEach(function (booking, index) {
      if (position != index) {
        booking.checked = false;
      }
    });
  }

  // get order id, order status and button code
  getOrderIdAndOrderStatusCodeAndButtonCode(event, orderId, orderStatusCode, buttonCode, payment_status_code = '') {
    if (event.target.checked) {
      this.shareIsCheckedChecboxToDashboard.emit(true);
      this.sharedService.orderId = orderId;
      this.sharedService.orderStatusCode = orderStatusCode;
      this.sharedService.buttonCode = buttonCode;
      this.sharedService.sendButtonCode(buttonCode);
      this.sharedService.changeMessage({
        event: 'orderBookingStatus',
        status: orderStatusCode,
        paymentStatusCode: payment_status_code
      });
    } else {
      this.shareIsCheckedChecboxToDashboard.emit(false);
    }
  }

}