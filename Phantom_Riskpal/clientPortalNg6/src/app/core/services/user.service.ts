import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) { }

  isForgetPass: boolean = false;
  private subjectIdle = new BehaviorSubject('');
  getIdleStatus = this.subjectIdle.asObservable();
  
  setStatus(status: any) {
    console.log('transmitted status', status);
    this.subjectIdle.next(status);
  }

  getUser(user) {
    return this.http
      .post(environment.baseUrl + 'super_admin/superAdminLogin', user);
  }

  verify2FA(auth_code) {
    return this.http
      .post(environment.baseUrl + "traveller/verify", auth_code);
  }
  sendSmsToken(email) {
    return this.http
      .post(environment.baseUrl + "traveller/sms", email);
  }
  sendVoiceToken(email) {
    return this.http
      .post(environment.baseUrl + "traveller/voice", email);
  }
  sendOTVerification(email) {
    return this.http
      .post(environment.baseUrl + "traveller/onetouch", email);
  }
  checkOTVerification(email) {
    return this.http
      .post(environment.baseUrl + "traveller/checkonetouchstatus", email);
  }
  forgotPassword(email) {
    return this.http
      .post(environment.baseUrl + "super_admin/superAdminForgetPass", email);
  }
  resetPassword(passwordData) {
    return this.http
      .post(environment.baseUrl + "super_admin/superAdminResetPass", passwordData);
  }
  submitAccessStatus(data) {
    return this.http
      .patch(environment.baseUrl + "super_admin/accessEmergencyInfoApprovalStatus", data);
  }
  activateAccount ( data ) {
    return this.http
      .post(environment.baseUrl + "super_admin/userActivate", data);
  }
  logout() {
    return this.http
      .get( environment.baseUrl + 'super_admin/superAdminLogout');
  }

  getAllClients() {
    return this.http
    .get( environment.baseUrl + 'super_admin/getAllClients');
  }
  getAllCountries() {
    return this.http
    .get( environment.baseUrl + 'super_admin/getCountries');
  }

  getDepartmentUsers(id) {
    return this.http
    .get( environment.baseUrl + 'super_admin/getDepartmentusers/' + id );
  }

}
