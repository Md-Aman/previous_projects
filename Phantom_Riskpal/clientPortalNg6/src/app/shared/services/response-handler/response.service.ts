import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor(public toastarService: ToastarService) { }
  changeMessage(data: any) {
    this.messageSource.next(data);
  }
  createBreadCrum(data) {
    const bread = {
      type: 'breadcrum',
      data: data
    };
    this.changeMessage(bread);
  }
  handleErrorResponse(response) {
    if ( Array.isArray(response.message) ) {
      let message = '';
      response.message.forEach( item => {
        message += item.msg + '<br>';
      });
      this.toastarService.showNotification(message, 'error');
    } else {
      const msg = response.message ? response.message : response.err;
      this.toastarService.showNotification(msg, 'error');
    }
  }
  hanleSuccessResponse(response) {
    if ( Array.isArray(response.message) ) {
      response.message.forEach( item => {
        this.toastarService.showNotification(item.msg, 'success');
      });
    } else {
      this.toastarService.showNotification(response.message, 'success');
    }
  }

  scrollTo(el: Element) {
    if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector('.has-error');
    this.scrollTo(firstElementWithError);
  }
}
