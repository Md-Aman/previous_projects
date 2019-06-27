import { CustomerApiService } from "./../../services/customer-api.service";
import { Component, OnInit,Output,Input,EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { SessionStorage } from "../../../models/session-storage";
import { CustomerSessionExpiredDialogComponent } from "../customer-session-expired-dialog/customer-session-expired-dialog.component";
import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedService } from './../../../shared/services/shared.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: "customer-profile",
  templateUrl: "./customer-profile.component.html",
  styleUrls: ["./customer-profile.component.css"]
})
export class CustomerProfileComponent implements OnInit {

  public loading = false;

  @Output() shareCustomerNameToCustomerNavbar = new EventEmitter();
  //Create instance of SessionStorage
  session = new SessionStorage();
  session_expired =
    "It seems your session is expired! Please login and try again.";

  // //create ID for name of file chosen
  // @ViewChild('businessLicenseName')
  // businessLicenseName: ElementRef;
  // @ViewChild('importExportLicenseName')
  // importExportLicenseName: ElementRef;
  isPopup: boolean = false;
  documents: any;
  documentLength: boolean;
  input: any;

  //initialize variables for change password
  newCurrentPassword:string;

  // initialize variables
  form: FormGroup;
  formm: FormGroup;
  myControl: FormControl = new FormControl();
  user_timezone = {};
  placeholderString = "Select timezone";
  businesses: any[];
  industries: any[];
  countries: any[];
  customerProfileInit: any[];
  customerProfileInitValues: any[];
  loginIdImport;
  loginIdBusiness;
  // MerchantId: string;
  isUpload: boolean = false;
  customerDetails: any[];
  customerLoginDetails: any[];
  response: any[];
  SessionDetails: any[];
  sessionDetails: any[];
  rawJsonError: any[];
  message: any[];
  customerProfileInfo: any[];
  profileInfo: any[];

  //declaring fields for two way binding
  merchantId: string;
  companyName: string;
  companyRegistrationNo: string;
  contactPerson: string;
  phoneNumber: string;
  officialEmail: string;
  officialPhone: string;
  faxNo: string;
  companyWebsite: string;
  industryType: number;
  officialAddressLineOne: string;
  officialAddressLineTwo: string;
  businessNature: string;
  // businessCategory: string;
  associationClub: string;
  importerExporter: number;
  licenseNumber: number;
  user = {};
  timezone: any;
  city: string;
  postalcode: number;
  state: string;
  selectedCountryCode: string;
  selectedBusinessID: number;
  selectedIndustryID: number;
  notification: string;
  valid: boolean;
  // passwordBlankError:string = "Please fill password field";
  profileLogo;
  currentPassword:string;
  newPassword:string;
  confirmPassword:string;
  profileSubmitted: boolean = false;
  constructor(
    private service: CustomerApiService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    // this.userProfile.merchantID = "Merchant-ID";
  }

  changePassword(){
    // this.form = new FormGroup({
    //   oldPassword: new FormControl("", [Validators.required]),
    //   newPassword: new FormControl("", [Validators.required]),
    //   newConfirmPassword: new FormControl("", [
    //     Validators.required,
    //     // Validators.minLength(8),
    //     // Validators.maxLength(16)
    //   ])
    // });
    
    if((this.form.value.newPassword == "") || (this.form.value.newConfirmPassword == "")){
      this.fillPassword();
    }
    else if(this.form.value.newPassword == this.form.value.newConfirmPassword){
      this.newCurrentPassword = this.form.value.newConfirmPassword;
    }
    
    let customerPasswords = {
      "old_password": this.form.value.oldPassword,
      "new_password": this.newCurrentPassword
    }
    this.spinnerService.show();
    console.log("test loading"+this.loading)
    this.sharedService.updateChangePassword(this.session.loginID,this.session.sessionID,customerPasswords)
      .subscribe(
      status => {
        this.spinnerService.hide();
        this.rawJsonError = status;
        this.showPasswordSuccess();
      },
      error => {
        this.spinnerService.hide();
        // if(error.status == 400){
          this.showPasswordFailure();
        // }
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

  fillPassword(){
    this.toastr.error("Please fill password field", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
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

  openLoginAgainModal() {
    this.dialog.open(CustomerSessionExpiredDialogComponent, {
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
      console.log(file.name);
    }
  }

  uploadDocument() {
    // if (this.form.valid) {
    this.spinnerService.show();
    if(this.formm.get("documentUploader").value !== null) {
    const profileDocument = this.prepareSave();
    this.sharedService.uploadProfileDocument(this.session.loginID, this.session.sessionID, profileDocument).subscribe(
      status => {
        if (status === 200) {
          this.spinnerService.hide();
          this.showuploadSuccess();
          this.manageDocument();
          this.onFileReset();
        } 
        else if (status === 204) {
          this.showuploadFailure();
        } else {
          this.spinnerService.hide();
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
    this.formm = this.formBuilder.group({
      documentUploader: null
    });

    // to get the list of documents
    this.manageDocument();

    //validation that required before sending out the data
    this.form = new FormGroup({
      cname: new FormControl("", [Validators.required]),
      cregistration: new FormControl("", [Validators.required]),
      contactperson: new FormControl("", [Validators.required]),
      oldPassword: new FormControl(""),
      newConfirmPassword:new FormControl(""),
      newPassword: new FormControl(""),

      
      phonenumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),


      officialemail: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ]),
      officephone: new FormControl("", [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      companywebsite: new FormControl("", [
        Validators.required
        // Validators.pattern(/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9./]+$/)
      ]),


      address1: new FormControl("", [Validators.required]),
      industrytype: new FormControl("", [Validators.required]),
      businesstype: new FormControl("", [Validators.required]),
      naturebusiness: new FormControl("", [Validators.required]),
      // businesscategory: new FormControl('', [
      //   Validators.required
      // ]),
      importexport: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      businesslicense: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      city: new FormControl("", [Validators.required]),
      postalcode: new FormControl("", [
        Validators.required,
         Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{5}((\\#)|())$/),
         Validators.minLength (5),
         Validators.maxLength (5)
      ]),
      state: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      faxNo: new FormControl("", [
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ])
    });

    //placing the field of data that been called from database
    this.service
      .getCustomerProfile(this.session.loginID, this.session.sessionID)
      .subscribe(
        getCustomerProfileInfo => {
          this.customerProfileInfo = getCustomerProfileInfo;
          this.profileInfo = this.customerProfileInfo[0];
          this.officialAddressLineOne = this.profileInfo["address_line_one"];
          this.officialAddressLineTwo = this.profileInfo["address_line_two"];
          this.associationClub = this.profileInfo["association_club"];
          this.selectedBusinessID = this.profileInfo["business_id"];
          this.licenseNumber = this.profileInfo["business_license"]; //fileupload
          this.businessNature = this.profileInfo["business_size"];
          this.city = this.profileInfo["city"];
          this.companyName = this.profileInfo["company_name"];
          this.companyRegistrationNo = this.profileInfo["company_registration_no"];
          this.selectedCountryCode = this.profileInfo["country_code"];
          this.contactPerson = this.profileInfo["customer_name"];
          this.importerExporter = this.profileInfo["import_export_license"]; //fileupload
          this.selectedIndustryID = this.profileInfo["industry_id"];
          this.merchantId = this.profileInfo["merchant_id"];
          this.phoneNumber = this.profileInfo["mobile_no"];
          this.faxNo = this.profileInfo["office_fax"];
          this.officialPhone = this.profileInfo["office_phone"];
          this.officialEmail = this.profileInfo["official_email"];
          this.postalcode = this.profileInfo["postal_code"];
          this.state = this.profileInfo["state"];
          this.timezone = this.profileInfo["timezone"]
          console.log("testing"+this.timezone)
          this.companyWebsite = this.profileInfo["website"];
        },
        error => {
          if ((error.status = 400)) {
            this.dialog.open(CustomerSessionExpiredDialogComponent, {
              disableClose: true
            });
          }
        }
      );

    //calls the 3 dropdown function from customerProfileInit
    this.service
      .getBusinessIndustry(this.session.loginID, this.session.sessionID)
      .subscribe(signup => {
        this.customerProfileInit = signup;
        this.customerProfileInitValues = Object.values(
          this.customerProfileInit
        );
        this.businesses = this.customerProfileInitValues[0];
        this.industries = this.customerProfileInitValues[2];
        this.countries = this.customerProfileInitValues[1];
      });
  }

  //in changing timezone of users
  changeTimezone(timezone) {
    this.user_timezone = timezone;
    return this.user_timezone
  }

  //once user clicks, it will save the details and check whether infomation are valid
  updateProfile() {
    this.profileSubmitted = true;
    if (this.form.valid) {
      let customerProfileData = {
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
        business_nature: this.businessNature,
        association_club: this.associationClub,
        license_number: this.licenseNumber, 
        importer_exporter: this.importerExporter,
        city: this.city,
        postal_code: this.postalcode,
        state: this.state,
        country_code: this.selectedCountryCode,
        timezone: this.user_timezone
      };
      this.service
        .updateCustomerProfile(
          this.session.loginID,
          this.session.sessionID,
          customerProfileData
        )
        .subscribe(
          status => {
            this.response = Object.values(status);
            if (this.response[0] == 200) {
              sessionStorage.setItem("userName", JSON.stringify(this.contactPerson));
              sessionStorage.setItem("isOnBoarded", JSON.stringify(1));
              this.shareCustomerNameToCustomerNavbar.emit(true);
              this.showSuccess(); //to show success notification
            }
          },
          error => {
            this.response = Object.values(error);
            if (this.response[1] == 400) {
              this.showFailure(); //to show unsuccess notification
              this.dialog.open(CustomerSessionExpiredDialogComponent, {
                disableClose: true
              });
            }
          }
        );
    } else {
      console.log('Validation error');
      this.showValidationFailure();
    }
  }

  //to show success notification properties
  showSuccess() {
    this.toastr.success("Your profile successfully updated!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }
  

  //to show failure notification properties
  showFailure() {
    this.toastr.error("Your profile could not updated!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
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

  showupfileAlreadyExists(){
    this.toastr.error("Document already in the list, check file name!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  showupUploadFileFirst(){
    this.toastr.error("Upload file!", "Unsuccessful!", {
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


  showValidationFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error("Validation failed", "Unsuccessful!", {
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
  
  resetInputField() {
    this.onFileReset();
  }

  deleteDocument(documentId) {
    let documentDetails = {
      "profile_documents_id": documentId
    };
    console.log(documentDetails);
    this.sharedService
      .deleteProfileDocument(
        this.session.loginID,
        this.session.sessionID,
        documentDetails
      )
      .subscribe(
        status => {
          if(status["status"] == 200){
            this.showDeleteSuccess();
            this.manageDocument();
          }
        },
        error => {
          this.showDeleteFailure();
        }
      );
  }

  blankInputField(){
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }
}
