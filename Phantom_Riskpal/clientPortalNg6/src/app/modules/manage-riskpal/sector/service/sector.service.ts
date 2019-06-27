import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@app/core/guards/auth.service";
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  constructor(public http: HttpClient, private authService: AuthService) { }
  getAllSector(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllSector', data);
  }
  getSingleSector(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getSectorData/' + id);
  }
  
  save(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/addSector', data);
  }
  update(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateSector', data);
  }

  delete(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deletesector/' + id);
  }
}
