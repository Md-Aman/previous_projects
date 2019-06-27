import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { PublicApiService } from '../../services/public-api.service';

import {
  FormGroup,
  // FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class signupComponent implements OnInit {
  public loading = false;
  form: FormGroup;
  // myControl: FormControl = new FormControl();
  // emailFormat = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
  // // mobileFormat = "^([0-9()/+ -]{6,16})$";

  signupInit: any[];
  signupInitValues: any[];
  termsAndCondition: any;
  TermsConditionsText: string;
  TermsConditionsId: number;
  businesses: any[];
  industries: any[];
  countries: any[];
  name: string;
  phoneNumber: number;
  email: string;
  selectedCountryCode: string = 'MY';
  selectedBusinessID: string;
  getIndustry: any[];
  getBusiness: any[];
  isAgreed: boolean = false;
  registrationPage: boolean = true;
  isSuccesssfulRegistration: boolean = false;
  checkEmail: string;
  showDuplicateEmailErrorMessage: boolean = false;
  selectedIndustryId: string;

  password:string;


  constructor(public dialogRef: MatDialogRef<signupComponent>, @Inject(MAT_DIALOG_DATA) public data: string,
    private service: PublicApiService) { }
  // , private formBuilder: FormBuilder

  ngOnInit() {

    this.form = new FormGroup({
      Name: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^[a-zA-Z ]{6,18}$/)
      ]),
      Email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]),
      PhoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength (8),
        Validators.maxLength (16) 
      ]),
      Industry: new FormControl('', [
        Validators.required
      ]),
      Country: new FormControl('', [
        Validators.required
      ]),
      Business: new FormControl('', [
        Validators.required
      ]),
      CheckEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-z]{4}/)
      ])
    });

    this.service.getSignupInit(this.service.userType)
      .subscribe(
      signup => {
        this.signupInit = signup;
        this.signupInitValues = Object.values(this.signupInit);
        this.termsAndCondition = this.signupInitValues[3][0];
        this.TermsConditionsText = this.termsAndCondition.terms_conditions_text;
        this.TermsConditionsId = this.termsAndCondition.tc_id;
        this.businesses = this.signupInitValues[0];
        this.industries = this.signupInitValues[2];
        this.countries = this.signupInitValues[1];
        return this.businesses, this.industries;
      });
  }

  checkDuplicateEmail() {
    this.service.getDuplicateEmail(this.email)
      .subscribe(emailExistStatus => {
        if (emailExistStatus[0] == 0) {
          this.checkEmail = "true"
          this.showDuplicateEmailErrorMessage = false;
        } else {
          this.checkEmail = "";
          this.showDuplicateEmailErrorMessage = true;
        }
      });

  }

  // getIndustries() {
  //   this.getIndustry = this.industries;
  //   return this.getIndustry;
  // }

  // getBusinesses() {
  //   this.getBusiness = this.businesses;
  //   return this.getBusiness;
  // }

  // onSelectIndustry(industry_id: number) {
  //   this.getBusiness = this.getBusinesses().filter((item) => {
  //     return item.IndustryID === Number(industry_id)
  //   });
  // }

  statusAgreed() {
    this.isAgreed = !this.isAgreed;
  }
  createSignup() {
    this.loading = true;
   if (this.form.valid) {
    let user = {
      "Name": this.name,
      "PhoneNumber": this.phoneNumber,
      "Country": this.selectedCountryCode,
      "Business": this.selectedBusinessID,
      "Industry": this.selectedIndustryId,
      "Email": this.email,
      "UserType": this.service.userType,
      "TermsAndConditions": this.TermsConditionsId
    }
    this.service.postSignup(user).subscribe(
      status => {
        this.loading = false;
        this.password = status;
        this.isSuccesssfulRegistration = true;
        this.registrationPage = false;
      }, error =>{
        this.loading = false;
      }
      
    );
       } else {
         //  this.validateAllFormFields(this.form);
         console.log('Validation failed')
        }
  }
  onReset() {
    this.form.reset();
  }

  // isFieldValid(field: string) {
  //   return !this.form.get(field).valid && (this.form.get(field).touched || this.form.get(field).dirty);
  // }



  // displayFieldCss(field: string) {
  //   return {
  //     "has-error": this.isFieldValid(field),
  //     "has-feedback": this.isFieldValid(field)
  //   };
  // }

  // validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //       control.markAsTouched({ onlySelf: true });
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFormFields(control);
  //     }
  //   });
  // }

  // showSuccesssfulRegistration(){
  //   if (this.form.valid) {
  //     this.isSuccesssfulRegistration = true;
  //     this.registrationPage = false;
  //   } else {
  //     this.validateAllFormFields(this.form);
  //   }
  // }

  onCloseCancel() {
    this.dialogRef.close();
  }
}