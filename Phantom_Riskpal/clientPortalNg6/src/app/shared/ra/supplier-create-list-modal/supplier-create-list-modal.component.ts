import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { SupplierService } from './../../../modules/supplier/service/supplier.service';
import { AuthService } from './../../../core/guards/auth.service';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { RaService } from './../../ra/service/ra.service';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';

@Component({
  selector: 'app-supplier-create-list-modal',
  templateUrl: './supplier-create-list-modal.component.html',
  styleUrls: ['./supplier-create-list-modal.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class SupplierCreateListModalComponent implements OnInit {
  public loading = false;
  isUpdateBreadCrum: boolean = false;
  rows = [];
  columns: any = [
    { prop: 'SERVICE PROVIDED', name: 'serviceProvided', width: 150 },
    { prop: 'SUPPLIER NAME', name: 'supplierName', width: 150 },
    { prop: 'EMAIL', name: 'email', width: 150 },
    // { prop: 'MOBILE NO.', name: 'number', width: 150 },
    // { prop: 'RATING', name: 'rate', width: 120 }
  ];
  isDataLoaded: boolean = false;
  page: any = { count: 0, offset: 0, pageSize: 10 };
  raTemplateStepSupplier: boolean = true;
  isAssign: boolean;
  supplier: any = {
    templateId: '',
    raId: '',
    type: ''
  };
  supplierRaData: any = [];
  allSupplier: any = [];
  selectedTab: string = 'featuredSuppliers';
  

  constructor(
    public supplierService: SupplierService,
    public authService: AuthService,
    public toastarService: ToastarService,
    private responseService: ResponseService,
    public dialogRef: MatDialogRef<SupplierCreateListModalComponent>,
    public raService: RaService,
    private raTemplateService: RaTemplateService) { }

  dataObj = {
    // client_id: this.authService.getUser().client_id,
    count: 10,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc
  }


  ngOnInit() {
    this.loading = true;
    this.supplier = this.raService.shareData;
    this.getAllSupplier(this.dataObj);
  }
  getAllSupplier(data) {
    this.supplierService.getAllSupplier(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.page.count = response.data.length;
          this.allSupplier = response.data;
          this.page.count = response.count;
          if (this.supplier.type === 'raTemplate') {
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
              for (let raId of item.types_of_ra_id) {
                if (raId._id === this.supplier.templateId) {
                  item.assign = true;
                }
              }
              if (!item.rate) {
                item.rate = 0;
              }
              return item;
            });
            this.loading = false;
          } else {
            setTimeout(() => {}, 1000)
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
              for(let i = 0; i <item.news_ra_id.length; i++){
                if (item.news_ra_id[i] === this.supplier.raId) {
                  item.assign = true;
                }
              }
              if (!item.rate) {
                item.rate = 0;
              }
              return item;
            });
          }

        } 
        this.loading = false;
        // else {
        //   this.toastarService.showNotification(response.err, 'warning');
        // }
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    );
  }

  changeTab(tabName){
    this.selectedTab = tabName;
  }
  // getSupplierRaData() {
  //   const data = {
  //     ra_id: this.supplier.templateId
  //   }
  //   this.raService.getSupplierRaData(data).subscribe(
  //     (response: any) => {
  //       if (response.code === 200) {
  //         this.supplierRaData = response.data;
  //         this.getSupplierDetailsOfRa(this.supplier.raId, this.supplier.templateId);
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
  // getSupplierDetailsOfRa(raId, templateId) {
  //   this.raService.getSupplierDetailsOfRaOther(raId, templateId).subscribe(
  //     (response: any) => {
  //       this.loading = false;
  //       if (response.code === 200) {
  //         if (response.data.length > 0) {
  //           // this.supplierRaData = this.supplierRaData.concat(response.data);
  //         }
  //         if (this.supplierRaData.length > 0) {
  //           this.rows = this.allSupplier.map(item => {
  //             item.supplierName = item.supplier_name;
  //             item.serviceProvided = item.service_provided;
  //             for (let raId of this.supplierRaData) {
  //               if (item._id === raId._id) {
  //                 item.assign = true;
  //               }
  //             }
  //             if (!item.rate) {
  //               item.rate = 0;
  //             }
  //             return item;
  //           })
  //         }
  //       } else {
  //         this.loading = false;
  //         // this.toastarService.showNotification(this.toastarService.errorText, 'error');
  //       }
  //     }, error => {
  //       this.loading = false;
  //       // this.toastarService.showNotification(this.toastarService.errorText, 'error');
  //     }
  //   )
  // }

  closeModal() {
    this.dialogRef.close();
  }
  
  eventValue(event){
    if (event.type === "assign") {
      this.isAssign = true;
    } else if (event.type === "unassign") {
      this.isAssign = false;
    } else {
      this.isAssign = undefined;
    }
    return this.isAssign;
  }

  data: any = {};
  receiveDataFromChild(event) {
    console.log("event :", event);
    if ( event.type === 'setPage' ) {
      this.loading = true;
      this.dataObj['page'] = event.id.offset + 1;
      this.getAllSupplier(this.dataObj);
    } else {
    // const dataObj = {
    //   _id: event.id, // supplier Id
    //   assign: this.eventValue(event),
    //   assignRaId: this.supplier.templateId
    // }
    this.data['_id'] = event.id;
    this.data['assign'] = this.eventValue(event);
    if (this.supplier.type === 'raTemplate') {
      this.data['assignRaId'] = this.supplier.templateId;
      this.assignSupplier(this.data);
    } else {
      this.data['assignRaId'] = this.supplier.raId;
      this.assignSupplierToRiskAssessment(this.data);
    }
  }
  }



  // addNewsRaSupplier(dataObjectRa) {
  //   this.raService.addNewsRaSupplier(dataObjectRa).subscribe(
  //     (response:any)=>{
  //       if (response.code === 200) {
  //         const data = {
  //           type: 'updateSupplier'
  //         }
  //         this.raService.setSubject(data);
  //         this.ngOnInit();
  //         // this.responseService.hanleSuccessResponse(response);
  //       } 
  //       // else {
  //       //   this.responseService.handleErrorResponse(response);
  //       // }
  //       error => {
  //         // this.responseService.handleErrorResponse(error.error);
  //       }
  //     }
  //   )
  // }
  assignSupplierToRiskAssessment(data){
    this.loading = true;
    this.raService.assignSupplierToRiskAssessment(data).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          const data = {
            type: 'updateSupplier'
          }
          this.raService.setSubject(data);
          this.ngOnInit();
          // this.responseService.hanleSuccessResponse(response);
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
  assignSupplier(dataObj) {
    this.loading = true;
    this.raService.assignSupplierToRa(dataObj).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          const data = {
            type: 'updateSupplier'
          }
          this.raService.setSubject(data);
          this.ngOnInit();
          // this.responseService.hanleSuccessResponse(response);
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

}
