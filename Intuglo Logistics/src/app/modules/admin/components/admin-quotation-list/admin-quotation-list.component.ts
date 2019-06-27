import { Component, OnInit, Output, EventEmitter, Input, NgModule } from '@angular/core';
import { AdminApiService } from './../../services/admin-api.service';
import { SessionStorage } from '../../../models/session-storage';
import { Subscription } from 'rxjs/Subscription';
import { GroupByPipe } from './../../group-by.pipe';
import {SharedService} from '@app/modules/shared/services/shared.service';
@Component({
  selector: 'admin-quotation-list',
  templateUrl: './admin-quotation-list.component.html',
  styleUrls: ['./admin-quotation-list.component.css'],
})
// groupbypipe component for group-by filter
@NgModule({
  declarations: [ GroupByPipe ]
})

export class AdminQuotationListComponent implements OnInit {
  @Output() shareIsCheckedChecboxToDashboard = new EventEmitter();
  @Input() vesselId;
  session = new SessionStorage(); //instance for session
  subscription: Subscription;
  quotationList;

  constructor(private adminApiService:AdminApiService, private sharedService: SharedService) { 
    // update quotation list information
    this.subscription = this.adminApiService.getUpdateQuotationList().subscribe(details => {
      this.ngOnChanges();
    });
  }

  ngOnInit() {
    // get quotation list based on selected vessel
    this.adminApiService.getQuotationListByVessel(this.session.loginID,this.session.sessionID,this.vesselId)
      .subscribe( getQuotationInfo => {
            this.quotationList = getQuotationInfo;

      });
  }

  ngOnChanges(){
    // get list of quotations based on selected vessel
    this.adminApiService.getQuotationListByVessel(this.session.loginID,this.session.sessionID,this.vesselId)
      .subscribe( getQuotationInfo => {
            this.quotationList = getQuotationInfo;
      });
  }

  // check selected checkbox
  updateSelection(position, quotationList) {
    quotationList.forEach(function (quotation, index) {
      if (position != index) {
        quotation.checked = false;
      }
    });
  }

  // send quotation id and quotation status to action button component
  getQuotationId(event,quotationId, quotationStatus) {
    if (event.target.checked) {
      this.shareIsCheckedChecboxToDashboard.emit(true);
      this.adminApiService.quotationId = quotationId;
      this.adminApiService.quotationStatus = quotationStatus;
      this.sharedService.changeMessage({
        event: "adminQuotationAction",
        status: quotationStatus
      });
    } else {
      this.shareIsCheckedChecboxToDashboard.emit(false);
    }
  }

}
