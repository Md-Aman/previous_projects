import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { AdminApiService } from './../../services/admin-api.service';
import { SessionStorage } from '../../../models/session-storage';

@Component({
  selector: 'admin-view-quotation-template',
  templateUrl: './admin-view-quotation-template.component.html',
  styleUrls: ['./admin-view-quotation-template.component.css']
})
export class AdminViewQuotationTemplateComponent implements OnInit {
  session = new SessionStorage();
  quotationDetails;
  quotationId;

  constructor(private dialogRef: MatDialogRef<AdminViewQuotationTemplateComponent>,
    private adminApiService:AdminApiService) { }

  ngOnInit() {
    this.quotationId = this.adminApiService.getQIdToView(); //get quotation id from service
    // get quotation details of selected quotation
    this.adminApiService.getQuotationDetails(this.session.loginID,this.session.sessionID,this.quotationId)
      .subscribe( getQuotationInfo => {
            this.quotationDetails = getQuotationInfo[0];
      });
      
  }

  /// close popup window
  onCloseCancel() {
    this.dialogRef.close();
  }

}
