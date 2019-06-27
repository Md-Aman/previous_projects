import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SupplierApiService } from './../../services/supplier-api.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Subscription } from 'rxjs/Subscription';
import { SessionStorage } from '../../../models/session-storage';
@Component({
  selector: 'supplier-bookings',
  templateUrl: './supplier-bookings.component.html',
  styleUrls: ['./supplier-bookings.component.css']
})
export class SupplierBookingsComponent implements OnInit {
  @Output() shareDataToSupplierDashboard = new EventEmitter();
  @Output() shareCheckedMasterCheckBoxToSupplierDashboard = new EventEmitter();
  @Input() selectedQuotation;
  @Input() containerId;
  @Output() shareContainerIdToSupplierDashboard = new EventEmitter();
  session = new SessionStorage();
  selectedAll: any;
  isChecked: boolean;
  count: number = 0;
  supplierDetails;
  sessionDetails;
  rawJsonOrdersDetails: any;
  supplierOrders;
  subscription: Subscription;
  tableList: any;
  hasBooking: boolean = true;
  failure_message: string = "There is no order for this container";
  bookingType: string = 'bookingInformation';
  isBookingInformation: boolean = true;
  isCompanyInformation: boolean = false;
  isDestination: boolean = false;
  isCargoInformation: boolean = false;
  isDeclarationCargoValue: boolean = false;
  isStatus: boolean = false;
  isDocumenttationSubmission: boolean = false;
  isCustom: boolean = false;

  listOfItems: any = [
    { name: 'Booking Information', info: 'bookingInformation' },
    { name: 'Company Information', info: 'companyInformation' },
    { name: 'Destination', info: 'destination' },
    { name: 'Cargo Information', info: 'cargoInformation' },
    { name: 'Documentation Submission Tracking', info: 'documentationSubmission' },
    { name: 'Custom', info: 'custom' },
    { name: 'Status', info: 'status' }];

  constructor(private supplierApiService: SupplierApiService, private sharedService: SharedService) {
    this.subscription = this.supplierApiService.getUpdateSupplierBooking().subscribe(details => {
      this.ngOnChanges();
    });
  }

  fixedcol() {

  }
  showIt(bookingType) {
    this.bookingType = bookingType;
  }

  ngOnInit() {
    this.supplierApiService.getSupplierBookings(this.session.loginID, this.session.sessionID)
      .subscribe(getOrdersInfo => {
        if (getOrdersInfo) {
          this.rawJsonOrdersDetails = getOrdersInfo.filter((item) => {
            return (item.container_id === (this.containerId))
          });
        } else {
          this.hasBooking = false;
        }
      },
        error => {
          this.hasBooking = false;
          if (error.status == 400) {
            this.hasBooking = false;
            this.failure_message;
          }
        });
  }

  ngOnChanges() {
    this.supplierApiService.getSupplierBookings(this.session.loginID, this.session.sessionID)
      .subscribe(getOrdersInfo => {
        this.rawJsonOrdersDetails = getOrdersInfo.filter((item) => {
          return (item.container_id === (this.containerId))
        });
      },
        error => {
          if (error.status == 400) {
            this.hasBooking = false;
            this.failure_message;
          }
        });
  }

  updateSelection(position, rawJsonOrdersDetails) {

    rawJsonOrdersDetails.forEach(function (booking, index) {
      if (position != index) {
        booking.checked = false;
      }
    });
  }

  getOrderIdAndButtonCode(event, orderId, orderStatusCode, buttonCode) {
    if (event.target.checked) {
      this.sharedService.orderId = orderId;
      this.sharedService.orderStatusCode = orderStatusCode;
      this.sharedService.buttonCode = buttonCode;
      this.sharedService.sendButtonCode(buttonCode);
      this.shareDataToSupplierDashboard.emit(true);
    } else {
      this.shareDataToSupplierDashboard.emit(false);
    }
  }

  selectAll(event,) {
    this.isChecked = !this.isChecked;
    for (var i = 0; i < this.rawJsonOrdersDetails.length; i++) {
      this.rawJsonOrdersDetails[i].checked = this.selectedAll;
    }
    if (event.target.checked) {
      this.shareCheckedMasterCheckBoxToSupplierDashboard.emit(true);
    }
    else {
      this.shareCheckedMasterCheckBoxToSupplierDashboard.emit(false);
    }

  }

}
