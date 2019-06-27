import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Form } from '@angular/forms';
import { ConstantType } from './../../../core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material";
import { TemplateListComponent } from './../../ra/template-list/template-list.component';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { RaService } from './../../../shared/ra/service/ra.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { DATEPICKER_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/datepicker/datepicker.component';
import { ErrorMessage } from "ng-bootstrap-form-validation";



@Component({
  selector: 'app-ra-details',
  templateUrl: './ra-details.component.html',
  styleUrls: ['./ra-details.component.scss']
})
export class RaDetailsComponent implements OnInit {

  raDetailsForm: FormGroup;

  public loading: boolean = false;
  maxCountry: boolean = false;
  // travelerIncharge: boolean = true;
  countries = [];
  otherTravelers = [];
  departments = [];
  approvingManagerArray = [];
  templateId: string;
  formateTravelerIncharge: string = '';
  setOtherTraveller = [];
  raId: string;
  isUpdateRa: boolean = false;
  authorCheck: boolean;
  breadCrum = [
    { name: 'Risk Assessments', url: '/secure/ra/list' }
  ];
  isApprovingManager: boolean = false;

  primaryTravelers: any = [];
  otherTravelerWithFilter: any = [];



  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private riskAssessmentService: RiskAssessmentService,
    private raService: RaService,
    private responseService: ResponseService,
    private raTemplateService: RaTemplateService
  ) {
    // this.subscription = this.raService.currentChanges.subscribe(request=>{
    //   console.log("request :", request);
    // });
  }

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

  ngOnInit() {
    const templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    this.raId = this.activatedRoute.snapshot.paramMap.get("raId");
    const countryId = this.activatedRoute.snapshot.paramMap.get("countryIds");
    this.activatedRoute.queryParams.subscribe(params => {
      const status = params.status;
      if (status === 'pending') {
        this.isUpdateRa = true;
        this.breadCrum[0].name = 'Pending Risk Assessments';
        this.breadCrum[0].url = '/secure/ra/pending';
        this.breadCrum.push({ name: 'Update', url: '/secure/ra/create/ra-details/' + this.templateId + '/' + this.raId ? status : 'pending' });
        this.responseService.createBreadCrum(this.breadCrum);
      } else {
        this.createBreadCrum();
      }
    });
    if (templateId) {
      this.loading = true;
      this.templateId = templateId;
      this.getTemplateData(templateId);
    } else {
      this.openDialog();
    }
    this.buildRaDetailsForm();
    this.formControlValueChanged();
    this.approvingManager();
  }

  approvingManager() {
    if (this.riskAssessmentService.getApprovingManagerToApprove()) {
      this.isApprovingManager = true;
    } else {
      this.isApprovingManager = false;
    }
  }

  createBreadCrum() {
    if (this.raId) {
      this.isUpdateRa = true;
      this.breadCrum.push({ name: 'Update', url: '/secure/ra/create/ra-details/' + this.templateId + '/' + this.raId });
      this.responseService.createBreadCrum(this.breadCrum);
    } else {
      this.breadCrum.push({ name: 'Create', url: '/secure/ra/create/ra-details' });
      this.responseService.createBreadCrum(this.breadCrum);
    }
  }

  getTemplateData(templateId) {
    this.getRaDetails(this.templateId);
  }

  openDialog() {
    setTimeout(() => this.dialog.open(TemplateListComponent, {
      height: '100vw',
      width: '70%',
      disableClose: true,
      closeOnNavigation: true,
      position: {
        top: '0',
        right: '0',
        bottom: '0'
      }
    }));
  }

  getRaDetails(templateId) {
    this.riskAssessmentService.getRaDetails(templateId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.getCountries();
          this.getDeptRelatedUsersAprovingmanger(this.templateId);
          this.riskAssessmentService.setTemplate(response.data);
          const data = {
            'countryrequired': response.data.countryrequired,
            'questionRequired': response.data.questionRequired,
            'supplierRequired': response.data.supplierRequired,
            'communicationRequired': response.data.communicationRequired,
            'contingenciesRequired': response.data.contingenciesRequired,
            'selectedTab': 'raDetails',
            'templateName': response.data.ra_name,
            'isApprovingManager': this.isApprovingManager
          }
          this.raTemplateService.detectTabChanges('raPagesOninIt', data);
        } else {
          this.loading = false;
          this.openDialog();
          // this.responseService.hanleSuccessResponse(response);
        }

      }, error => {
        this.loading = false;
        this.openDialog();
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }
 
  raDetails: any;
  getNewRaDetails(raId) {
    this.riskAssessmentService.getNewRaDetails(raId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          if (response.data != null) {
            if(response.data.authorcheck === '1'){
              this.getDeptRelatedUsers(response.data.author_id);
            } else{
              this.getDeptRelatedUsers(response.data.traveller_id);
            }
            
            this.riskAssessmentService.setRiskAssessment(response.data);
            this.raDetails = response.data;
          }
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
  setRaDetailsForm(data) {
    const setDepartment = this.departments.filter(item => data.department.includes(item._id));
    if (data.travellerTeamArr != null) {
      this.setOtherTraveller = this.otherTravelers.filter(item => data.travellerTeamArr.includes(item._id));
    }
    const setApprovingManager = this.approvingManagerArray.find(item => item._id === data.approvingManager[0]);
    const setCountry = this.countries.filter(item => data.country.includes(item._id));
    this.addCountry(this.addKeyToCountry(setCountry), false);

    if (data.authorcheck === '1') {
      const incharge = this.otherTravelers.find(item => item._id === data.traveller_id);
      this.raDetailsForm.patchValue({
        travelingCheckbox: false,
        primaryTraveler: incharge
      });
    } else {
      this.raDetailsForm.patchValue({
        travelingCheckbox: true
      });
    }
    this.raDetailsForm.patchValue({
      approvingManager: setApprovingManager,
      dateFrom: new Date(data.startdate),
      dateTo: new Date(data.enddate),
      department: setDepartment,
      taskDescription: data.description_of_task,
      otherTraveler: this.setOtherTraveller,
      itineraryDescription: data.itineary_description,
      projectName: data.project_name
    });

    // here will be the code
    this.filterTravelerIncharge(data.traveller_id);
    if(data.travellerTeamArr){
      const teamArr = [];
      for(let i = 0 ; i < data.travellerTeamArr.length; i++){
        teamArr.push({_id : data.travellerTeamArr[i]});
      }
      this.filterOtherTraveler(teamArr);
    }

  }

  addKeyToCountry(countries) {
    const countryWithKey = [];
    countries.forEach(element => {
      countryWithKey.push({ country: element })
    });
    return countryWithKey;
  }

  getCountries() {
    this.raService.getCountryListForRa().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.countries = response.data;
        }
      }
    );
  }
  customSearchFn(term: string, item) {
    return item.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === 0;
  }

  getDeptRelatedUsers(traveller_id) {
    this.loading = true;
    const data = {
        traveller_id: traveller_id
    }
    this.riskAssessmentService.getDeptRelatedUsers(data).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.otherTravelers = this.primaryTravelers = this.otherTravelerWithFilter = response.data.map(element => {
            element.name = element.firstname + ' ' + element.lastname;
            return element;
          });
          if(this.raId){
            this.setRaDetailsForm(this.raDetails);
          }
        }
      }, error =>{
        this.loading = false;;
      }
    );
  }

  getDeptRelatedUsersAprovingmanger(templateId) {
    this.riskAssessmentService.getDeptRelatedUsersAprovingmanger(templateId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          if (this.raId) {
            this.getNewRaDetails(this.raId);
          } else {
            this.loading = false;
            const id = '';
            this.getDeptRelatedUsers(id);
            this.addCountry();
          }
          this.departments = response.traveller.client_department;
          const data = [];
          response.traveller.client_department.forEach(element1 => {
            response.data.forEach(element2 => {
              if (element1.final_approving_manager === element2._id
                || element1.alternative_final_approving_manager.indexOf(element2._id) > -1) {
                element2.name = element2.firstname + ' ' + element2.lastname;
                data.push(element2);
              }
            });
          });
          this.approvingManagerArray = data.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          });
        } else {
          this.loading = false;
        }
      }, error => {
        this.loading = false;
      }
    )
  }

  buildRaDetailsForm() {
    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const emailPattern = ConstantType.emailPattern;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    this.raDetailsForm = this.formBuilder.group({
      projectName: [null, [
        Validators.required,
        Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength),
        Validators.maxLength(maxLength)
      ]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      department: [null, [Validators.required]],
      travelingCheckbox: [true, []],
      primaryTraveler: [null, []],
      countr: [],
      country: this.formBuilder.array([]),
      otherTraveler: [null, []],
      approvingManager: [null, [Validators.required]],
      taskDescription: [null, [Validators.required]],
      itineraryDescription: [null, [Validators.required, Validators.maxLength(2000)]]
    });
  }

  formControlValueChanged() {
    const primaryTraveler = this.raDetailsForm.get('primaryTraveler');
    this.raDetailsForm.get('travelingCheckbox').valueChanges.subscribe(
      (isChecked: boolean) => {
        if (isChecked === false) {
          primaryTraveler.setValidators([Validators.required]);
        } else {
          primaryTraveler.setValidators([]);
        }
      });
  }

  addCountry(country: any = [], addMoreBtn = true) {
    const control = <FormArray>this.raDetailsForm.controls.country;
    if (Array.isArray(country) && !addMoreBtn) {
      country.map(item => {
        this.nestedCountry(control, item);
      });
    } else {
      if (control.length < 5) {
        this.nestedCountry(control);
      } else {
        this.maxCountry = true;
      }
    }
  }

  nestedCountry(control, data: any = {}) {
    const country = data.country ? data.country : '';
    control.push(
      this.formBuilder.group({
        country: [country, [Validators.required]]
      }));
  }

  deleteCountry(index) {
    const control = <FormArray>this.raDetailsForm.controls.country;
    control.removeAt(index);
    this.maxCountry = this.checkMaxLength(control.length);
  }

  checkMaxLength(length) {
    if (length < 5) {
      return false;
    } else {
      return true;
    }
  }


  filterTravelerIncharge(id) {
    if (id) {
      const data = this.otherTravelers
      this.otherTravelerWithFilter = data.filter(item => item._id !== id);
    }
  }
  
  filterOtherTraveler(id) {
    if (id.length > 0) {
      const data = this.otherTravelers;
      this.primaryTravelers = data.filter(elem1 => !id.find(elem2 => elem1._id === elem2._id));
    }
  }

  selectAllDepartment() {
    this.raDetailsForm.patchValue({
      department: this.departments.map(x => x)
    });
  }

  unSelectAllDepartment() {
    this.raDetailsForm.patchValue({
      department: []
    });
  }

  submitForm(inputValue) {
    const formateCountry = [];
    if (this.raDetailsForm.valid) {
      if (inputValue.travelingCheckbox == true) {
        this.formateTravelerIncharge = '';
        this.authorCheck = true;
      } else {
        this.authorCheck = false;
        this.formateTravelerIncharge = inputValue.primaryTraveler._id;
      }
      const raData = {
        approvingManager: inputValue.approvingManager._id,
        country: this.formateCountry(inputValue.country, formateCountry),
        date_of_ra: inputValue.dateFrom,
        department: inputValue.department,
        description_of_task: inputValue.taskDescription,
        enddate: inputValue.dateTo,
        travellerTeamArr: inputValue.otherTraveler,
        itineary_description: inputValue.itineraryDescription,
        primarytraveller: this.formateTravelerIncharge,
        project_code: this.getProjectCode(inputValue.country),
        project_name: inputValue.projectName,
        startdate: inputValue.dateFrom,
        types_of_ra_id: this.templateId,
        authorcheck: this.authorCheck
      }
      console.log("data :", raData)
      if (this.raId) {
        raData['_id'] = this.raId;
        this.updateRaData(raData);
      } else {
        this.addRaData(raData);
      }
    }
  }

  getProjectCode(country) {
    const countriesArray = []
    country.forEach(element => {
      countriesArray.push(element.country.code);
    });
    const countryCodes = countriesArray.toString();
    const countryCodesWithUnderscore = countryCodes.replace(',', '_');
    const projectCode = countryCodesWithUnderscore + '_' + new Date();
    return projectCode;
  }


  formateCountry(countries, formatArray) {
    formatArray = [];
    for (let country of countries) {
      formatArray.push({ _id: country.country._id });
    }
    return formatArray;
  }

  addRaData(raData) {
    this.loading = true;
    this.riskAssessmentService.addRa(raData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.riskAssessmentService.setRiskAssessment(response.data);
          // this.responseService.hanleSuccessResponse(response);
          this.riskAssessmentService.raDetails('next');
        } else {
          this.loading = false;
          // this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  updateRaData(raData) {
    this.loading = true;
    this.riskAssessmentService.updateNewsRa(raData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.riskAssessmentService.setRiskAssessment(response.data);
          // this.responseService.hanleSuccessResponse(response);
          this.riskAssessmentService.raDetails('next');
        } else {
          this.loading = false;
          // this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

}

