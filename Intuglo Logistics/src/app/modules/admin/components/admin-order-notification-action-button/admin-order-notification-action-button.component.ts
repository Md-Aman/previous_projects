import { Component, OnInit, Input } from '@angular/core';
import { AdminApiService } from '../../../admin/services/admin-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionStorage } from '../../../models/session-storage';


@Component({
  selector: 'admin-order-notification-action-button',
  templateUrl: './admin-order-notification-action-button.component.html',
  styleUrls: ['./admin-order-notification-action-button.component.css']
})
export class AdminOrderNotificationActionButtonComponent implements OnInit {

  @Input() step: string;
  // @Input() quotationId: string;

  stepBooking: boolean = false;
  stepCargo: boolean = false;
  stepPayment: boolean = false;
  stepCustom: boolean = false;
  // supplierDetails: any[];
  response: any[];
  // supplierLoginDetails: any[];
  session = new SessionStorage();   //Create instance of SessionStorage
  isPopup: boolean = false;
  getMessage:any[];
  message:any[];

  constructor(
    private adminApiService: AdminApiService,
    private toastr: ToastrService, 
    public router: Router
  ) {
  }
    colorButtonBooking() {
    this.stepBooking = true;
    this.stepCargo = false;
    this.stepPayment = false;
    this.stepCustom = false;
  }
  colorButtonCargo() {
    this.stepBooking = false;
    this.stepCargo =  true;
    this.stepPayment = false;
    this.stepCustom = false;
  }
  colorButtonPayment() {
    this.stepBooking = false;
    this.stepCargo = false;
    this.stepPayment = true;
    this.stepCustom = false;
  }
  colorButtonCustom() {
    this.stepBooking = false;
    this.stepCargo = false;
    this.stepPayment = false;
    this.stepCustom = true;
  }

  ngOnInit() {
  }

  DaysClose(){
    this.router.navigate(['admin/dashboard']);
  }

  BookClose(){
    this.router.navigate(['admin/dashboard']);
  }
  
  PickUpCargo(){
    this.router.navigate(['admin/dashboard']);
  }

  SendCargo(){
    this.router.navigate(['admin/dashboard']);
  }

  ApproveCreditBlock(){
    this.router.navigate(['admin/dashboard']);
  }

  FinalPaymentDeducted(){
    this.router.navigate(['admin/dashboard']);
  }
  
  SendDocumentation(){
    this.router.navigate(['admin/dashboard']);
  }

  FillUpDeclaration(){
    this.router.navigate(['admin/dashboard']);
  }

  PayCustomTax(){
    this.router.navigate(['admin/dashboard']);
  }

}