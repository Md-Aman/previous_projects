import { Injectable } from '@angular/core';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {RequestOptions, Headers} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  currentUser: any = null;
  permission:any = null;

  private LoaderFlag = new BehaviorSubject('');
  getLoaderFlag = this.LoaderFlag.asObservable();
  
  setLoaderFlag(status: any) {
    this.LoaderFlag.next(status);
  }

  constructor(public http: HttpClient) {

  }

  setPermission(permission){
    this.permission = permission;
  }
  getPermission(){
    return this.permission; 
  }
  setUser(data) {
    let stringUser = null;
    stringUser = JSON.stringify(data);
    this.currentUser = stringUser;
    localStorage.setItem('currentUser', stringUser);
  }
  removeUser() {
    localStorage.clear();
    sessionStorage.clear();
  }
  getUser() {
    if (this.currentUser) {
      return JSON.parse(this.currentUser);
    } else {
      const localData = localStorage.getItem('currentUser');
      this.currentUser = localData;
      const userData = localData ? JSON.parse(localData) : {};
      return userData;
    }
  }
  getHeaders(contentType) {
    const currentUser = this.getUser();
    const authToken = currentUser.token;
    const headers = new Headers();
    if ( contentType === 'json' ) {
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
    }
    headers.append('Authorization', authToken);
    return {headers: headers};
  }
  setSessionStorage(key, data) {
    let string = null;
    string = JSON.stringify(data);
    sessionStorage.setItem(key, string);
  }
  getSessionStorage(key) {
    return sessionStorage.getItem(key);
  }
  removeSessionStorage(key) {
    sessionStorage.setItem(key, '');
  }
  checkMenuSecurity(parent, childKey) {
    const roles = this.getPermission().roleId;
    if ( this.getPermission().super_admin ) {
      return true;
    }
    if ( typeof roles[parent] === 'object' && ( roles[parent][childKey] === '1' || roles[parent][childKey] === 'true') ) {
      return true;
    }
    return false;
  }

  checkUser(){
    return this.http
    .get(environment.baseUrl + 'super_admin/checkLogin');
  }

}
