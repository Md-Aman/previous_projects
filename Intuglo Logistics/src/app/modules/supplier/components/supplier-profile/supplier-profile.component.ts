import { SharedService } from './../../../shared/services/shared.service';
import { SupplierApiService } from "./../../services/supplier-api.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
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
import { SupplierSessionExpiredDialogComponent } from "../supplier-session-expired-dialog/supplier-session-expired-dialog.component";
import { validateConfig } from "@angular/router/src/config";

@Component({
  selector: "supplier-profile",
  templateUrl: "./supplier-profile.component.html",
  styleUrls: ["./supplier-profile.component.css"]
})
export class SupplierProfileComponent implements OnInit {
  // create instance of user-profile class
  // userProfile = new UserProfile();
  @Output() shareSupplierNameToSupplierNavbar = new EventEmitter();
  //Create instance of SessionStorage
  session = new SessionStorage();

  //create ID for name of file chosen
  // @ViewChild('businessLicenseName')
  // businessLicenseName: ElementRef;
  // @ViewChild('importExportLicenseName')
  // importExportLicenseName: ElementRef;
  session_expired =
    "It seems your session is expired! Please login and try again.";

  isPopup: boolean = false;
  isUpload: boolean = false;
  documents: any;
  documentLength: boolean;

  // initialize variables
  form: FormGroup;
  formm: FormGroup;
  myControl: FormControl = new FormControl();
  user_timezone = {};
  placeholderString = "Select timezone";
  businesses: any[];
  industries: any[];
  countries: any[];
  supplierProfileInit: any[];
  supplierProfileInitValues: any[];
  sessionDetails: any[];
  loginIdImport;
  loginIdBusiness;
  // MerchantId: string;
  isNotUpload: boolean = true;
  // isImExUploadEmpty: boolean;
  isBusinessNotUpload: boolean = true;
  // isBusinessUploadEmpty: boolean;
  supplierProfileInfo: any[];
  profileInfo: any[];
  supplierDetails: any[];
  supplierLoginDetails: any[];
  response: any[];
  SessionDetails: any[];
  rawJsonError;
  message;

  //initialize variables for change password
  newCurrentPassword: string;
  input: any;

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
  timezone: string;
  city: string;
  postalcode: number;
  state: string;
  bankAccountNumber: string;
  bankName: string;
  ibanNumber: string;
  swiftCode: string;
  taxType: string;
  taxRate: number;
  taxNumber: string;
  selectedCountryCode: string;
  selectedBusinessID: number;
  selectedIndustryID: number;
  notification: string;
  profileSubmitted: boolean = false;
  currentPassword:string;
  newPassword:string;
  confirmPassword:string;
  
  constructor(
    private service: SupplierApiService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {
    // this.userProfile.merchantID = "Merchant-ID";
  }


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
    this.dialog.open(SupplierSessionExpiredDialogComponent, {
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
     // this.input.append('merchantID', this.session.merchantID);
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
    // this.isImExUploadEmpty = false;
    // this.isBusinessNotUpload = false;
    // this.isNotUpload = false;
    // this.isBusinessUploadEmpty = false;

    // to display list of documents on page load
    this.manageDocument();

    this.formm = this.formBuilder.group({
      documentUploader: null
    });

    //validation that required before sending out the data
    this.form = new FormGroup({
      cname: new FormControl("", [Validators.required]),
      cregistration: new FormControl("", [Validators.required]),
      contactperson: new FormControl("", [Validators.required]),
      oldPassword: new FormControl(""),
      newConfirmPassword: new FormControl(""),
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
      //   Validators.required,
      // ]),
      importexport: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
        // Validators.pattern(/^[-+]?\d*\.?\d+$/)
      ]),
      businesslicense: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      city: new FormControl("", [Validators.required]),
      postalcode: new FormControl("", [
        Validators.required
        // Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{5}((\\#)|())$/),
        // Validators.minLength (5),
        // Validators.maxLength (5)
      ]),
      state: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      faxNo: new FormControl("", [
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      associationclub: new FormControl("", []),
      bankaccountnumber: new FormControl("", []),
      bankname: new FormControl("", []),
      ibannumber: new FormControl("", []),
      swiftcode: new FormControl("", []),
      taxtype: new FormControl("", []),
      taxrate: new FormControl("", [Validators.required]),
      taxnumber: new FormControl("", [])
    });

    //placing the field of data that been called from database
    this.service
      .getSupplierProfile(this.session.loginID, this.session.sessionID)
      .subscribe(
      getSupplierProfileInfo => {
        console.log(getSupplierProfileInfo);
        this.supplierProfileInfo = getSupplierProfileInfo;
        this.profileInfo = this.supplierProfileInfo[0];

        this.officialAddressLineOne = this.profileInfo["address_line_one"];
        this.officialAddressLineTwo = this.profileInfo["address_line_two"];
        this.associationClub = this.profileInfo["association_club"];
        this.bankAccountNumber = this.profileInfo["bank_acc_no"];
        this.bankName = this.profileInfo["bank_name"]; //fileupload
        this.selectedBusinessID = this.profileInfo["business_id"];
        this.licenseNumber = this.profileInfo["business_license"];
        this.businessNature = this.profileInfo["business_size"];
        this.city = this.profileInfo["city"];
        this.companyName = this.profileInfo["company_name"];
        this.companyRegistrationNo = this.profileInfo["company_registration_no"]; //fileupload
        this.selectedCountryCode = this.profileInfo["country_code"];
        this.ibanNumber = this.profileInfo["iban_no"];
        this.importerExporter = this.profileInfo["import_export_license"];
        this.selectedIndustryID = this.profileInfo["industry_id"];
        this.merchantId = this.profileInfo["merchant_id"];
        this.phoneNumber = this.profileInfo["mobile_no"];
        this.faxNo = this.profileInfo["office_fax"];
        this.officialPhone = this.profileInfo["office_phone"];
        this.officialEmail = this.profileInfo["official_email"];
        this.postalcode = this.profileInfo["postal_code"];
        this.state = this.profileInfo["state"];
        this.contactPerson = this.profileInfo["supplier_name"];
        this.swiftCode = this.profileInfo["swift_code"];
        this.taxNumber = this.profileInfo["tax_number"];
        this.taxRate = this.profileInfo["tax_rate"];
        this.taxType = this.profileInfo["tax_type"];
        this.timezone = this.profileInfo["timezone"];
        this.companyWebsite = this.profileInfo["website"];
      },
      error => {
        if ((error.status = 400)) {
          this.dialog.open(SupplierSessionExpiredDialogComponent, {
            disableClose: true
          });
        }
      }
      );

    //calls the 3 dropdown function from supplierProfileInit
    this.service
      .getBusinessIndustry(this.session.loginID, this.session.sessionID)
      .subscribe(signup => {
        this.supplierProfileInit = signup;
        this.supplierProfileInitValues = Object.values(
          this.supplierProfileInit
        );
        this.businesses = this.supplierProfileInitValues[0];
        this.industries = this.supplierProfileInitValues[2];
        this.countries = this.supplierProfileInitValues[1];
      });
  }

  //once user clicks, it will save the details and check whether infomation are valid
  updateProfile() {
    //checking whether the form is valid
    this.profileSubmitted = true;
    console.log(this.form.valid);
    if (this.form.valid) {
      let supplierProfileData = {
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
        importer_exporter: this.importerExporter, //fileupload
        license_number: this.licenseNumber, //fileupload
        city: this.city,
        postal_code: this.postalcode,
        state: this.state,
        country_code: this.selectedCountryCode,
        bank_acc_no: this.bankAccountNumber,
        bank_name: this.bankName,
        iban_no: this.ibanNumber,
        swift_code: this.swiftCode,
        tax_number: this.taxNumber,
        tax_rate: this.taxRate,
        tax_type: this.taxType,
        timezone: this.user_timezone
        // notification: this.userProfile.selectedNotification ? this.userProfile.selectedNotification:0
      };
      console.log(supplierProfileData);
      console.log("finish")
      this.service
        .updateSupplierProfile(
        this.session.loginID,
        this.session.sessionID,
        supplierProfileData
        )
        .subscribe(
        status => {
          console.log(status);
          // this.response = Object.values(status);
          // if (this.response[0] == 200) {
          sessionStorage.setItem("userName", JSON.stringify(this.contactPerson));
          sessionStorage.setItem("isOnBoarded", JSON.stringify(1));
          this.shareSupplierNameToSupplierNavbar.emit(true);
          this.showSuccess(); //to show success notification
          // }
        },

        error => {
          this.response = Object.values(error);
          if (this.response[1] == 400) {
            this.showFailure(); //to show success notification
            this.dialog.open(SupplierSessionExpiredDialogComponent, {
              disableClose: true
            });
          }
        }
        );
    } else {
      console.log("invalid");
    }
  }


  //in changing timezone of users
  changeTimezone(timezone) {
    this.user_timezone = timezone;
    return this.user_timezone;
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
    // }
  }

  resetInputField() {
    this.onFileReset();
  }

  deleteDocument(documentId) {
    let documentDetails = {
      "profile_documents_id": documentId
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
}
