import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(public http: HttpClient) { }
  getAllCategory(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllRiskAssociatedCategories', data);
  }
  getAllCountries () {
    return this.http
      .get( environment.baseUrl + 'super_admin/getCountries');
  }
  getSingleCategory(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getRiskAssociatedCategoryDetails/' + id);
  }

  save(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/addRiskAssociatedCategory', data);
  }
  update(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateRiskAssociatedCategory', data);
  }

  delete(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deleteRiskAssociatedCategory/' + id);
  }
}
