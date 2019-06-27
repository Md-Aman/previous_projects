import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RiskLabelService } from '../service/risk-label.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RaService } from './../../../../shared/ra/service/ra.service';

@Component({
  selector: 'app-create-label',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  formGroup: FormGroup;
  clients: any;
  loading: Boolean = false;
  Id: any = '';
  specialCharactorPattern: any = '';
  userGroupDetails: any = '';
  currentUser: any;
  sectors: any;
  comingFromOtherPage: any = false;
  @Input() comingFromOtherPageInput: any = false;
  @Input() isUpdateBreadCrum: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private _service: RiskLabelService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private raService: RaService,
    private activeRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    // this.Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    this.Id = this.data.id;
    this.comingFromOtherPage = this.data.comingFromOtherPage;
    if (this.comingFromOtherPageInput) {
      this.comingFromOtherPage = this.comingFromOtherPageInput;
    }
    this.currentUser = this.authService.getUser();
    this.buildForm();
    let breadCrumName = 'Create';
    let url = '/secure/manage-riskpal/risk-label/create';
    if (this.Id) {
      breadCrumName = 'Update';
      url = '/secure/manage-riskpal/risk-label/update/' + this.Id;
      this.getDetails(this.Id);
    }
    const data = [
      { name: 'Risk Label', url: '/secure/manage-riskpal/risk-label' },
      { name: breadCrumName, url: url }
    ];
    this.preLoadData();
    if (this.isUpdateBreadCrum) {
      this.responseService.createBreadCrum(data);
    }
  }
  preLoadData() {
    this.loading = true;

    this._service.getAllSectors()
      .subscribe(
        (data: any) => {
          console.log('userdetails', data);
          this.sectors = data.data;
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  getDetails(id) {
    this.loading = true;
    this._service.getSingleCategory(id)
      .subscribe(
        (data: any) => {
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
      categoryName: ['', [
        Validators.required, Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength), Validators.maxLength(maxLength)
      ]],
      sector_name: [[], [Validators.required]]
    });

  }

  // save data
  submit(value) {
    if (this.formGroup.valid) {
      // create data according to backend
      const updateValue = value;
      if (this.Id) {
        updateValue._id = this.Id;
      }
      this.loading = true;
      if (this.Id) {
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
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            // this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            this.dialogRef.close();
            if (this.comingFromOtherPage || this.comingFromOtherPage === 'true') {

              this.raService.setSubject({
                type: 'updateTemplateRisk'
              });
            } else {
              this.router.navigate(['/secure/manage-riskpal/risk-label']);
            }
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }
  closeModal() {
    this.dialogRef.close();
  }
  updateUser(value) {
    this._service.update(value)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.dialogRef.close();
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/manage-riskpal/risk-label']);
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
      categoryName: data.categoryName,
      sector_name: data.sector_name,
    };
    console.log('userValue', userValue);
    this.formGroup.patchValue(userValue);
  }

}
