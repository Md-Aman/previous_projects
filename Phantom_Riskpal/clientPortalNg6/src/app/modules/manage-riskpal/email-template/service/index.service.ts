import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@app/core/guards/auth.service";
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(public http: HttpClient, private authService: AuthService) { }
  getAll(data) {
    return this.http
      .post( environment.baseUrl + 'admin/emailTemplate', data);
  }
  getSingle(id) {
    return this.http
      .get( environment.baseUrl + 'admin/emailTemplate/' + id);
  }
 
  save(data) {
    return this.http
      .post( environment.baseUrl + 'admin/emailTemplate/save', data);
  }
  update(data) {
    return this.http
      .put( environment.baseUrl + 'admin/emailTemplate', data);
  }

  
}
