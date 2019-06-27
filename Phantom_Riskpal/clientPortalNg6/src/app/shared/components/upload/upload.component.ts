import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { takeWhile } from 'rxjs/operators';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {
  imageData: any;
  alive: boolean = false;
  constructor(private responseService: ResponseService) { }

  ngOnInit() {
    // get user Image through observable
    this.alive = true;
    this.responseService.currentMessage.pipe(takeWhile(() => this.alive)).subscribe(
      ( res: any ) => {
        console.log('resssonse', res);
        if ( res.type == "imageData" ) {
          this.imageData = res.data.url; // get file
        }
      },
      error => {
        // this.responseService.handleErrorResponse({message: 'There is some error while selecting image. please try again later.'});
      }
    );
  }
  
  ngOnDestroy() {
    console.log('[takeWhile] ngOnDestory');
    this.alive = false;
  }
  // get image
  fileChange(e) {
    const fileList = e.target.files[0];
    if (fileList) {
      const reader = new FileReader();

      reader.readAsDataURL(fileList); // read file as data url

      reader.onload = (e) => { // called once readAsDataURL is completed
        this.imageData = e.target.result;
      };
      const data = {
        type: 'uploadFile',
        data: fileList
      };
      this.responseService.changeMessage(data);
    }
  }
}
