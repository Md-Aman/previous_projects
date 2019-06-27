import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { UserFeatureService } from '../service/user-feature.service';
import { ResponseService } from '@shared/services/response-handler/response.service';

@Component({
  selector: 'app-emg-rec-approval',
  templateUrl: './emg-rec-approval.component.html',
  styleUrls: ['./emg-rec-approval.component.scss']
})
export class EmgRecApprovalComponent implements OnInit {
  loading: Boolean = false;
  approvingManagers: any;
  selectedApprovingManager: any;
  reason: String = '';
  reqFor: String = '';
  constructor(private userService: UserFeatureService, private dialogRef: MatDialogRef<EmgRecApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) private data, private responseService: ResponseService) { }

  ngOnInit() {
    this.reqFor = this.data.id;
    this.getEmgApprovingManager();
  }

  getEmgApprovingManager() {
    this.userService.getEmgApprovingManager()
    .subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.approvingManagers = response.data;
        } else {
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
        console.log("error :", error);
        this.responseService.handleErrorResponse(error.error);
      }
    );
  }
  closeDialog() {
    this.dialogRef.close();
  }
  askForApproval() {
    const selectedApprovingManager = this.selectedApprovingManager;
    this.userService.askForApproval({approvingManager: selectedApprovingManager._id, reqFor: this.reqFor, reason: this.reason})
    .subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.approvingManagers = response.data;
          this.closeDialog();
          this.responseService.hanleSuccessResponse({
            message: 'Your request sent to Approving manager, please wait for approval.'
          });
        } else {
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
        console.log("error :", error);
        this.responseService.handleErrorResponse(error.error);
      }
    );
  }

}
