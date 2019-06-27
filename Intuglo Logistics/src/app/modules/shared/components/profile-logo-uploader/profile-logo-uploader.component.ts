import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
//import { FlashMessagesService } from 'angular2-flash-messages';
import { ToastrService } from "ngx-toastr";
import { SessionStorage } from './../../../models/session-storage';
import { SharedService } from './../../services/shared.service';
import { tick } from '@angular/core/testing';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'profile-logo-uploader',
  templateUrl: './profile-logo-uploader.component.html',
  styleUrls: ['./profile-logo-uploader.component.css']
})
export class ProfileLogoUploaderComponent implements OnInit {

  public loading = false;

  url = '';
  imgWidth ='0';
  imgHeight ='0';
  profileImage;
  @Output() shareLogoToCustomerNavbar = new EventEmitter();
  @Output() shareLogoToSupplierNavbar = new EventEmitter();
  @Output() shareLogoToCustomAgentNavbar = new EventEmitter();
  session = new SessionStorage();//instance for session

  constructor(private httpClient:HttpClient, private toastr: ToastrService,
              private sharedService: SharedService,
              private spinnerService: Ng4LoadingSpinnerService ) { }
  //private FlashMessagesService: FlashMessagesService
  ngOnInit() {

    this.sharedService.getProfileLogo(this.session.loginID, this.session.sessionID, this.session.userType)
      .subscribe(logo => {
        this.url = logo;
      })
  }
  
  
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      var _URL = window.URL;
      var self = this;    
          var file, img;
          if ((file = event.target.files[0])) {
            img = new Image();
            img.onload = function () {
                console.log("Width/Height: "+this.width + "/" + this.height);
                self.imgWidth = this.width;
                self.imgHeight = this.height;
              };
              img.src = _URL.createObjectURL(file);
              this.profileImage = file;
          }

      if(event.target.files[0].size<500000 && (event.target.files[0].type=='image/jpeg' || event.target.files[0].type=='image/png')) {

      // called once readAsDataURL is completed
      reader.onload = (event:any) => {     
        this.url = event.target.result;
      }
     } else {
       console.log("File is too big (only 500KB) or format is not jpeg or png");
       this.toastr.error(
        "File is too big (only 500KB) or format is not jpeg or png",
        "Unsuccessful!",
        {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right"
        }
      );
     }
    }
  }

  //to show success notification properties
  showuploadSuccess(){
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success('Your document uploaded successfully!', 'Successful!',{
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showuploadFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('Your document failed to upload', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showDimensionError() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('File should have square dimensions, exmple: Height 420 and Width 420', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showuploadError() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('Something wrong happend. Pease refresh your browser and try again', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  onFileReset() {
    let imageFile = <HTMLInputElement>document.getElementById("imageUploader");
    imageFile.value = "";
  }

  onUpload(){

    const fd =  new FormData();
    // this.spinnerService.show();
    fd.append('profileUploader',this.profileImage);
    fd.append('login_id',this.session.loginID);
    fd.append('userType',String(this.session.userType));
    this.spinnerService.show();
    if(this.imgHeight==this.imgWidth){
      // sharing logo tocustomer dashboard navbar
       console.log("uploading")
      //  this.shareLogoToCustomerNavbar.emit(this.profileImage);
       this.sharedService.uploadProfileLogo(fd).subscribe(
      status => {
        this.spinnerService.hide();
        console.log(status)
        if(status === 200){
          this.showuploadSuccess();
          this.shareLogoToCustomerNavbar.emit(true);
          this.shareLogoToSupplierNavbar.emit(true);
          this.shareLogoToCustomAgentNavbar.emit(true);
          this.onFileReset();
        }else if(status == 204){
          this.showuploadFailure();
        }else{
          this.showuploadError();
        }
      },
      error =>{
        this.spinnerService.hide();
        console.log(error);
        this.shareLogoToCustomerNavbar.emit(true);
        this.shareLogoToSupplierNavbar.emit(true);
        this.shareLogoToCustomAgentNavbar.emit(true);
        this.showuploadError();
      });
    }
    else{
      console.log("test");
      this.showDimensionError();
    }
    
  }

}