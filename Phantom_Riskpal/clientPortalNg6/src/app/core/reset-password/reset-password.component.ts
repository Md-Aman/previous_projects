import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../core/services/user.service';
import { ToastarService } from './../../shared/services/toastr/toastar.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    public userService: UserService,
    public toastarService: ToastarService,
    private route: ActivatedRoute,
    private router:Router) { }

  token: string;
  valid: boolean = true;
  public loading = false;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get("id");
      if(this.token != undefined){
        this.loading = true;
        this.verifyToken(this.token);
      }
    });


    this.resetPasswordForm = this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/
      )]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  verifyToken(token){
    let passwordData = {
      "emailToken": token,
      "type": "emailTokenVerification"
    }
    this.userService.resetPassword(passwordData).subscribe(
      (response: any) => {
        if (response.code == 200) {
          this.valid = true;
          this.loading = false;
        } else {
          this.valid = false;
          this.loading = false;
        }
      },
      error => {
        this.valid = false;
        this.loading = false;
      }
    )
  }


  resetPassword() {
    this.submitted = true;
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.controls.Password.value === this.resetPasswordForm.controls.ConfirmPassword.value) {
        this.loading = true;
        let passwordData = {
          "password": this.resetPasswordForm.controls.Password.value,
          "c_password": this.resetPasswordForm.controls.ConfirmPassword.value,
          "emailToken": this.token,
          "type": "resetPassowrd"
        }
        this.userService.resetPassword(passwordData).subscribe(
          (response: any) => {
            if (response.code == 200) {
              this.toastarService.showNotification(response.message, 'success');
              this.loading = false;
              this.router.navigate(['login']);
            } else {
              this.toastarService.showNotification(response.err, 'warning');
              this.loading = false;
            }
          },
          error => {
            this.toastarService.showNotification(error.name, 'error');
            this.loading = false;
          }
        )
      } else {
        // this.toastarService.showNotification('Password and confirm password does not match', 'error');
      }

    }
  }
  forgetPass(){
    this.userService.isForgetPass = true;
  }
}
