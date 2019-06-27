import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://localhost:3000/';
  name: string = "This is name";

  currentUser: any = null;

  constructor(public http: HttpClient) { }


  setUser(data) {
    sessionStorage.setItem('User', JSON.stringify(data));
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('User'));
  }

  removeUser() {
    sessionStorage.clear();
  }

  createNewUser(userData) {
    return this.http
      .post(this.baseUrl + 'shared/signup', userData);
  }
  userLogin(userData) {
    return this.http
      .post(this.baseUrl + 'shared/userLogin', userData);
  }
}
