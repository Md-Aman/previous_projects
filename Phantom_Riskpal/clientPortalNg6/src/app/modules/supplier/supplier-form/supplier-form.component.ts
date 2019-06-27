import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../../core/guards/auth.service';
import { ConstantType } from './../../../core/services/constant.type';
import { SupplierService } from './../service/supplier.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { MatDialogRef } from "@angular/material";
import { RaService } from './../../../shared/ra/service/ra.service';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { ErrorMessage } from "ng-bootstrap-form-validation";

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {
  @Input() isUpdateBreadCrum:boolean = true;
  public loading = false;
  supplierForm: FormGroup;

  serviceProvidedList = [];
  priorityStatus = [];
  countryList = [];
  currencyList = [];
  file: File;
  rate: number = 0;
  isUpdate: boolean = false;
  supplierId: string;
  attachment: string = '';

  breadCrum = [
    { name: 'Suppliers', url: '/secure/supplier/list' },
    { name: 'Update', url: '' }
  ];

  data = {
    type: 'updateSupplier'
  };
  customErrorMessages: ErrorMessage[] = [
    {
      error: 'minlength',
      format: (label, error) => `Please select minimum 2 characters`
    }
  ];
  customErrorMessages2000: ErrorMessage[] = [
    {
      error: 'minlength',
      format: (label, error) => `Please select between 2-2000 characters`
    },
    {
      error: 'maxlength',
      format: (label, error) => `Please select between 2-2000 characters`
    }
  ];
  customErrorMessagesforMobileNo: ErrorMessage[] = [
    {
      error: 'pattern',
      format: (label, error) => `Country code is required`
    }
  ];
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private responseService: ResponseService,
    private supplierService: SupplierService,
    private toastarService: ToastarService,
    public dialogRef: MatDialogRef<SupplierFormComponent>,
    private raService: RaService,
    private cdref:ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.supplierService.supplierId != undefined) {
      this.getIndividualSupplier(this.supplierService.supplierId);
      this.isUpdate = true;
      this.loading = true;
      this.supplierId = this.supplierService.supplierId;
      this.supplierService.supplierId = undefined;
      if(this.isUpdateBreadCrum){
      this.responseService.createBreadCrum(this.breadCrum);
      }
    } else {
      this.isUpdate = false;
      this.supplierId = '';
      this.breadCrum[1].name = 'Create';
      if(this.isUpdateBreadCrum){
      this.responseService.createBreadCrum(this.breadCrum);
      }
    }

    this.getCountryList();
    this.getCurrencyList();
    this.serviceProvidedList = this.supplierService.serviceProvided;
    this.priorityStatus = this.supplierService.supplierPriorityStatus;

    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    const emailPattern = ConstantType.emailPattern;
    const urlPattern = ConstantType.urlPattern;

    this.supplierForm = this.formBuilder.group({
      serviceProvided: ['', [Validators.required]],
      supplierName: ['', [Validators.required, Validators.pattern(specialCharactorPattern),
      Validators.minLength(minLength), Validators.maxLength(maxLength)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(ConstantType.mobileNo)]],
      website: [''],
      address: ['', [ Validators.pattern(specialCharactorPattern),
      Validators.minLength(minLength), Validators.maxLength(2000)]],
      country: ['', [Validators.required]],
      cityAreaLocation: ['', [Validators.required, Validators.pattern(specialCharactorPattern),
      Validators.minLength(minLength), Validators.maxLength(maxLength)]],
      currency: [''],
      dialyRate: [''],
      description: ['', [Validators.required, Validators.minLength(minLength), Validators.maxLength(2000)]],
      sourcedBy: ['', [ Validators.pattern(specialCharactorPattern),
      Validators.minLength(minLength), Validators.maxLength(maxLength)]],
      priorityStatus: ['', [Validators.required]],
      otherServiceProvider:[null, []]
    });

    this.formControlValueChanged();

  }

  formControlValueChanged(){
    const otherServiceProvider = this.supplierForm.get('otherServiceProvider');
    this.supplierForm.get('serviceProvided').valueChanges.subscribe(
      (serviceProviderSelected: string) => {
        if (serviceProviderSelected === 'Other - please specify') {
          otherServiceProvider.setValidators([Validators.required,  Validators.minLength(2), Validators.maxLength(200)]);
        }
      });
  }

  customSearchFn(term: string, item) {
    return item.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === 0;
  }
  getCountryList() {
    this.supplierService.getCountryList().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.countryList = response.data;
        }
      },
      error => {
        console.log(" error ", error);
      });
  }

  getCurrencyList() {
    this.supplierService.getCurrencyList().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.currencyList = response.data;
        }
      },
      error => {
        console.log(" error ", error);
      })
  }

  getFile(event) {
    this.file = event.target.files[0];
  }

  serviceProvider(providerType){
    console.log("providder type :", providerType);
  }

  createNewSupplier(inputVlaue) {
    if (this.supplierForm.valid) {
      const supplierData = {
        address: inputVlaue.address,
        attachment: "",
        city: inputVlaue.cityAreaLocation,
        // client_id: this.authService.getUser().client_id,
        cost: inputVlaue.dialyRate,
        country: inputVlaue.country,
        currency: inputVlaue.currency,
        description: inputVlaue.description,
        email: inputVlaue.email,
        number: inputVlaue.mobileNumber,
        preparence: inputVlaue.priorityStatus,
        rating_with_star: this.rate,
        service_provided: inputVlaue.serviceProvided,
        other_service: inputVlaue.otherServiceProvider,
        sourced_by: inputVlaue.sourcedBy,
        supplier_name: inputVlaue.supplierName,
        website: inputVlaue.website
      };
      if ( this.isUpdate == true ) {
        supplierData['_id'] = this.supplierId;
      }
      const formData: FormData = new FormData();
      formData.append('info', JSON.stringify(supplierData));
      if (this.file) {
        formData.append('file', this.file, this.file.name);
      }
      if (this.isUpdate == true) {
        this.updateSupplier(formData);
      } else {
        this.addSupplier(formData);
      }
    }
  }

  addSupplier(supplierData) {
    this.loading = true;
    this.supplierService.addSupplier(supplierData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.dialogRef.close();
          this.data['supplierId'] = response.data._id;
          this.raService.setSubject(this.data);
          this.loading = false;
        } else {
          // this.responseService.handleErrorResponse(response);
          this.toastarService.showNotification(response.message, 'info');
          this.loading = false;

        }
      },  error => {
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  updateSupplier(supplierData) {
    this.loading = true;
    this.supplierService.updateSupplier(supplierData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          // this.responseService.hanleSuccessResponse(response);
          this.dialogRef.close();
          // this.raService.setSubject(this.data);
        } else {
          this.loading = false;
          this.toastarService.showNotification(response.message, 'info');
        }
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }

      }
    )
  }

  getIndividualSupplier(supplierId) {
    this.supplierService.getIndividualSupplier(supplierId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.rate = response.data.rating_with_star;
          this.attachment = response.data.attachment.split('/').slice(-1)[0];
          this.supplierForm.patchValue({
            serviceProvided: response.data.service_provided ? response.data.service_provided : '',
            supplierName: response.data.supplier_name,
            otherServiceProvider: response.data.other_service,
            email: response.data.email,
            mobileNumber: response.data.number,
            website: response.data.website,
            address: response.data.address,
            country: response.data.country,
            cityAreaLocation: response.data.city,
            currency: response.data.currency,
            dialyRate: response.data.cost,
            description: response.data.description,
            sourcedBy: response.data.sourced_by,
            priorityStatus: response.data.preparence,
          });
          this.loading = false;
        } else {
          this.loading = false;
          // this.responseService.handleErrorResponse(response);
        }
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }
}
