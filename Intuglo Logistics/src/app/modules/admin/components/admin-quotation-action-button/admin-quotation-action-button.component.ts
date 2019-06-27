import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { AdminApiService } from "./../../services/admin-api.service";
import { Subscription } from "rxjs/Subscription";
import { SessionStorage } from "../../../models/session-storage";
import { AdminViewQuotationTemplateComponent } from './../../components/admin-view-quotation-template/admin-view-quotation-template.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import {SharedService} from '@app/modules/shared/services/shared.service';
@Component({
  selector: "admin-quotation-action-button",
  templateUrl: "./admin-quotation-action-button.component.html",
  styleUrls: ["./admin-quotation-action-button.component.css"],
})
export class AdminQuotationActionButtonComponent implements OnInit {
  @Input() step: string;
  @Output() hideCustomerActionButtons = new EventEmitter();
  @Input() quotationId: string;
  @Input() quotationStatus: string;
  session = new SessionStorage(); //Create instance of SessionStorage
  quotationStatusLocal: string;
  isPopup: boolean = false;
  getMessage;
  message;
  errorMessage;
  response;
  download;
  // stepQuotation: boolean = false;
  // stepNotification: boolean = false;

  constructor(
    private adminApiService: AdminApiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {}

  // colorButtonPublish() {
  //   this.stepQuotation = true;
  //   this.stepNotification = false;

  // }
  // colorButtonModify() {
  //   this.stepQuotation = false;
  //   this.stepNotification =  true;
  // }

  ngOnInit() {
    this.sharedService.currentMessage.subscribe(data => {
      if ( data.event == 'adminQuotationAction' ) {
        this.quotationStatusLocal = data.status;
      }
    })
  }

  // to close the popup window
  closePopup() {
    this.hideCustomerActionButtons.emit(false);
    // this.customerApiService.sendUpdateCustomerBooking();
  }

  // download file of uploaded quotation file
  DownloadPdfCopy() {
    this.quotationId = this.adminApiService.quotationId //get quotation id
    this.adminApiService
      .downloadQuotationFile(
        this.session.loginID,
        this.session.sessionID,
        this.quotationId
      )
      .subscribe(
        status => {
          this.response = Object.values(status);
          if (this.response[1] == 200) {
            this.download = this.response[0];
            var a = document.createElement("a");
            document.body.appendChild(a);
            window.open(this.download, "_blank"); //open new window to download file
            a.click();
            a.remove();
            this.showDownloadFileSuccess(); //to show success notification
          }
          if (this.response[1] == 204) {
            this.showDownloadFileFailure(); //to show failure notification
          }
        },
        error => {
          this.response = Object.values(error);
          if (this.response[1] == 400) {
            this.showDownloadFileFailure(); //to show failure notification
          }
        }
      );
  }

  // open quotation template component
  ViewQuotation() {
    //share quotation id to view quotation template
    this.adminApiService.sendQIdToView(this.adminApiService.quotationId); 
    this.dialog.open(AdminViewQuotationTemplateComponent, {
      disableClose: true,
      height:'660px'
    });
  }
  
  // change quotation status to APPROVED
  QuotationTally() {
    let quotationId = {
      quotationId: this.adminApiService.quotationId,
      quotationStatus: this.adminApiService.quotationStatus,
      expectedStatus: "APPROVED"
    };
    console.log(quotationId);
    this.adminApiService
      .approvedQuotation(
        this.session.loginID,
        this.session.sessionID,
        quotationId
      )
      .subscribe(
        status => {
          // this.getMessage = status;
          // this.errorMessage = Object.values(this.getMessage);
          // console.log(this.errorMessage)
          // if(this.errorMessage[0] == 200){
          //   this.message = "Quotation status has been updated."
          // }
          this.adminApiService.sendUpdateQuotationList();
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

  showDownloadFileSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success("File downloaded successfully!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  showDownloadFileFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error("File not downloaded!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }
}
