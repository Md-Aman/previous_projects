import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { FormBuilder, FormGroup, Validators, FormArray, Form } from '@angular/forms';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { ConfirmationDialogComponent } from '././../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from "@angular/material";
import { AuthService } from './../../../core/guards/auth.service';
import { RaApprovalModalComponent } from './../ra-approval-modal/ra-approval-modal.component';
import { RaService } from './../../../shared/ra/service/ra.service';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss'],
  // encapsulation: ViewEncapsulation.Native
})
export class OtherDetailsComponent implements OnInit {
  // file: File;
  otherDetailsForm: FormGroup;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  dialogRefApproval: MatDialogRef<RaApprovalModalComponent>;

  constructor(
    private raTemplateService: RaTemplateService,
    public router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private responseService: ResponseService,
    private riskAssessmentService: RiskAssessmentService,
    private authService: AuthService,
    private raService: RaService) { }

  loading: boolean = false;
  templateId: string;
  raId: string;
  isApprovingManager: boolean = false;
  documents = [];
  files = [];
  // isShowGraph: boolean = false;

  countryDetails = [];
  graphData = [];
  label: number;
  color;
  customColors = [];
  view = [];
  graphs: any = [];
  showYAxis = true;
  showLegend = false;
  isExceedLimit: boolean = false;

  temporaryVar;
  ngOnInit() {
    this.templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    this.raId = this.activatedRoute.snapshot.paramMap.get("raId");

    const templateData = this.riskAssessmentService.getTemplate();
    const riskAssessmentData = this.riskAssessmentService.getRiskAssessment();

    if (templateData != null && riskAssessmentData != null) {
      if (templateData.countryrequired === true) {
        this.temporaryVar = riskAssessmentData.country;
        const countryIds = riskAssessmentData.country;
        // this.isShowGraph = true;
        // this.getCountryThreatMatrix(countryIds);
      }
    }
    if (this.raId) {
      this.getRaDetailsAnyOtherInfo(this.raId);
    } else {
      this.router.navigate(['/secure/ra/create/ra-details']);
    }

    this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('otherDetails'));
    this.otherDetailsForm = this.formBuilder.group({
      relevantInfo: ['', []],
      riskDetailed: ['', []],
    });
  }

  // isUserApprovingManager(isExistApprovingManager) {
  //   if (isExistApprovingManager) {
  //     this.isApprovingManager = true;
  //   } else {
  //     this.isApprovingManager = false;
  //   }
  // }
  getRaDetailsAnyOtherInfo(raId) {
    this.loading = true;
    this.riskAssessmentService.getNewRaDetails(raId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          if (response.data != null) {
            this.setOtherDetailsForm(response.data)
          }
        }
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }

  setOtherDetailsForm(data) {
    this.documents = [];
    this.otherDetailsForm.patchValue({
      relevantInfo: data.relevant_info,
      riskDetailed: data.risk_detailed
    });
    if (data.supporting_docs.length > 0) {
      data.supporting_docs.forEach(element => {
        const docName = element.split('/').slice(-1)[0];
        this.documents.push({ 'docName': docName, fullName: element });
      });
    }
  }

  getFile(event) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (this.documents.length < 5) {
          this.documents.push({ file: files[i], docName: files[i].name });
        } else {
          this.isExceedLimit = true;
        }
      }
    }
    this.documents = this.documents.filter((v, i) =>
      this.documents.findIndex(item => item.docName == v.docName) === i);
  }

  deleteFile(fileName, i) {
    this.loading = true;
    const data = {
      news_ra_id: this.raId,
      file_name: fileName
    };
    if (fileName) {
      this.riskAssessmentService.deleteDoc(data).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.code === 200) {
            this.loading = false;
            this.documents.splice(i, 1);
            this.loading = false;
            // this.responseService.hanleSuccessResponse(response);
          }
          else {
            this.loading = false;
            // this.responseService.handleErrorResponse(response);
          }
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      );
    } else {
      this.documents.splice(i, 1);
      this.loading = false;
      // console.log("docs :", this.documents);
    }

    if (this.documents.length < 6) {
      this.isExceedLimit = false;
    }
  }

  submitForm(inputValue) {
    this.loading = true;
    if (this.otherDetailsForm.valid) {
      const data = {
        news_ra_id: this.raId,
        relevant_info: inputValue.relevantInfo,
        risk_detailed: inputValue.riskDetailed,
      };
      const formData: FormData = new FormData();
      formData.append('info', JSON.stringify(data));

      this.files = []
      if (this.documents.length > 0) {
        this.files = this.documents.filter(item => !item.fullName);
      }
      // console.log("docs :", this.files);
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          formData.append("file", this.files[i].file, this.files[i]['docName']);
        }
      }

      // if (this.file) {
      //   for (let i = 0; i < this.fileLength; i++) {
      //     formData.append("file", this.file[i], this.file[i]['name']);
      //   }
      // }
      this.riskAssessmentService.addAnyOtherInfo(formData).subscribe(
        (response: any) => {
          if (response.code === 200) {
            this.loading = false;
            this.responseService.hanleSuccessResponse(response);
            this.getRaDetailsAnyOtherInfo(this.raId);
            if (this.templateId && this.riskAssessmentService.getApprovingManagerToApprove() == null) {
              this.createRa(this.raId, this.templateId);
            }
          } else {
            this.loading = false;
            this.responseService.handleErrorResponse(response);
          }
        }, error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      );
    }
  }
  createRa(raId, templateId) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Submit selected RA to approving manager?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        const data = {
          news_ra_id: raId,
          types_of_ra_id: templateId,
        };

        // if (this.isShowGraph === true) {
        //   const countryGraphs = this.authService.getSessionStorage('countryGraphs');
        //   data['graph'] = JSON.parse(countryGraphs);
        // } else {
          // data['graph'] = [];
        // }
        this.riskAssessmentService.submitRAToManager(data).subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.loading = false;
              // this.responseService.hanleSuccessResponse(response);
              this.riskAssessmentService.removeRiskAssessmentSessionStorage();
              sessionStorage.removeItem('countryGraphs');
              this.router.navigate(['/secure/ra/list']);
            }
            else {
              this.loading = false;
              // this.responseService.handleErrorResponse(response);
            }
          },
          error => {
            this.loading = false;
            // this.responseService.handleErrorResponse(error.error);
          }
        );
      } else {
        this.dialogRef.close();
        // this.riskAssessmentService.removeRiskAssessmentSessionStorage();
        // this.router.navigate(['/secure/dashboard']);
      }
      this.dialogRef = null;
    });
  }

  otherDetails(step) {
    this.riskAssessmentService.otherDetails(step);
  }

  // approveAndShare() {
  //   this.dialogRefApproval = this.dialog.open(RaApprovalModalComponent, {
  //     width: '45%',
  //     disableClose: false,
  //     closeOnNavigation: true
  //   });
  //   this.dialogRefApproval.componentInstance.isApproveAndShare = true;
  // }

  // requestMoreInformation() {
  //   this.dialogRefApproval = this.dialog.open(RaApprovalModalComponent, {
  //     width: '45%',
  //     disableClose: false,
  //     closeOnNavigation: true
  //   });
  //   this.dialogRefApproval.componentInstance.isRequestMoreInfo = true;
  // }

  // ForwardRaManagers() {
  //   this.dialogRefApproval = this.dialog.open(RaApprovalModalComponent, {
  //     width: '45%',
  //     disableClose: false,
  //     closeOnNavigation: true
  //   });
  //   this.dialogRefApproval.componentInstance.isForwardToRaManagers = true;
  // }




  // getCountryThreatMatrix(countryIds) {
  //   const data = {
  //     country: countryIds,
  //     realTimeDataFromLiveApi: false // need to change to true
  //   };
  //   this.raService.getCountryThreatMatrix(data).subscribe(
  //     (response: any) => {
  //       if (response.code === 200) {
  //         this.countryDetails = response.countryObj.map(item => {
  //           if (item.country_id.specific_info == undefined) {
  //             item.country_id.specific_info = '';
  //           }
  //           item.threatMatrix.forEach(element => {
  //             if (element.country_risk === 'High') {
  //               this.label = 3;
  //               this.color = 'red';
  //             } else if (element.country_risk === 'Medium') {
  //               this.label = 2;
  //               this.color = 'yellow';
  //             } else if (element.country_risk === 'Low') {
  //               this.label = 1;
  //               this.color = 'green';
  //             } else {
  //               this.label = 0;
  //               this.color = 'white';
  //             }
  //             this.graphData.push({ name: element.category_name, value: this.label });
  //             this.customColors.push({ name: element.category_name, value: this.color })
  //           });
  //           item.graphData = this.graphData;
  //           item.customColors = this.customColors;
  //           this.graphData = [];
  //           this.customColors = [];

  //           if (item.threatMatrix.length >= 15) {
  //             this.view.push(480, 290);
  //           } else if (item.threatMatrix.length >= 10 && item.threatMatrix.length < 15) {
  //             this.view.push(480, 230);
  //           } else if (item.threatMatrix.length >= 5 && item.threatMatrix.length < 10) {
  //             this.view.push(480, 150);
  //           } else {
  //             this.view.push(480, 70);
  //           }
  //           item.view = this.view;
  //           this.view = [];

  //           return item;
  //         });
  //       }
  //       if (this.countryDetails.length == response.countryObj.length) {
  //         // this.convertSVGToImage();

  //         setTimeout(() => {
  //           this.convertSVGToImage();
  //           this.loading = false;
  //         }, 8000);
  //       } else {
  //         this.loading = false;
  //       }

  //     });
  // }
  // convertSVGToImage() {
  //   console.log("called :")
  //   const svg = Array.from(document.querySelectorAll(".graphs svg"));
  //   console.log("svg ", svg);
  //   // document.querySelector('svg');
  //   svg.forEach(item => {
  //     const xml = new XMLSerializer().serializeToString(item);
  //     const svg64 = btoa(unescape(encodeURIComponent(xml))); // for utf8: btoa(unescape(encodeURIComponent(xml)))
  //     const b64start = 'data:image/svg+xml;base64,';
  //     const image64 = b64start + svg64;
  //     this.graphs.push(image64);
  //   });
  //   this.authService.setSessionStorage('countryGraphs', this.graphs);
  // }

  // showImage:any = [];
  // generateGraph() {
  //   this.loading = true;
  //   const data = {
  //     country: this.temporaryVar,
  //     realTimeDataFromLiveApi: false // need to change to true
  //   };
  //   this.riskAssessmentService.generateGraph(data).subscribe(
  //     (response:any) =>{
  //       this.loading = false;
  //       //  this.showImage = 'data:image/png;base64,'+ response.data;
  //       this.showImage = response.data;
  //       console.log("response");
  //     }
  //   )
  // }

}
