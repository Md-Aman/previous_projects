import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionStorage } from '../../../models/session-storage';
import { CustomAgentApiService } from './../../services/custom-agent-api.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAgentSessionExpiredDialogComponent } from './../custom-agent-session-expired-dialog/custom-agent-session-expired-dialog.component';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'custom-agent-profile',
  templateUrl: './custom-agent-profile.component.html',
  styleUrls: ['./custom-agent-profile.component.css']
})
export class CustomAgentProfileComponent implements OnInit {
  @Output() shareCustomAgentNameToCustomAgentNavbar = new EventEmitter();
  //Create instance of SessionStorage
  session = new SessionStorage();

  isPopup: boolean = false;
  isUpload: boolean = false;
  documents: any;
  documentLength: boolean;

  // initialize variables
  form: FormGroup;
  formm: FormGroup;
  myControl: FormControl = new FormControl();
  user_timezone = {};
  placeholderString = 'Select timezone';
  sessionDetails: any[];
  loginIdImport;
  loginIdBusiness;
  isNotUpload: boolean = true;
  isBusinessNotUpload: boolean = true;
  profileSubmitted: boolean = false;
  //declaring fields for two way binding
  merchantId: string;
  businesses: any[];
  industries: any[];
  countries: any[];
  CustomAgentProfileInit: any[];
  CustomAgentProfileInitValues: any[];

  customAgentProfilInfo: any[];
  profileInfo: any[];
  CustomAgentDetails: any[];
  CustomAgentLoginDetails: any[];
  response: any[];
  rawJsonError;
  message;
  abc: any;

  //initialize variables for change password
  newCurrentPassword: string;

  officialAddressLineOne: string;
  officialAddressLineTwo: string;
  associationClub: string;
  selectedBusinessID: string;
  licenseNumber: string;
  city: string;
  postalcode: number;
  state: string;
  companyName: string;
  companyRegistrationNo: string;
  contactPerson: string;
  phoneNumber: string;
  businesslicense:string;
  officialEmail: string;
  officialPhone: string;
  faxNo: string;
  companyWebsite: string;
  importerExporter: string;
  selectedCountryCode: string;
  selectedIndustryID: number;
  businessSize: string;
  timezone: string;
  notification: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  input: any;

  constructor(
    private service: CustomAgentApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) { }

  changePassword() {
    // this.form = new FormGroup({
    //   oldPassword: new FormControl("", [Validators.required]),
    //   newPassword: new FormControl("", [Validators.required]),
    //   newConfirmPassword: new FormControl("", [
    //     Validators.required,
    //     // Validators.minLength(8),
    //     // Validators.maxLength(16)
    //   ])
    // });
    if ((this.form.value.newPassword == "") || (this.form.value.newConfirmPassword == "")) {
      this.fillPassword();
    }
    else if (this.form.value.newPassword == this.form.value.newConfirmPassword) {
      this.newCurrentPassword = this.form.value.newConfirmPassword;
    }

    let supplierPasswords = {
      "old_password": this.form.value.oldPassword,
      "new_password": this.newCurrentPassword
    }
    this.sharedService.updateChangePassword(this.session.loginID, this.session.sessionID, supplierPasswords)
      .subscribe(
      status => {
        this.rawJsonError = status;
        this.showPasswordSuccess();
      },
      error => {
        // if(error.status == 400){
        this.showPasswordFailure();
        // }
      });
  }

  //to show failure notification properties
  showPasswordFailure() {
    this.toastr.error("Your password could not update!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  //to show success notification properties
  showPasswordSuccess() {
    this.toastr.success("Your password is successfully updated!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  fillPassword() {
    this.toastr.error("Please fill password field", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }


  openLoginAgainModal() {
    this.dialog.open(CustomAgentSessionExpiredDialogComponent, {
      disableClose: true
    });
  }

  destroyAllSession() {
    sessionStorage.clear();
    this.router.navigateByUrl("/");
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formm.get("documentUploader").setValue(file);
      let namefile = <HTMLInputElement>document.getElementById("documentName");
      namefile.innerHTML = file.name;
    }
  }


  onFileReset() {
    let namefile = <HTMLInputElement>document.getElementById("documentName");
    namefile.innerHTML = "";
    let newfile = <HTMLInputElement>document.getElementById("documentUploader");
    newfile.value = "";
    this.input.value = "";
    this.formm.reset();
    this.isUpload = false;
  }

  private prepareSave(): any {
    this.input = new FormData();
    console.log(this.documents);
    if(this.documents === undefined) {
      console.log('this.documents do equal undefined');
      this.input.append("documentUploader", this.formm.get("documentUploader").value);
      //this.input.append('merchantID', this.session.merchantID);
      this.input.append('loginID', this.session.loginID);
      return this.input;
    } else {
    console.log('this.documents are not undefined');
    for (let i = 0; i < this.documents.length; i++){
      if(this.formm.get("documentUploader").value.name === this.documents[i]['file_name']){
      console.log('File already exists');
      this.showupfileAlreadyExists();
      } else {
        this.input.append("documentUploader", this.formm.get("documentUploader").value);
        //this.input.append('merchantID', this.session.merchantID);
        this.input.append('loginID', this.session.loginID);
        console.log('File is unique');
        return this.input;
      }
    }
   }
  }

  ngOnInit() {

    this.manageDocument();

    this.formm = this.formBuilder.group({
      documentUploader: null
    });

    //validation that required before sending out the data
    this.form = new FormGroup({
      cname: new FormControl('', [
        Validators.required,
      ]),
      cregistration: new FormControl('', [
        Validators.required
      ]),
      contactperson: new FormControl('', [
        Validators.required,
      ]),
      oldPassword: new FormControl(""),
      newConfirmPassword: new FormControl(""),
      newPassword: new FormControl(""),
      phonenumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      officialemail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]),
      officephone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      companywebsite: new FormControl('', [
        Validators.required
        // Validators.pattern(/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9./]+$/)
      ]),
      address1: new FormControl('', [
        Validators.required
      ]),
      industrytype: new FormControl('', [
        Validators.required
      ]),
      businesstype: new FormControl('', [
        Validators.required
      ]),
      naturebusiness: new FormControl('', [
        Validators.required
      ]),
      // businesscategory: new FormControl('', [
      //   Validators.required,
      // ]),
      importexport: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-+]?\d*\.?\d+$/)
      ]),
      businesslicense: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-+]?\d*\.?\d+$/)
      ]),
      city: new FormControl('', [
        Validators.required
      ]),
      postalcode: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{5}((\\#)|())$/),
        // Validators.minLength (5),
        // Validators.maxLength (5)
      ]),
      state: new FormControl('', [
        Validators.required
      ]),
      country: new FormControl('', [
        Validators.required
      ]),
      faxNo: new FormControl('', [
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ])
    });

    //placing the field of data that been called from database
    this.service.getCustomAgentProfile(this.session.loginID, this.session.sessionID)
      .subscribe(getCustomAgentProfileInfo => {
        this.customAgentProfilInfo = getCustomAgentProfileInfo;
        this.profileInfo = this.customAgentProfilInfo[0];
        console.log("test profile")
        console.log(this.profileInfo )
        this.officialAddressLineOne = this.profileInfo["address_line_one"];
        this.officialAddressLineTwo = this.profileInfo["address_line_two"];
        this.contactPerson = this.profileInfo["agent_name"];
        this.associationClub = this.profileInfo["association_club"];
        this.selectedBusinessID = this.profileInfo["business_id"];
        this.licenseNumber = this.profileInfo["business_license"];        //fileupload
        this.businessSize = this.profileInfo["business_size"];
        this.city = this.profileInfo["city"];
        this.companyName = this.profileInfo["company_name"];
        this.companyRegistrationNo = this.profileInfo["company_registration_no"];
        this.selectedCountryCode = this.profileInfo["country_code"];
        this.importerExporter = this.profileInfo["import_export_license"];      //fileupload
        this.selectedIndustryID = this.profileInfo["industry_id"];
        this.merchantId = this.profileInfo["merchant_id"];
        this.phoneNumber = this.profileInfo["mobile_no"];
        this.faxNo = this.profileInfo["office_fax"];
        this.officialPhone = this.profileInfo["office_phone"];
        this.officialEmail = this.profileInfo["official_email"];
        this.postalcode = this.profileInfo["postal_code"];
        this.state = this.profileInfo["state"];

        this.companyWebsite = this.profileInfo["website"];
        this.timezone = this.profileInfo["timezone"];
      });

    //calls the 3 dropdown function from CustomAgentProfileInit
    this.service.getBusinessIndustryCountry(this.session.loginID, this.session.sessionID)
      .subscribe(
      signup => {
        this.CustomAgentProfileInit = signup;
        this.CustomAgentProfileInitValues = Object.values(this.CustomAgentProfileInit);
        this.businesses = this.CustomAgentProfileInitValues[0];
        this.industries = this.CustomAgentProfileInitValues[2];
        this.countries = this.CustomAgentProfileInitValues[1];
      });

  }

  //once user clicks, it will save the details and check whether infomation are valid
  updateProfile() {
    this.profileSubmitted = true;
    //checking whether the form is valid
    console.log(this.form)
    if (this.form.valid) {
      let CustomAgentProfileData = {
        company_name: this.companyName,
        company_registration_no: this.companyRegistrationNo,
        contact_person: this.contactPerson,
        phone_number: this.phoneNumber,
        official_email: this.officialEmail,
        official_phone: this.officialPhone,
        fax_no: this.faxNo,
        company_website: this.companyWebsite,
        official_address_line_one: this.officialAddressLineOne,
        official_address_line_two: this.officialAddressLineTwo,
        industry_type: this.selectedIndustryID,
        business_type: this.selectedBusinessID,
        business_nature: this.businessSize,
        association_club: this.associationClub,
          //fileupload
        license_number: this.licenseNumber,           //fileupload
        importer_exporter: this.importerExporter,
        city: this.city,
        postal_code: this.postalcode,
        state: this.state,
        country_code: this.selectedCountryCode,
        timezone: this.user_timezone
      }
      this.service.updateCustomAgentProfile(this.session.loginID, this.session.sessionID, CustomAgentProfileData)
        .subscribe(
        status => {
          this.response = Object.values(status)
          if (this.response[0] == 200) {
            sessionStorage.setItem("userName", JSON.stringify(this.contactPerson));
            sessionStorage.setItem("isOnBoarded", JSON.stringify(1));
            this.shareCustomAgentNameToCustomAgentNavbar.emit(true);
            this.showSuccess();
          }
        },
        error => {
          this.response = Object.values(error)
          if (this.response[1] == 400) {
            this.showFailure();     //to show success notification
            this.dialog.open(CustomAgentSessionExpiredDialogComponent, { disableClose: true });
          }
        }
        );
    }
  }

  //in changing timezone of users
  changeTimezone(timezone) {
    this.user_timezone = timezone;
    return this.user_timezone;
  }

  //to show failure notification properties
  showFailure() {
    this.toastr.error('Your profile could not updated!', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  //to show success notification properties
  showSuccess() {
    this.toastr.success('Your profile successfully updated!', 'Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showuploadSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success("Your document uploaded successfully!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  //to show failure notification properties
  showuploadFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error("Your document failed to upload", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }
  showuploadError() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error(
      "Something wrong happened. Please refresh your browser and try again",
      "Unsuccessful!",
      {
        closeButton: true,
        progressBar: true,
        progressAnimation: "increasing",
        positionClass: "toast-top-right"
      }
    );
  }

  showDeleteSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success("Your document deleted successfully!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  showupfileAlreadyExists(){
    this.toastr.error("Document already in the list, check file name!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  //to show failure notification properties
  showDeleteFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error("Your document failed to delete", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }
  manageDocument() {
    //function will be here to load list of documents
    this.sharedService
      .getProfileDocuments(
      this.session.loginID,
      this.session.sessionID
      )
      .subscribe(
      getdocuments => {
        if (getdocuments != null) {
          this.documents = getdocuments;
          this.documentLength = true;
        } else {
          this.documentLength = false;
        }
      },
      error => {
        this.isPopup = true;
      }
      );
  }

  uploadDocument() {
    // if (this.form.valid) {
    if(this.formm.get("documentUploader").value !== null) {
    const profileDocument = this.prepareSave();
    console.log(profileDocument);
    this.sharedService.uploadProfileDocument(this.session.loginID, this.session.sessionID, profileDocument).subscribe(
      status => {
        if (status === 200) {
          this.showuploadSuccess();
          this.manageDocument();
          this.onFileReset();
        } 
        else if (status === 204) {
          this.showuploadFailure();
        } else {
          this.showuploadError();
        }
      },
      error => {
        this.showuploadError();
      }
    );
  
  } else {
    console.log('Upload file first');
    this.showupUploadFileFirst();
  }
  
}

  resetInputField() {
    this.onFileReset();
  }

  deleteDocument(documentId) {
    let documentDetails = {
      documentId: documentId
    };
    this.sharedService
      .deleteProfileDocument(
      this.session.loginID,
      this.session.sessionID,
      documentDetails
      )
      .subscribe(
      status => {
        this.showDeleteSuccess();
        this.manageDocument();
      },
      error => {
        this.showDeleteFailure();
      }
      );
  }
  blankInputField() {
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }

  showupUploadFileFirst(){
    this.toastr.error("Upload file!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }
}
