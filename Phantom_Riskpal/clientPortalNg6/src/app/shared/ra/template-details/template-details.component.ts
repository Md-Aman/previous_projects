import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaService } from './../service/ra.service';
import { AuthService } from './../../../core/guards/auth.service';
import { ToastarService } from './../../services/toastr/toastar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';


@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss']
})
export class TemplateDetailsComponent implements OnInit {
  templateDetailsForm: FormGroup;
  public loading = false;


  countryrequired: boolean = false;
  questionRequired: boolean = false;
  supplierRequired: boolean = false;
  communicationRequired: boolean = false;
  contingenciesRequired: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private responseService:ResponseService,
    public raService: RaService,
    public toastarService: ToastarService,
    private raTemplateService: RaTemplateService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  storageData: any;
  countryList = [];
  deptList = [];
  formateDept = [];
  formateCountry = [];
  formateUpdateCountry = [];
  templateId: string;
  breadCrum = [
    { name: 'Risk Assessment Templates', url: '/secure/ra-template/list' },
    { name: 'Create', url: '/secure/ra-template/create/template-details' }
  ];


  ngOnInit() {
    this.templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    if (this.raTemplateService.getRa() != null) {
      this.raPages = this.raTemplateService.getRaPages();
      this.countryrequired = this.raTemplateService.getRaPages().countryrequired;
      this.questionRequired = this.raTemplateService.getRaPages().questionRequired;
      this.supplierRequired = this.raTemplateService.getRaPages().supplierRequired;
      this.communicationRequired = this.raTemplateService.getRaPages().communicationRequired;
      this.contingenciesRequired = this.raTemplateService.getRaPages().contingenciesRequired;
      this.createBredCrum(this.raTemplateService.getRa()._id)
      this.getCreatedRaDetails(this.raTemplateService.getRa()._id);
    } else if (this.templateId) {
      this.createBredCrum(this.templateId)
      this.getCreatedRaDetails(this.templateId);
    } else {
      this.responseService.createBreadCrum(this.breadCrum);
      this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('templateDetails'));
    }

    this.raService.getCountryListForRa().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.countryList = response.data;
        }
      },
      error => {
        console.log(" error ", error);
      })

    this.raService.getDepartmentList(this.authService.getPermission()._id).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.deptList = response.data;
        }
      },
      error => {
        console.log(" error ", error);
      })


    this.templateDetailsForm = this.formBuilder.group({
      Department: [[], [Validators.required]],
      Country: [[], [Validators.required]],
      CountryProfile:[],
      Risk:[],
      Supplier:[],
      Communication:[],
      Contingency:[]
    });
  }

  createBredCrum(tempId){
    this.breadCrum[1].name = 'Update';
    this.breadCrum[1].url = '/secure/ra-template/create/template-details/'+tempId;
    this.responseService.createBreadCrum(this.breadCrum);
  }

  submitTemplateFrom() {
    if (this.templateDetailsForm.valid) {
      const templateData = {
        // client_id: this.authService.getUser().client_id,
        ra_name: this.raTemplateService.templateName,
        country: ConstantType.getItemIds(this.templateDetailsForm.controls.Country.value, this.formateCountry),
        clientDepartment: ConstantType.formateData(this.templateDetailsForm.controls.Department.value, this.formateDept),
        countryrequired: this.raPages.countryrequired,
        questionRequired: this.raPages.questionRequired,
        supplierRequired: this.raPages.supplierRequired,
        communicationRequired: this.raPages.communicationRequired,
        contingenciesRequired: this.raPages.contingenciesRequired,
        // super_admin: 0
      }

      if (this.raTemplateService.getRa() != null) {
        templateData['_id'] = this.raTemplateService.getRa()._id
        this.updateRaData(templateData);
      } else {
        this.addRaData(templateData);
      }
    }
  }

  addRaData(templateData) {
    this.raService.createRa(templateData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.saveDataToSession(response.data);
          this.raTemplateService.setRaPages(this.raPages);
          // this.toastarService.showNotification(response.message, 'success');
          this.checkRaTemplateStep(response.data);
        }
        //  else {
        //   this.toastarService.showNotification(response.err, 'warning');
        // }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  customSearchFn(term: string, item) {
    return item.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === 0;
  }
  
  selectAllDepartment(){
    this.templateDetailsForm.patchValue({
      Department: this.deptList.map(x => x)
    });
  }

  unSelectAllDepartment(){
    this.templateDetailsForm.patchValue({
      Department: []
    });
  }

  selectAllCountry() {
    this.templateDetailsForm.patchValue({
      Country: this.countryList.map(x => x)
    });
  }

  unSelectAllCountry() {
    this.templateDetailsForm.patchValue({
      Country: []
    });
  }

  setCheckboxValue(value) {
    if (value === true) {
      return false;
    } else {
      return true;
    }
  }

  raPages = {
    'countryrequired': this.countryrequired,
    'questionRequired': this.questionRequired,
    'supplierRequired': this.supplierRequired,
    'communicationRequired': this.communicationRequired,
    'contingenciesRequired': this.contingenciesRequired
  }

  getSelectedItem(checkboxName, isChecked) {
    switch (checkboxName) {
      case 'countryrequired': {
        this.countryrequired = isChecked;
        this.raPages.countryrequired = isChecked;
        this.raTemplateService.detectTabChanges('raPages', this.raPages);
        break;
      }
      case 'questionRequired': {
        this.questionRequired = isChecked;
        this.raPages.questionRequired = isChecked;
        this.raTemplateService.detectTabChanges('raPages', this.raPages);
        break;
      }
      case 'supplierRequired': {
        this.supplierRequired = isChecked;
        this.raPages.supplierRequired = isChecked;
        this.raTemplateService.detectTabChanges('raPages', this.raPages);
        break;
      }
      case 'communicationRequired': {
        this.communicationRequired = isChecked;
        this.raPages.communicationRequired = isChecked;
        this.raTemplateService.detectTabChanges('raPages', this.raPages);
        break;
      }
      case 'contingenciesRequired': {
        this.contingenciesRequired = isChecked;
        this.raPages.contingenciesRequired = isChecked;
        this.raTemplateService.detectTabChanges('raPages', this.raPages);
        break;
      }
    }

  }

  getCreatedRaDetails(raId) {
    this.loading = true;
    this.raService.getRaDetailsCreatedByClient(raId).subscribe(
      (response: any) => {
        if (response.code === 200) {

          this.templateDetailsForm.patchValue({
            Department: response.raData.client_department,
            Country: response.raData.country,
            CountryProfile: response.raData.countryrequired,
            Risk: response.raData.questionRequired,
            Supplier: response.raData.supplierRequired,
            Communication: response.raData.communicationRequired,
            Contingency: response.raData.contingenciesRequired
          });
          response.raData.country = ConstantType.getItemIds(response.raData.country, this.formateCountry);
          this.saveDataToSession(response.raData);

          this.countryrequired = this.raPages.countryrequired = response.raData.countryrequired;
          this.questionRequired = this.raPages.questionRequired = response.raData.questionRequired;
          this.supplierRequired = this.raPages.supplierRequired = response.raData.supplierRequired;
          this.communicationRequired = this.raPages.communicationRequired = response.raData.communicationRequired;
          this.contingenciesRequired = this.raPages.contingenciesRequired = response.raData.contingenciesRequired;

          const data = {
            'countryrequired': response.raData.countryrequired,
            'questionRequired': response.raData.questionRequired,
            'supplierRequired': response.raData.supplierRequired,
            'communicationRequired': response.raData.communicationRequired,
            'contingenciesRequired': response.raData.contingenciesRequired,
            'selectedTab': 'templateDetails',
            'templateName': response.raData.ra_name
          }
          this.raTemplateService.templateName = response.raData.ra_name;
          this.raTemplateService.detectTabChanges('raPagesOninIt', data);
          this.raTemplateService.setRaPages(this.raPages);
          this.loading = false;
        }
      }
    )
  }

  updateRaData(templateData) {
    this.raService.updateIndividualRa(templateData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          const storageData = this.raTemplateService.getRa();
          const countryData = ConstantType.getItemIds(this.templateDetailsForm.controls.Country.value, this.formateUpdateCountry);
          storageData.country = countryData;
          this.saveDataToSession(storageData);
          this.raTemplateService.setRaPages(this.raPages);
          // this.toastarService.showNotification(response.message, 'success');

          this.checkRaTemplateStep(storageData);

        } 
        // else {
        //   this.toastarService.showNotification(response.err, 'warning');
        // }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  checkRaTemplateStep(data) {
    if (this.countryrequired != true &&
      this.questionRequired != true &&
      this.supplierRequired != true &&
      this.communicationRequired != true &&
      this.contingenciesRequired != true
    ) {
      this.createRaTemplate(data._id);
    } else {
      this.raTemplateService.templateDetails("next");
    }
  }

  saveDataToSession(data) {
    if (data.country.length > 5) {
      const countries = data.country.slice(0, 5);
      data.country = countries;
      data.countryProfile = false;
    } else {
      data.countryProfile = true;
    }
    this.raTemplateService.setRa(data);
  }

  createRaTemplate(raId) {
    this.raTemplateService.createRaTemplate(raId);
  }

}
