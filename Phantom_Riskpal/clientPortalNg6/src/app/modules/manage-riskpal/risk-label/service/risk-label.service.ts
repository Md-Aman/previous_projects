import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@app/core/guards/auth.service";
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiskLabelService {

  constructor(public http: HttpClient, private authService: AuthService) { }
  getAllRiskLabel(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllCategories', data);
  }
  getAllSectors() {
    return this.http
      .get( environment.baseUrl + 'super_admin/getAllSectors');
  }
  getSingleCategory(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getCategoryDetails/' + id);
  }
  save(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/addCategory', data);
  }
  update(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateCategory', data);
  }

  delete(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deleteCategory/' + id);
  }
}
