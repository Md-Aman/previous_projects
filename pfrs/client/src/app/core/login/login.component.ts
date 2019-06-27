import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorText: string = "Something happend wrong please try again";
  signUpForm: FormGroup;
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
    this.signUpForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]],
      Password: ['', [Validators.required]],
    });
  }

  onSubmit(inputValue) {
    if (this.signUpForm.valid) {
      this.userService.userLogin(inputValue).subscribe((response: any) => {
        if (response.code === 200) {
          this.userService.setUser(response.data);
          this.toastrService.success(response.message, 'Success:', { enableHtml: true });
          this.router.navigate(['/dashboard']);
        } else {
          this.toastrService.warning(response.message, 'Warning:', { enableHtml: true });
        }
      }, error => {
        this.toastrService.warning(this.errorText, 'Warning:', { enableHtml: true });
      })
    }
  }


  signUp(){
    this.router.navigate(['/signup']);
  }

}
