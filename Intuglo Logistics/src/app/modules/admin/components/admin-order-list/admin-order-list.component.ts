import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { AdminApiService } from './../../services/admin-api.service';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs/Subscription';
import { SessionStorage } from '../../../models/session-storage';
import * as $ from 'jquery';

@Component({
  selector: 'admin-order-list',
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.css']
})
export class AdminOrderListComponent implements OnInit, AfterViewInit {
  @Output() shareDataToAdminOrderList = new EventEmitter();
  @Input() selectedQuotation;
  @Input() orderID;
  @Input() quotationID;
  @Output() shareContainerIdToAdminOrderList = new EventEmitter();
  session = new SessionStorage();
  tableList: any;
  failure_message: string = "There is no order for this quotation";
  bookingType: string = 'bookingInformation';
  isChecked: boolean;
  count: number = 0;
  supplierDetails;
  sessionDetails;
  rawJsonOrdersDetails;
  supplierOrders;
  subscription: Subscription;
  hasBooking: boolean = true;

  listOfItems: any = [
    {name: 'Booking Information', info: 'bookingInformation'},
    {name: 'Company Information', info: 'companyInformation'},
    {name: 'Destination', info: 'destination'},
    {name: 'Cargo Information', info: 'cargoInformation'},
    {name: 'Declaration of Cargo Value', info: 'declarationCargoValue'},
    {name: 'Booking Price', info: 'bookingPrice'},
    {name: 'Final Closing Price', info: 'finalClosing'},
    {name: 'Tracking', info: 'tracking'},
    {name: 'Payment from Customer', info: 'paymentCustomer'},
    {name: 'Notifications Actions by Operators', info: 'notificationAction'},
    {name: 'Tracking - Custom Clearance', info: 'trackingCustom'}];
  
  constructor(
    private adminApiService: AdminApiService,
    private sharedService: SharedService) {
    this.subscription = this.adminApiService.getUpdateAdminOrderList().subscribe(details => {
      this.ngOnInit();
    });
  }
  ngAfterViewInit() {
    // const getListWidth = $('.tabbed').width();
    // const listItems = document.querySelectorAll('.tabbed li');
    // for (let i = 0; i < listItems.length; i++) {
    //   $('.tabbed').width(getListWidth);
    //   console.log(listItems[i].clientWidth);
    // }
    // console.log(getListWidth);
  }
  fixedcol() {

  }

  showIt(bookingType) {
    this.bookingType = bookingType;
  }
  ngOnInit() {
    // get list of orders
    this.adminApiService.getAdminOrderList(this.session.loginID, this.session.sessionID)
      .subscribe(getOrdersInfo => {
        this.rawJsonOrdersDetails = getOrdersInfo;
      });
  }

  ngOnChanges() {

    // displaying list of orders based on selected quotation id
    if (this.quotationID != null) {
      this.adminApiService.getAdminOrderListByQuotations(this.session.loginID, this.session.sessionID, this.quotationID)
        .subscribe(getOrdersInfo => {
          this.rawJsonOrdersDetails = getOrdersInfo;
          this.hasBooking = true;
        },
          error => {
            if (error.status == 400) {
              this.hasBooking = false;
              this.failure_message;
            }
          });
    }
    // displaying order details based on selected order id
    else if (this.orderID != null) {
      this.adminApiService.getAdminOrderList(this.session.loginID, this.session.sessionID)
        .subscribe(getOrdersInfo => {
          this.rawJsonOrdersDetails = getOrdersInfo.filter((item) => {
            return item.order_id === (this.orderID)
          });
        });
    }
  }

  // update checkbox selection
  updateSelection(position, rawJsonOrdersDetails) {
    rawJsonOrdersDetails.forEach(function (booking, index) {
      if (position != index) {
        booking.checked = false;
      }
    });
  }

  //get selected order id and button code and share to action button component
  getOrderIdAndButtonCode(event, orderId, orderStatusCode, buttonCode) {
    if (event.target.checked) {
      this.shareDataToAdminOrderList.emit(true);
      this.sharedService.orderId = orderId;
      this.sharedService.orderStatusCode = orderStatusCode;
      this.sharedService.buttonCode = buttonCode;
    } else {
      this.shareDataToAdminOrderList.emit(false);
    }
  }
}
