import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastarService } from '../../shared/services/toastr/toastar.service';
import { ActivatedRoute, Router} from '@angular/router';
import { ErrorMessage } from "ng-bootstrap-form-validation";

@Component({
  selector: 'activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    public userService: UserService,
    public toastarService: ToastarService,
    private route: ActivatedRoute,
    private router:Router) { }

  user_id: string;
  public loading = false;


  customErrorMessages: ErrorMessage[] = [
    {
      error: 'minlength',
      format: (label, error) => `Please select minimum 6 characters`
    },
    {
      error: 'pattern',
      format: (label, error) => ` `
    }
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.user_id = params.get("id")
    })

    this.resetPasswordForm = this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/
      )]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      // mobile_number: ['', [ Validators.required ]]
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  submit() {
    this.submitted = true;
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.controls.Password.value === this.resetPasswordForm.controls.ConfirmPassword.value) {
        this.loading = true;
        const passwords = {
          password: this.resetPasswordForm.controls.Password.value,
          c_password: this.resetPasswordForm.controls.ConfirmPassword.value,
          hashcode: this.user_id,
          // mobile_number: this.resetPasswordForm.value.mobile_number.replace('+', '')
        };
        this.userService.activateAccount(passwords).subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.toastarService.showNotification(response.message, 'success');
              this.loading = false;
              this.router.navigate(['login']);
            } else {
              this.toastarService.showNotification(response.message, 'info');
              this.loading = false;
              setTimeout(()=>{ 
                this.router.navigate(['login']); 
              }, 3000);
            }
          },
          error => {
            this.toastarService.showNotification(error.message, 'error');
            this.loading = false;
          }
        );
      } else {
        this.toastarService.showNotification('Password and confirm password does not match', 'error');
      }

    }
  }
}
