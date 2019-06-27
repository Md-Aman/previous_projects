import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './../../core/services/user.service';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from './../../core/guards/auth.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { MatDialog } from "@angular/material";

@Component({
  selector: 'app-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss']
})
export class TimeoutModalComponent implements OnInit, OnDestroy {

  status: any;
  getSatusSubscription: Subscription;
  
  constructor(
    private idle: Idle,
    public dialogRef: MatDialogRef<TimeoutModalComponent>,
    private userService: UserService,
    private router:Router,
    private authService:AuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getSatusSubscription = this.userService.getIdleStatus.subscribe(status => {
      console.log('inside message', status);
      this.status = status;

      if(this.status.active !== true){
        this.idle.stop();
        this.logoutUser();
      }
    });
  }

  logoutUser(){
    this.userService.logout()
      .subscribe(
        data => {
          this.authService.removeUser();
          this.dialog.closeAll();
          this.router.navigate(['/login']);
        },
        error => {

        }
      );
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.getSatusSubscription.unsubscribe();
  }

}
