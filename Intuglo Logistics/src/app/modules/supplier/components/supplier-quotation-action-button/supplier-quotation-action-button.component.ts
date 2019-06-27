import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SupplierApiService } from '../../../supplier/services/supplier-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionStorage } from '../../../models/session-storage';
import {SharedService} from '@shared/services/shared.service';
@Component({
  selector: 'supplier-quotation-action-button',
  templateUrl: './supplier-quotation-action-button.component.html',
  styleUrls: ['./supplier-quotation-action-button.component.css']
})
export class SupplierQuotationActionButtonComponent implements OnInit {
  
  @Input() step: string;
  @Input() quotationId: string;
  @Input() quotationStatus: string;
  @Output() getQuotationsCountryList = new EventEmitter();
  stepPublish: boolean = false;
  stepModify: boolean = false;
  stepQuotation: boolean = false;
  supplierDetails: any[];
  response: any[];
  supplierLoginDetails: any[];
  session = new SessionStorage();   //Create instance of SessionStorage
  isPopup: boolean = false;
  getMessage:any[];
  message:any[];
  
  constructor(private supplierApiService: SupplierApiService, 
      private toastr: ToastrService, public router: Router,
      private sharedService: SharedService) {
  }

  colorButtonPublish() {
    this.stepPublish = true;
    this.stepModify = false;
    this.stepQuotation = false;

  }
  colorButtonModify() {
    this.stepPublish = false;
    this.stepModify =  true;
    this.stepQuotation = false;
  }
  colorButtonQuotation() {
    this.stepPublish = false;
    this.stepModify = false;
    this.stepQuotation = true;
  }

  ngOnInit() {
    
  }

  RequestConfirmation(){
    let quotationId = {
      "quotationId": this.supplierApiService.quotationId
    }
    this.supplierApiService.requestConfirmation(this.session.loginID,this.session.sessionID,quotationId) 
    .subscribe(
      status => {
        this.getMessage = status;
        this.message = Object.values(this.getMessage);
        this.supplierApiService.sendUpdateQuotationList();
        // this.showSuccess();     //to show success notification
      },
      error => {
          this.isPopup = true;
          // this.response = Object.values(error)
          // if (this.response[1] == 400) {
          //   this.showFailure();         //to show failure notification
          // }          
      }
    );
  }
 
  // function to activate quotation by sending selected quotation id to API
  ActivateQuotation(){
    let quotationId = {
      "quotationId": this.supplierApiService.quotationId
    }
    this.supplierApiService.activateQuotation(this.session.loginID,this.session.sessionID,quotationId) 
    .subscribe(
      status => {
        this.getMessage = status;
        this.message = Object.values(this.getMessage);
        this.supplierApiService.sendUpdateQuotationList();
        // this.showSuccess();     //to show success notification
      },
      error => {
          this.isPopup = true;
          // this.response = Object.values(error)
          // if (this.response[1] == 400) {
          //   this.showFailure();         //to show failure notification
          // }          
      }
    );
  }

  // function to allow user to modify quotation details based on selected quotation
  ModifyQuotation(){
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"))
    // this.supplierLoginDetails = Object.values(this.supplierDetails);
    this.supplierApiService.sendQId(this.supplierApiService.quotationId);
    this.router.navigate(['supplier/modifyquotation']);
  }

  // function to allow user to modify quotation details based on selected quotation
  ViewQuotation(){
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"))
    // this.supplierLoginDetails = Object.values(this.supplierDetails);
    this.supplierApiService.sendQId(this.supplierApiService.quotationId);
    this.router.navigate(['supplier/viewquotation']);
  }

  // function to duplicate quotation by sending quotation details based on selected quotation id to API
  DuplicateQuotation(){
    let quotationId = {
      "quotationId": this.supplierApiService.quotationId
    }
    this.supplierApiService.duplicateQuotation(this.session.loginID,this.session.sessionID,this.supplierApiService.quotationId) 
    .subscribe(
      status => {
        this.response = Object.values(status)
        if (this.response[0] == 200 ) {
          // this.showSuccess();     //to show success notification
        }
        this.supplierApiService.sendUpdateQuotationList();
        // this.showSuccess();     //to show success notification

      },
      error => {
        this.response = Object.values(error)
        if (this.response[1] == 400) {
          this.showFailure();         //to show failure notification
        }      
      }
    );
  }

  newTemplate(){

  }
  
  DeleteQuotation(){
    let quotationId = {
      "quotationId": this.supplierApiService.quotationId
    }   
    this.supplierApiService.deleteQuotation(this.session.loginID,this.session.sessionID,quotationId) 
    .subscribe(
      status => {
        this.getMessage = status;
        this.message = Object.values(this.getMessage);
        this.supplierApiService.sendUpdateQuotationList();
        
        this.getQuotationsCountryList.emit();
      },
      error => {
          this.isPopup = true;
      }
    );
    }
    closeQuotationDeletePopup() {
      // communicate between component using service
      this.sharedService.changeMessage({
        event: 'supplierActionButtonCheckBoxStatus',
        status: false
      });
    }
   //to show success notification properties
   showSuccess() {
    this.toastr.success('Your quotation successfully updated!','Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'      
    });
  }

  //to show failure notification properties
  showFailure() {
    this.toastr.error('Your quotation failed to update!','Unsuccessful!', {
    closeButton: true,
    progressBar: true,
    progressAnimation: 'increasing',
    positionClass: 'toast-top-right'
  });
}
}
