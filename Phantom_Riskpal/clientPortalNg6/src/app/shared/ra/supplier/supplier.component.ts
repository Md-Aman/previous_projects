import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { MatDialog } from "@angular/material";
import { SupplierCreateListModalComponent } from './../supplier-create-list-modal/supplier-create-list-modal.component';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RaService } from './../../ra/service/ra.service';
import { SupplierService } from './../../../modules/supplier/service/supplier.service';
import { AuthService } from './../../../core/guards/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  public loading = false;
  subscriptionUpdateSupplier: Subscription;
  rows = [];
  columns: any = [
    { prop: 'SERVICE PROVIDED', name: 'serviceProvided', width: 180 },
    { prop: 'SUPPLIER NAME', name: 'supplierName', width: 180 },
    { prop: 'EMAIL', name: 'email', width: 197 },
    // { prop: 'MOBILE NO.', name: 'number', width: 170 },
    // { prop: 'RATING', name: 'rate', width: 140 }
  ];
  messages = {
    emptyMessage: "No suppliers selected"
  }
 
  page: any = { count: 0, offset: 0, pageSize: 10 };
  isAssign: boolean;
  supplierTableBody: boolean = true;
  supplierRaData: any = [];
  templateId: string;
  raId: string;

  constructor(
    public supplierService: SupplierService,
    public authService: AuthService,
    private responseService: ResponseService,
    public dialog: MatDialog,
    private raService: RaService,
    private toastarService: ToastarService,
    private activatedRoute: ActivatedRoute,
    private riskAssessmentService: RiskAssessmentService,
    private raTemplateService: RaTemplateService,
    public router: Router) {
    this.subscriptionUpdateSupplier = this.raService.trackChanges.subscribe(updateTemplateRisk => {
      if (updateTemplateRisk != null) {
        if (updateTemplateRisk.type === 'updateSupplier') {
          console.log("updateTemplateRisk :", updateTemplateRisk);
          console.log("supplierId :", updateTemplateRisk.supplierId);
          if (updateTemplateRisk.supplierId != undefined) {
            this.data['_id'] = updateTemplateRisk.supplierId;
            this.data['assign'] = true;
            this.processFunction(this.data);
          } else {
            this.ngOnInit();
          }
        }
      }
    })
  }
  data: any = {};
  dataObj = {
    // client_id: this.authService.getUser().client_id,
    count: 10,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc,
  }


  ngOnInit() {
    this.loading = true;
    this.templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    this.raId = this.activatedRoute.snapshot.paramMap.get("raId");
    if (this.raId) {
      this.getSupplierDetailsOfRa(this.raId, this.templateId);
    } else if (this.templateId) {
      this.getAllSupplier(this.dataObj);
      this.messages.emptyMessage = "No suppliers included in this template";
    } else {
      this.router.navigate(['/secure/ra-template/create/template-details']);
    }
    this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('supplier'));
  }



  getAllSupplier(data) {
    this.supplierService.getAllSupplier(data).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.page.count = response.count;
          this.rows = response.data.map(item => {
            item.supplierName = item.supplier_name;
            item.serviceProvided = item.service_provided;
            if(item.website == ''){
              item.website = 'N/A';
            }
            if(item.address == ''){
              item.address = 'N/A';
            }
            if(item.currency == ''){
              item.currency = 'N/A';
            }
            if(item.sourced_by == ''){
              item.sourced_by = 'N/A';
            }
            if(item.department == null || item.department == ''){
              item.department = 'N/A';
            }
            item.updatedAt = item.updatedAt.split("T", 10)[0];
            if (!item.rate) {
              item.rate = 0;
            }
            for (let raId of item.types_of_ra_id) {
              if (raId._id === this.templateId) {
                item.assign = true;
                return item;
              }
            }
          })
          this.rows = this.rows.filter(element => element != undefined);
          this.page.count = this.rows.length;
        }
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      },
      error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    );

  }



  assignSupplier(dataObj) {
    this.raService.assignSupplierToRa(dataObj).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.ngOnInit();
          // this.responseService.hanleSuccessResponse(response);
        }
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }


  // getSupplierRaData(templateId) {
  //   const data = {
  //     ra_id: templateId
  //   }
  //   this.raService.getSupplierRaData(data).subscribe(
  //     (response: any) => {
  //       if (response.code === 200) {
  //         this.rows = response.data.map(item => {
  //           item.supplierName = item.supplier_name;
  //           item.serviceProvided = item.service_provided;
  //           if (!item.rate) {
  //             item.rate = 0;
  //           }
  //           for (let raId of item.types_of_ra_id) {
  //             if (raId._id === this.templateId) {
  //               item.assign = true;
  //               return item;
  //             }
  //           }
  //         });
  //         this.rows = this.rows.filter(element => element != undefined);
  //         this.page.count = this.rows.length;

  //         this.supplierRaData = response.data;
  //         this.getSupplierDetailsOfRa(this.raId, templateId);
  //       } 
  //       // else {
  //       //   this.toastarService.showNotification(this.toastarService.errorText, 'error');
  //       // }
  //       error => {
  //         // this.toastarService.showNotification(this.toastarService.errorText, 'error');
  //       }
  //     }
  //   )

  // }
  getSupplierDetailsOfRa(raId, templateId) {
    this.raService.getSupplierDetailsOfRaOther(raId, templateId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          if (response.data != null && Array.isArray(response.data)) {
            this.page.count = response.data.length;
            this.rows = response.data.map(item => {
              item.supplierName = item.supplier_name;
              item.serviceProvided = item.service_provided;
              if(item.website == ''){
                item.website = 'N/A';
              }
              if(item.address == ''){
                item.address = 'N/A';
              }
              if(item.currency == ''){
                item.currency = 'N/A';
              }
              if(item.sourced_by == ''){
                item.sourced_by = 'N/A';
              }
              if(item.department == null || item.department == ''){
                item.department = 'N/A';
              }
              item.updatedAt = item.updatedAt.split("T", 10)[0];
              item.assign = true;
              if (!item.rate) {
                item.rate = 0;
              }
              return item;
            });
            console.log("radata :", this.rows);
          }
        }
      }, error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }


  eventValue(event) {
    if (event.type === "delete") {
      this.isAssign = false;
    } else {
      this.isAssign = true;
    }
    return this.isAssign;
  }

  receiveDataFromChild(event) {
    if (event.type === 'setPage') {
      this.dataObj['page'] = event.id.offset + 1;
      this.getAllSupplier(this.dataObj);
    } else {
      this.loading = true;
      this.data['_id'] = event.id;
      this.data['assign'] = this.eventValue(event);
      this.processFunction(this.data);
    }
  }

  processFunction(data) {
    if (this.raId) {
      data['assignRaId'] = this.raId;
      this.assignSupplierToRiskAssessment(this.data);
    } else {
      data['assignRaId'] = this.templateId;
      this.assignSupplier(this.data);
    }
  }


  addNewsRaSupplier(dataObjectRa) {
    this.raService.addNewsRaSupplier(dataObjectRa).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.ngOnInit();
          // this.responseService.hanleSuccessResponse(response);
        }
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }

  assignSupplierToRiskAssessment(dataObj) {
    this.raService.assignSupplierToRiskAssessment(dataObj).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.ngOnInit();
          // this.responseService.hanleSuccessResponse(response);
        }
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }

  supplier(step, value) {
    if (this.raId) {
      this.riskAssessmentService.supplierInformation(step, value);
    } else {
      if (step == 'next') {
        this.checkRaTemplateStep(this.raTemplateService.getRaPages());
      } else {
        this.raTemplateService.supplierInformation(step, value);
      }
    }
  }

  checkRaTemplateStep(data) {
    if (data.communicationRequired != true && data.contingenciesRequired != true) {
      this.createRaTemplate(this.templateId);
    } else {
      this.raTemplateService.supplierInformation("next");
    }
  }

  createRaTemplate(raId) {
    this.raTemplateService.createRaTemplate(raId);
  }


  openModal() {
    if (this.raId) {
      this.raService.shareData = {
        templateId: this.templateId,
        raId: this.raId,
        type: 'ra'
      }
    } else {
      this.raService.shareData = {
        templateId: this.templateId,
        type: 'raTemplate'
      }
    }
    this.dialog.open(SupplierCreateListModalComponent, {
      height: '100vw',
      width: '70%',
      disableClose: false,
      closeOnNavigation: true,
      position: {
        top: '0',
        right: '0',
        bottom: '0'
      }
    });
  }

  ngOnDestroy() {
    this.subscriptionUpdateSupplier.unsubscribe();
  }

}
