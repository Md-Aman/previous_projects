import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorText: string = "Something happend wrong please try again";
  loginForm: FormGroup;
  ages = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router) {

  }
  // "../node_modules/bootstrap/dist/js/bootstrap.js"
  ngOnInit() {
    console.log("name :", this.userService.name);

    this.buildLoginForm();
    this.generateNumber();

  }

  generateNumber() {
    for (let i = 10; i < 100; i++) {
      this.ages.push({ number: i });
    }
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      FirstName: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Age: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]],
    });
  }

  onSubmit(inputValue) {
    // if (this.loginForm.valid) {
      console.log("values :", inputValue);

      this.userService.createNewUser(inputValue).subscribe((response: any) => {
        console.log("respon :", response);
        if (response.code === 200) {
          console.log("Success status:", response.message);
          this.toastrService.success(response.message, 'Success:', { enableHtml: true });
          this.router.navigate(['/login'])
        } else {
          this.toastrService.warning(response.message, 'Warning:', { enableHtml: true });
        }
      }, error => {
        this.toastrService.warning(this.errorText, 'Warning:', { enableHtml: true });
      });
    // }
  }


  signIn(){
    this.router.navigate(['/login']);
  }
}
