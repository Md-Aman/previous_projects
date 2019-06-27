import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { SupplierCreateUpdateModalComponent } from './../supplier-create-update-modal/supplier-create-update-modal.component';
import { AuthService } from './../../../core/guards/auth.service';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { ConstantType } from './../../../core/services/constant.type';
import { SupplierService } from './../service/supplier.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RaService } from './../../../shared/ra/service/ra.service';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public loading = false;
  subscription: Subscription;
  searchSupplierForm: FormGroup;

  rows = [];
  columns: any = [
    { prop: 'SUPPLIER NAME', name: 'supplierName', width: 200 },
    { prop: 'SERVICE TYPE', name: 'serviceProvided', width: 200 },
    { prop: 'COUNTRY', name: 'country', width: 150 },
    { prop: 'CITY', name: 'city', width: 150 },
    // { prop: 'RATING', name: 'ratingwithstar', width: 150 }
  ];
  messages = {
    emptyMessage: "No suppliers to display"
  }

  comments = [
    { id: 1, review: "review 1" },
    { id: 2, review: "review 2" },
    { id: 3, review: "review 3" },
  ]
  page: any = { count: 0, offset: 0, pageSize: 10 };
  supplierTable: boolean = true;
  clients:any = [];

  constructor(
    private formBuilder:FormBuilder,
    public dialog: MatDialog,
    public authService: AuthService,
    public toastarService: ToastarService,
    public supplierService: SupplierService,
    private responseService: ResponseService,
    private activatedRoute: ActivatedRoute,
    private raService: RaService) {
    this.subscription = this.raService.trackChanges.subscribe(updateSupplier => {
      if (updateSupplier != null) {
        if (updateSupplier.type === 'updateSupplier') {
          this.ngOnInit();
        }
      }
    })
  }

  dataObj = {
    // client_id: this.authService.getUser().client_id,
    count: 10,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc,
  };

  breadCrum = [
    { name: 'Suppliers', url: '/secure/supplier/list' },
  ];

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const isCreate = params.create;
      if(isCreate === 'true'){
        this.openSupplierForm();
      }
    })
  
    this.getAllSupplier(this.dataObj);
    this.responseService.createBreadCrum(this.breadCrum);
    this.searchSupplierForm = this.formBuilder.group({
      searchKey: [null, []]
    });
    
    if(this.authService.getPermission().super_admin === true){
      this.columns.unshift(
        { prop: 'Client/s', name: 'clients' }
      )
    }
  }


  getAllSupplier(data) {
    this.loading = true;
    this.supplierService.getAllSupplier(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.page.count = response.count;
          this.rows = response.data.map(item => {
            item.reviews = this.comments;
            item.supplierName = item.supplier_name;
            item.serviceProvided = item.service_provided;
            if ( typeof item.rating_with_star == 'undefined' || item.rating_with_star == null) {
              item.ratingwithstar = 0;
            } else {
              item.ratingwithstar = item.rating_with_star;
            }
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
            if (item.client_id != null && item.client_id != undefined && item.client_id.length > 0) {
              item.client_id.forEach(element => {
                this.clients.push(' ' + element.company_name);
              });
            } else {
              this.clients.push('N/A');
            }
            item.clients = this.clients;
            this.clients = [];
            return item;
          })
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  receiveDataFromChild(data) {
    if (data.type === 'edit') {
      this.supplierService.supplierId = data.id;
      this.openSupplierForm();
    } else if (data.type === 'delete') {
      this.deleteSupplier(data.id);
    } else if ( data.type === 'setPage' ) {
      const dataObj = {
        // client_id: this.authService.getUser().client_id,
        count: 10,
        page:  data.id.offset + 1,
        sortby: ConstantType.sortCreatedAtDesc,
      };
      this.getAllSupplier(dataObj);
    }
  }

  openSupplierForm() {
    this.dialog.open(SupplierCreateUpdateModalComponent, {
      height: '100vw',
      width: '70%',
      closeOnNavigation: true,
      disableClose: true,
      position: {
        top: '0',
        right: '0',
        bottom: '0'
      }
    });
  }

  deleteSupplier(supplierId) {
    this.supplierService.deleteSupplier(supplierId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.ngOnInit();
        } else {
          // this.responseService.handleErrorResponse(response);
        }
        error => {
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }

  searchSupplier(searchValue) {
    this.loading = true;
    this.dataObj['keyword'] = searchValue;
    this.getAllSupplier(this.dataObj);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
