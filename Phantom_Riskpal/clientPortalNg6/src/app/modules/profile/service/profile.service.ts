import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@app/core/guards/auth.service";
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(public http: HttpClient, private authService: AuthService) { }
  checkPassword(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/checkPassword', data);
  }

  update(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/changePassword', data);
  }
}
