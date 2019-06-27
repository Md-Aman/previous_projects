import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../service/client.service';

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

  userFormGroup: FormGroup;
  clients: any;
  loading: Boolean = false;
  clientId: any = '';
  specialCharactorPattern: any = '';
  userGroupDetails: any = '';
  currentUser: any;
  countries: any;
  sectors: any;
  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.clientId = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    this.currentUser = this.authService.getUser();

    const data = [
      { name: 'Client', url: '/secure/client' },
      { name: 'Create', url: '/secure/client/create' }
    ];
    this.responseService.createBreadCrum(data);
    this.preLoadData();

    
    this.buildForm();
    if ( this.clientId ) {
      this.getDetails(this.clientId);
    }
  }
  customSearchFn(term: string, item) {
    return item.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === 0;
  }
  getDetails(id) {
    this.loading = true;
    this.clientService.getSingleClient(id)
      .subscribe(
        ( data: any ) => {
          console.log('userdetails', data);
          this.userGroupDetails = data.data;
          this.setFormValue(this.userGroupDetails);
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  preLoadData() {
    this.loading = true;
    this.clientService.getPreLoadData()
      .subscribe(
        (data: any) => {
          this.loading = false;
          console.log('dataaaaaaaa', data);
            this.countries = data[0].data;
            this.sectors = data[1].data;
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
    this.userFormGroup = this.formBuilder.group({
      company_name: ['', [
          Validators.required, Validators.pattern(specialCharactorPattern),
          Validators.minLength(minLength), Validators.maxLength(maxLength)
        ]],
        country: [ '', [
        Validators.required
      ]],
      type_of_client: ['', [
        Validators.required
      ]],
      sector: ['', [
        Validators.required
      ]],
      no_of_traveller_account: ['', [
        Validators.required
      ]],
      no_of_approving_manager_account: ['', [
        Validators.required
      ]],
      no_of_co_admin_account: ['', [
        Validators.required
      ]],
      no_of_client_admin_account: ['', [
        Validators.required
      ]],
    });
   
  }

   // save data
   submit (value) {
    if ( this.userFormGroup.valid ) {
      // create data according to backend
      const updateValue = value;
      if ( this.clientId ) {
        updateValue._id = this.clientId;
      }
      this.loading = true;
      if ( this.clientId ) {
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
    this.clientService.save(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/client']);
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
    this.clientService.update(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/client']);
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
      company_name: data.company_name,
      type_of_client: data.type_of_client,
      country: data.country,
      sector: data.sector_id,
      no_of_approving_manager_account: data.no_of_approving_manager_account,
      no_of_client_admin_account: data.no_of_client_admin_account,
      no_of_co_admin_account: data.no_of_co_admin_account,
      no_of_traveller_account: data.no_of_traveller_account
    };
    console.log('userValue', userValue);
    this.userFormGroup.patchValue(userValue);
  }

}
