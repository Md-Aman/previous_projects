import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '././../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from "@angular/material"; 


@Injectable({
  providedIn: 'root'
})
export class RaTemplateService {
  public loading= false;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>
  templateName: string = "Risk Assessment Template";

  private raSubject = new BehaviorSubject('');
  currentRaChanges = this.raSubject.asObservable();

  constructor(public http: HttpClient, private router: Router,
    private dialog: MatDialog,
    private responseService: ResponseService) { }


  changeRaTabs(data: any) {
    this.raSubject.next(data);
  }
  detectTabChanges(type, data) {
    const changes = {
      type: type,
      data: data
    };
    this.changeRaTabs(changes);
  }

  removeRATemplateSessionStorage() {
    sessionStorage.removeItem('raTemplate');
    sessionStorage.removeItem('raPages');
  }

  raChangedTab(currentTab) {
    let data: any = {
      selectedTab: currentTab
    }
    return data;
  }

  // local storage
  setRa(raTemplate) {
    sessionStorage.setItem('raTemplate', JSON.stringify(raTemplate));
  }
  getRa() {
    return JSON.parse(sessionStorage.getItem('raTemplate'));
  }
  setRaPages(pages) {
    sessionStorage.setItem('raPages', JSON.stringify(pages));
  }
  getRaPages() {
    return JSON.parse(sessionStorage.getItem('raPages'));
  }

  templateDetails(step = '') {
    if (step == "next") {
      return this.countryProfile("countryProfile", true);
    } else {  // another condition can be added here
      this.router.navigate(['/secure/ra-template/create/template-details']);
    }
  }

  countryProfile(step = '', navigate = true) {
    if (step == "next") {
      return this.riskMitigation("riskMitigation", true);
    } else if (step == "previous") {
      return this.templateDetails("templateDetails");
    } else {
      if (this.getRaPages().countryrequired == true) {
        this.router.navigate(['/secure/ra-template/create/country-profile/' + this.getRa().country],{ queryParams: { countryProfile: this.getRa().countryProfile}});
      } else {
        if (navigate == true) {
          return this.riskMitigation("riskMitigation", true);
        } else if (navigate == false) {
          return this.templateDetails("templateDetails");
        }
      }
    }
  }

  riskMitigation(step = '', navigate = true) {
    if (step == "next") {
      return this.supplierInformation("supplierInformation", true);
    } else if (step == "previous") {
      return this.countryProfile("countryProfile", false);
    } else {
      if (this.getRaPages().questionRequired == true) {
        this.router.navigate(['/secure/ra-template/create/risk-mitigation/'+ this.getRa()._id]);
      } else {
        if (navigate == true) {
          return this.supplierInformation("supplierInformation", true);
        } else if (navigate == false) {
          return this.countryProfile("countryProfile", false);
        }
      }
    }
  }

  supplierInformation(step = '', navigate = true) {
    if (step == "next") {
      return this.communication("communication", true);
    } else if (step == "previous") {
      return this.riskMitigation("riskMitigation", false);
    } else {
      if (this.getRaPages().supplierRequired == true) {
        this.router.navigate(['/secure/ra-template/create/supplier/'+this.getRa()._id]);
      } else {
        if (navigate == true) {
          return this.communication("communication", true);
        } else if (navigate == false) {
          return this.riskMitigation("riskMitigation", false);
        }
      }
    }
  }

  communication(step = '', navigate = true) {
    if (step == "next") {
      return this.contingency("contingency", true);
    } else if (step == "previous") {
      return this.supplierInformation("supplierInformation", false);
    } else {
      if (this.getRaPages().communicationRequired == true) {
         this.router.navigate(['/secure/ra-template/create/communication/'+this.getRa()._id]);
      } else {
        if (navigate == true) {
          return this.contingency("contingency", true);
        } else if (navigate == false) {
          return this.supplierInformation("supplierInformation", false);
        }
      }
    }
  }

  contingency(step = '', navigate = true) {
    if (step == "previous") {
      return this.communication("communication", false);
    } else if (this.getRaPages().contingenciesRequired == true) {
      this.router.navigate(['/secure/ra-template/create/contingency/'+this.getRa()._id]);
    }
  }


  
  createRaTemplate(raId){
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Confirm submission of Risk Assessment template';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitRaCreatedByClient(raId).subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.removeRATemplateSessionStorage();
              this.router.navigate(['/secure/ra-template/list']);
              this.responseService.hanleSuccessResponse(response);
            } else {
              this.responseService.handleErrorResponse(response);
            }
            error => {
              this.responseService.handleErrorResponse(error.error);
            }
          }
        )
      }
      this.dialogRef = null;
    });
  }

  getAllRiskAssessment(templateData) {
    return this.http
      .post(environment.baseUrl + 'admin/getAllRiskAssessment', templateData);
  }

  deleteRa(raId) {
    return this.http
      .get(environment.baseUrl + 'admin/deleteRa/' + raId);
  }

  getRaPreviewData(raId) {
    return this.http
      .get(environment.baseUrl + 'admin/getRaPreviewData/' + raId);
  }

  submitRaCreatedByClient(raId) {
    return this.http
      .get(environment.baseUrl + 'admin/submitRaCreatedByClient/' + raId);
  }



}
