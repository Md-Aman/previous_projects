import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastarService {
  errorText:string = "Something happend wrong please try again";
  
  constructor(private toastr: ToastrService) { }

  showNotification(message, status) {
    switch (status) {
      case 'success': {
        this.toastr.success(message, 'Success:', { enableHtml: true });
        break;
      }
      case 'warning': {
        this.toastr.warning(message, 'Warning:', { enableHtml: true });
        break;
      }
      case 'info': {
        this.toastr.info(message, 'Information:', { enableHtml: true });
        break;
      }
      case 'error': {
        this.toastr.error(message, 'Error:', { enableHtml: true });
      }
    }
  }


}
