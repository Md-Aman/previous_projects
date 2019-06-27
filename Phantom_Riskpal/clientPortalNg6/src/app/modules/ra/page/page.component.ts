import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { Router } from '@angular/router';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RaApprovalModalComponent } from './../ra-approval-modal/ra-approval-modal.component';
import { MatDialog, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  dialogRefApproval: MatDialogRef<RaApprovalModalComponent>;
  subscription:Subscription
  pages = {
    countryrequired: '',
    questionRequired: '',
    supplierRequired: '',
    communicationRequired: '',
    contingenciesRequired: ''
  };
  raPages: any = {};
  options = {
    selectedTab: ''
  };
  breadCrum = [
    { name: 'Risk Assessments', url: '/secure/ra' }
  ];
  templateName: String;
  isApprovingManager: boolean = false;
  constructor(
    private router:Router,
    public dialog: MatDialog,
    private cdref:ChangeDetectorRef,
    private responseService:ResponseService,
    private raTemplateService:RaTemplateService,
    private riskAssessmentService:RiskAssessmentService) {
      this.subscription = this.raTemplateService.currentRaChanges.subscribe(raPages => {
        this.raPages = raPages;
        if (this.raPages.type === 'raPagesOninIt') {
          this.pages.countryrequired = this.raPages.data.countryrequired;
          this.pages.questionRequired = this.raPages.data.questionRequired;
          this.pages.supplierRequired = this.raPages.data.supplierRequired;
          this.pages.communicationRequired = this.raPages.data.communicationRequired;
          this.pages.contingenciesRequired = this.raPages.data.contingenciesRequired;
          this.options.selectedTab = this.raPages.data.selectedTab;
          this.templateName = this.raPages.data.templateName;
          this.isApprovingManager = this.raPages.data.isApprovingManager
        } 
        else if (this.raPages.type === 'raTabChanged') {
          this.options.selectedTab = this.raPages.data.selectedTab;
        }
      })
     }

     
  ngOnInit() {
    if(this.riskAssessmentService.getTemplate() != null){
      this.updateDataFromSession(this.riskAssessmentService.getTemplate());
    }
    this.responseService.createBreadCrum(this.breadCrum);
    if (this.riskAssessmentService.getApprovingManagerToApprove()) {
      this.isApprovingManager = true;
    } else {
      this.isApprovingManager = false;
    }
  }
  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }
  updateDataFromSession(stepsChecked){
    this.pages.countryrequired = stepsChecked.countryrequired;
    this.pages.questionRequired = stepsChecked.questionRequired;
    this.pages.supplierRequired = stepsChecked.supplierRequired;
    this.pages.communicationRequired = stepsChecked.communicationRequired;
    this.pages.contingenciesRequired = stepsChecked.contingenciesRequired;
    this.templateName = stepsChecked.ra_name;
  }
  raNavigateStep(step){
    if (this.riskAssessmentService.getTemplate() != null && this.riskAssessmentService.getRiskAssessment() != null) {
      switch (step) {
        case 'raDetails': {
          this.router.navigate(['/secure/ra/create/ra-details/' + this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id]);
          break;
        }
        case 'country': {
          this.router.navigate(['/secure/ra/create/country-profile/'+ this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id+'/'+this.riskAssessmentService.getRiskAssessment().country],{ queryParams: { countryProfile: true}});
          break;
        } case 'risk': {
          this.router.navigate(['/secure/ra/create/risk-mitigation/'+ this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id]);
          break;
        } case 'supplier': {
          this.router.navigate(['/secure/ra/create/supplier/'+ this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id]);
          break;
        } case 'communication':{
          this.router.navigate(['/secure/ra/create/communication/'+ this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id]);
          break;
        }
        case 'contingency':{
          this.router.navigate(['/secure/ra/create/contingency/'+ this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id]);
          break;
        }
        case 'otherDetails':{
          this.router.navigate(['/secure/ra/create/other-details/'+ this.riskAssessmentService.getTemplate()._id+'/'+this.riskAssessmentService.getRiskAssessment()._id]);
          break;
        }
      }
    }
  }

  approveAndShare() {
    this.dialogRefApproval = this.dialog.open(RaApprovalModalComponent, {
      width: '45%',
      disableClose: false,
      closeOnNavigation: true
    });
    this.dialogRefApproval.componentInstance.isApproveAndShare = true;
  }

  requestMoreInformation() {
    this.dialogRefApproval = this.dialog.open(RaApprovalModalComponent, {
      width: '45%',
      disableClose: false,
      closeOnNavigation: true
    });
    this.dialogRefApproval.componentInstance.isRequestMoreInfo = true;
  }

  ForwardRaManagers() {
    this.dialogRefApproval = this.dialog.open(RaApprovalModalComponent, {
      width: '45%',
      disableClose: false,
      closeOnNavigation: true
    });
    this.dialogRefApproval.componentInstance.isForwardToRaManagers = true;
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
