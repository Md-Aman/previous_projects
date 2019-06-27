import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@app/core/guards/auth.service";
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(public http: HttpClient, private authService: AuthService) { }
  getAllClient(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllNewsAgencies', data);
  }
  getSingleClient(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getNewsAgencyDetails/' + id);
  }
  getPreLoadData () {
    const source = [this.http.get(environment.baseUrl + 'super_admin/getAllCountries' ),
      this.http.get(environment.baseUrl + 'super_admin/getAllSectors' )];
      return forkJoin(...source );
  }
  save(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/saveNewClient', data);
  }
  update(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateNewsAgency', data);
  }

  delete(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deleteNewsAgency/' + id);
  }
}
