import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IndexService } from '../service/index.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { CHECKBOX_VALUE_ACCESSOR } from '@angular/forms/src/directives/checkbox_value_accessor';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  // formGroup: FormGroup;
  loading: Boolean = false;
  Id: any = '';
  specialCharactorPattern: any = '';
  riskCategory: any = '';
  currentUser: any;
  country: any;
  countryThreatMatrix: any;

  threat_matrix: any = [];
  threat_level: any;
  constructor(
    // private formBuilder: FormBuilder,
    private _service: IndexService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    this.currentUser = this.authService.getUser();
    // this.buildForm();
    let breadCrumName = 'Create';
    let url = '/secure/manage-riskpal/country/create';
    if ( this.Id ) {
      breadCrumName = 'Update';
      url = '/secure/manage-riskpal/country/update/' + this.Id;
      this.getDetails(this.Id);
    }
    const data = [
      { name: 'Country', url: '/secure/manage-riskpal/country' },
      { name: breadCrumName, url: url }
    ];
    this.responseService.createBreadCrum(data);
  }
  getDetails(id) {
    this.loading = true;
    this._service.getSingleCountry(id)
      .subscribe(
        ( data: any ) => {
          this.country = data.data;
          this.threat_level = data.data.color.toLowerCase();
          this.riskCategory = data.riskcategory;
          this.countryThreatMatrix = data.country_threat_matrix;
          this.getSelected();
          // this.setFormValue(data.data);
          // this.addDynamicDataRow(this.riskCategory);
          this.loading = false;
        },
        error => {
          this.router.navigate(['/secure/manage-riskpal/country']);
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  getSelected() {
    this.riskCategory.map(item => {
      const risk_ategory_id = item._id;
      const countryThreatMatrixFind = this.countryThreatMatrix.find(x => x.category_id == risk_ategory_id 
          && x.countryname == this.country.name)
      console.log('countryThreatMatrixFind', countryThreatMatrixFind);
      if ( countryThreatMatrixFind ) {
        item.isSelected = countryThreatMatrixFind.country_risk;
      }
    });
    
    console.log('countyr', this.country);
  }
  changeThreatMatrix(val, category) {
    console.log('vale', val, category);
    const matrix = {
      category_id: category._id,
      category_name: category.categoryName,
      category_risk: val,
      countryname: this.country.name
    };
    this.threat_matrix.push(matrix);
  }
  // build reactive form
  buildForm() {
    // this.formGroup = this.formBuilder.group({
    //   threat_level: ['', [
    //       Validators.required
    //     ]],
    //     threat_matrix: this.formBuilder.array([])
    // });
   
  }
  
   // save data
   submit () {
    console.log('valueee', this.threat_matrix);
    console.log('rating', this.threat_level);
    // if ( this.formGroup.valid ) {
      // create data according to backend
      // const updateValue = {};
      // if ( this.Id ) {
      //   updateValue._id = this.Id;
      // }
      const value = {
        color: this.threat_level,
        matrix: this.threat_matrix,
        _id: this.country._id
      };
      this.loading = true;
      if ( this.Id ) {
        // update personal details
        this.update(value);
        console.log('updated');
      } else {
        // this.save(updateValue);
      }
    // }
  }

  save(value) {
    this._service.save(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/manage-riskpal/country']);
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }
  update(value) {
    this._service.update(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/manage-riskpal/country']);
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      )
  }

  setFormValue(data) {
    console.log('data', data);
    const userValue = {
      sectorName: data.sectorName,
    };
    console.log('userValue', userValue);
    // this.formGroup.patchValue(userValue);
  }

}
