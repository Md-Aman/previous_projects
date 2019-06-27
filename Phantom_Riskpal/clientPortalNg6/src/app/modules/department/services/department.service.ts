import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private subject = new Subject<any>();

  departmentId: string;
  constructor(public http: HttpClient) { }

  
  getUsers(clientId) {
    return this.http
      .post(environment.baseUrl + 'super_admin/getUsers_trackconnect', clientId);
  }
  getTemplates() {
    return this.http
      .get(environment.baseUrl + 'super_admin/getTemplates');
  }
  saveDepartment(department_data) {
    return this.http
      .post(environment.baseUrl + 'super_admin/saveDepartment', department_data );
  }
  getAllDepartment(departmentData) {
    return this.http
      .post(environment.baseUrl + 'super_admin/getAllDepartment', departmentData );
  }
  deleteDepartment(departmentId) {
    return this.http
      .get(environment.baseUrl + 'admin/deleteDepartment/' + departmentId );
  }
  getDepartment(departmentId) {
    return this.http
      .get(environment.baseUrl + 'admin/getDepartmentDetail/' + departmentId );
  }
  getRelatedTemplate(departmentId) {
    return this.http
      .get(environment.baseUrl + 'super_admin/getRelatedTemplate/' + departmentId );
  }
  getRelatedUser(departmentId) {
    return this.http
      .get(environment.baseUrl + 'super_admin/getRelatedUser/' + departmentId );
  }
  updateDepartment(departmentData) {
    return this.http
      .post(environment.baseUrl + 'admin/updateDepartment', departmentData );
  }

  setUpdateDepartmentList() {
    this.subject.next({});
  }
  getUpdateDepartmentList(): Observable<any> {
    return this.subject.asObservable();
  }
  getAllClients() {
    return this.http
    .get( environment.baseUrl + 'super_admin/getAllClients');
  }
}
