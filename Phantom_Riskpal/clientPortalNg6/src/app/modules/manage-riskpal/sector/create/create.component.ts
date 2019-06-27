import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SectorService } from '../service/sector.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  formGroup: FormGroup;
  clients: any;
  loading: Boolean = false;
  Id: any = '';
  specialCharactorPattern: any = '';
  userGroupDetails: any = '';
  currentUser: any;
  countries: any;
  sectors: any;
  constructor(
    private formBuilder: FormBuilder,
    private _service: SectorService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    this.currentUser = this.authService.getUser();
    this.buildForm();
    let breadCrumName = 'Create';
    let url = '/secure/manage-riskpal/sector/create';
    if ( this.Id ) {
      breadCrumName = 'Update';
      url = '/secure/manage-riskpal/sector/update/' + this.Id;
      this.getDetails(this.Id);
    }
    const data = [
      { name: 'Sector', url: '/secure/manage-riskpal/sector' },
      { name: breadCrumName, url: url }
    ];
    this.responseService.createBreadCrum(data);
  }
  getDetails(id) {
    this.loading = true;
    this._service.getSingleSector(id)
      .subscribe(
        ( data: any ) => {
          console.log('userdetails', data);
          this.setFormValue(data.data);
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  
  // build reactive form
  buildForm() {

    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    this.specialCharactorPattern = specialCharactorPattern;
    this.formGroup = this.formBuilder.group({
      sectorName: ['', [
          Validators.required, Validators.pattern(specialCharactorPattern),
          Validators.minLength(minLength), Validators.maxLength(maxLength)
        ]]
    });
   
  }

   // save data
   submit (value) {
    if ( this.formGroup.valid ) {
      // create data according to backend
      const updateValue = value;
      if ( this.Id ) {
        updateValue._id = this.Id;
      }
      this.loading = true;
      if ( this.Id ) {
        // update personal details
        this.updateUser(updateValue);
        console.log('updated');
      } else {
        this.save(updateValue);
      }
      console.log('value', updateValue);
    }
    console.log('value', value);
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
            this.router.navigate(['/secure/manage-riskpal/sector']);
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }
  updateUser(value) {
    this._service.update(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/manage-riskpal/sector']);
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
    this.formGroup.patchValue(userValue);
  }

}
