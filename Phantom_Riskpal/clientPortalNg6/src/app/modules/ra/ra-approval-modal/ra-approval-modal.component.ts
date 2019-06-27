import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { Router } from '@angular/router';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { ConstantType } from './../../../core/services/constant.type';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-ra-approval-modal',
  templateUrl: './ra-approval-modal.component.html',
  styleUrls: ['./ra-approval-modal.component.scss']
})
export class RaApprovalModalComponent implements OnInit {

  @Input() isApproveAndShare: boolean = false;
  @Input() isRequestMoreInfo: boolean = false;
  @Input() isForwardToRaManagers: boolean = false;

  constructor(
    private router: Router,
    private toastarService: ToastarService,
    private responseService: ResponseService,
    private riskAssessmentService: RiskAssessmentService,
    private dialogRef: MatDialogRef<RaApprovalModalComponent>) { }

  loading: boolean = false;
  isShareWithOther: boolean = false;
  otherManager = [];
  forwardToManager:string;
  approvingManagers = [];
  feedback: string;

  raDetails: boolean = false;
  questions: boolean = false;
  supplier: boolean = false;
  communication: boolean = false;
  contingency: boolean = false;
  other: boolean = false;

  ngOnInit() {
    this.getDeptRelatedUsersAprovingmanger(this.riskAssessmentService.getTemplate()._id)
  }

  getDeptRelatedUsersAprovingmanger(templateId) {
    this.riskAssessmentService.getDeptRelatedUsersAprovingmanger(templateId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          const approvingManagersData = [];
          response.traveller.client_department.forEach(function (dept) {
            response.data.forEach(function (final_user) {
              if (final_user._id == dept.final_approving_manager
                || final_user._id == dept.alternative_final_approving_manager ||
                final_user._id == dept.intermediate_approving_manager) {
                approvingManagersData.push(final_user);
              }

            });
          });
          this.approvingManagers = approvingManagersData.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          });
          this.approvingManagers = this.approvingManagers.map(item => {
            item.name = item.firstname + ' ' + item.lastname;
            return item;
          });

        } else {
          // this.responseService.handleErrorResponse(response);
        }
      }, error => {
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  closeDialog() {
    this.dialogRef.close();
  }
  approveAndShareWithOthers() {
    this.isShareWithOther = true;
  }

  approveAndComplete() {
    const raData = this.riskAssessmentService.getRiskAssessment();
    raData['approve'] = true;
    raData['description_of_action'] = this.feedback;
    raData['approving_manager_ids'] = [];
    this.approveRa(raData);
  }

  shareWithOther() {
    if (this.otherManager.length > 0) {
      const raData = this.riskAssessmentService.getRiskAssessment();
      raData['approve'] = true;
      raData['description_of_action'] = this.feedback;
      raData['approvingManager'] = this.otherManager;
      raData['approving_manager_ids'] = this.otherManager;
      const sharedWith = [];
      this.otherManager.map(item => {
        sharedWith.push({_id: item._id});
      });
      raData['shared_with'] = sharedWith;
      this.approveRa(raData);
    } else {
      this.toastarService.showNotification('Please choose approving manager', 'warning');
    }
  }

  wantMoreInfo() {
    if (this.raDetails || this.questions || this.supplier || this.communication || this.contingency || this.other) {
      const raData = this.riskAssessmentService.getRiskAssessment();
      if (this.raDetails === true) { raData['ra_details'] = 'Missing' } else { raData['ra_details'] = 'Completed' }
      if (this.questions === true) { raData['question'] = 'Missing' } else { raData['question'] = 'Completed' }
      if (this.supplier === true) { raData['supplier_details'] = 'Missing' } else { raData['supplier_details'] = 'Completed' }
      if (this.communication === true) { raData['communication_details'] = 'Missing' } else { raData['communication_details'] = 'Completed' }
      if (this.contingency === true) { raData['contingency_details'] = 'Missing' } else { raData['contingency_details'] = 'Completed' }
      if (this.other === true) { raData['other_info'] = 'Missing' } else { raData['other_info'] = 'Completed' }
      raData['description_of_action'] = this.feedback;

      this.moreInfoRaByManager(raData);

    } else {
      this.toastarService.showNotification('Please fill description of action', 'warning');
    }
  }

  forwardRisk() {
    if (this.forwardToManager != null) {
      const raData = this.riskAssessmentService.getRiskAssessment();
      raData['otherapprovingManagerArr'] = this.forwardToManager;
      raData['description_of_action_forward'] = this.feedback;
      this.forwardRaToManager(raData);
    } else {
      this.toastarService.showNotification('Please choose approving manager', 'warning');
    }
  }
  approveRa(raData) {
    this.loading = true;
    this.riskAssessmentService.generatePDF(raData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          // once generate pdf api will work without any error then naviagte from here
          // this.router.navigate(['secure/ra/pending']);
          this.approveRaByManager(raData);
        }
        //  else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
    
  }

  approveRaByManager(raData) {
    this.loading = true;
    this.riskAssessmentService.approveRaByManager(raData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.dialogRef.close();
          this.router.navigate(['secure/ra/pending']);
          // this.responseService.hanleSuccessResponse(response);
        }
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  moreInfoRaByManager(raData){
    this.loading = true;
    this.riskAssessmentService.moreInfoRaByManager(raData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.dialogRef.close();
          this.router.navigate(['secure/ra/pending']);
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  forwardRaToManager(raData) {
    console.log("ra data :", raData);
    this.loading = true;
    this.riskAssessmentService.generatePDF(raData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          // once generate pdf api will work without any error then naviagte from here
          // this.router.navigate(['secure/ra/pending']);
          this.riskAssessmentService.forwardToManager(raData).subscribe(
            (response1: any) => {
              this.loading = false;
              if (response1.code === 200) {
                // this.responseService.hanleSuccessResponse(response);
                this.dialogRef.close();
                this.router.navigate(['secure/ra/pending']);
              }
              //  else {
              //   this.responseService.handleErrorResponse(response);
              // }
            }, error => {
              this.loading = false;
              // this.responseService.handleErrorResponse(error.error);
            }
          )
        }
        //  else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
   
  }

}
