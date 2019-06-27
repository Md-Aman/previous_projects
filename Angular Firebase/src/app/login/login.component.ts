import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, private formBuilder: FormBuilder) {
   }

  registerForm: FormGroup;
  submitted = false;

  email: string;
  password: string;

  logIn() {
    this.submitted = true;
    if (!this.registerForm.invalid) {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .catch(function (error) {
        console.log("error :", error);
        var errorCode = error.code;
        var errorMessage = error.message;
      });
      var user = firebase.auth().currentUser.uid;
      var user_email = firebase.auth().currentUser.email;
      localStorage.setItem('userId', user);
      localStorage.setItem('userEmail', user_email);
      if (user != null) {
        this.router.navigate(['dashboard']);
      }
    }

  }

  ngOnInit() {
    if(localStorage.getItem('userId') != null){
      this.router.navigate(['dashboard']);
    }
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() { return this.registerForm.controls; }

}
