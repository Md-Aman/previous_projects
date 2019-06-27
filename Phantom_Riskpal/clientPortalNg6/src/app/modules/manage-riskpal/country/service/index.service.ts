import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(public http: HttpClient) { }
  getAllCountry(data) {
    return this.http
      .get( environment.baseUrl + 'traveller/getCountryList');
  }
  getSingleCountry(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/country/threat-rating/' + id);
  }

  save(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/addSector', data);
  }
  update(data) {
    return this.http
      .put( environment.baseUrl + 'super_admin/saveCountryThreatMatrixAndRating', data);
  }

  delete(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deletesector/' + id);
  }
}
