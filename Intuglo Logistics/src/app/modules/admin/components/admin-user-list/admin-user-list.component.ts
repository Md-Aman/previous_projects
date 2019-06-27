import { AdminApiService } from "./../../services/admin-api.service";
import { Component, OnInit,ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { MatInputModule,MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { SessionStorage } from "../../../models/session-storage";
import { ToastrService } from "ngx-toastr";
import { userManagement } from '@app/modules/models/user-management';

@Component({
  selector: "admin-user-list",
  templateUrl: "./admin-user-list.component.html",
  styleUrls: ["./admin-user-list.component.css"]
})
export class AdminUserListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedUserType: string;
  selectedCountryCode: string;
  selectedUser: any;
  selectedRowIndex: number;
  session = new SessionStorage(); //instance for session
  countryList: any[];
  users = [];
  dataSource;
  dataSourceUserdetails;
  showActiveButton: boolean;
  showInactiveButton: boolean;
  showDownloadDocuments: boolean = false;
  isDownloaded: boolean = false;
  checkboxIndex;
  displayedColumns = ['checkbox','account_name','merchant_id','documents','verified_user'];

  constructor(
    private adminApiService: AdminApiService,
    private toastr: ToastrService
  ) {
    this.selectedRowIndex = -1;
    this.selectedUserType = "1";
  }

  ngOnInit() {
    this.selectedRowIndex = -1;

    // populate country list
    this.adminApiService
      .getAdminUsersCountryList(this.session.loginID, this.session.sessionID)
      .subscribe(countryList => {
        console.log(countryList);
        this.countryList = countryList;
        if (countryList != null) {
          this.selectedCountryCode = countryList[0].country_code;
        }
      });
  }

  onSelectUserType(selectedUserType) {
    this.selectedUserType = selectedUserType;
  }

  // onSelectCountry(selectedCountry) { 
  //   this.selectedCountryCode = selectedCountry;
  // }

  showUsersList() {
    this.adminApiService
      .getAdminUserList(
        this.session.loginID,
        this.session.sessionID,
        String(this.selectedUserType),
        this.selectedCountryCode
      )
      .subscribe(
        userList => {
          console.log(userList);  
          // this.users = Object.values(userList);
          this.users = userList;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.clearSelection();
        },
        error => {
          this.toastr.error(
            "No data available for selected country and user type.",
            "Unsuccessful!",
            {
              closeButton: true,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-top-right"
            }
          );
          this.users = [];
          this.clearSelection();
        }
      );
  }

  getLoginId(event, user, loginID, documentLength) {
    const index = this.users.findIndex(x => x.login_id === loginID);
    if (documentLength > 0) {
      this.showDownloadDocuments = true;
    } else {
      this.showDownloadDocuments = false;
    }
    if (event.checked) {
      this.selectedRowIndex = index;
      this.selectedUser = user;
      this.showActiveButton = !user.verified_user;
      this.showInactiveButton = user.verified_user;
      this.users.forEach(function (user, index) {
        if (index != index) {
          user.checked = false;
        }
      });
    } else {
      this.clearSelection();
    }
  }

  updateSelection(event, loginId, data){
    this.dataSourceUserdetails = data.data;
    this.checkboxIndex = this.users.findIndex(x => x.login_id === loginId);
    this.dataSourceUserdetails.forEach((UserDetails,Index) => {
      if(this.checkboxIndex != Index){
        UserDetails.checked = false;
      }
    })
  }

  clearSelection() {
    //this.selectedUser.checked=false;
    this.selectedRowIndex = -1;
    this.selectedUser = null;
    this.showActiveButton = false;
    this.showInactiveButton = false;
  }

  DownloadDocuments() {
    this.isDownloaded = true;
    this.adminApiService
      .getUserProfileDocuments(this.session.loginID, this.session.sessionID, this.selectedUser.login_id)
      .subscribe(
        url => {
          console.log("success :", url);
          this.isDownloaded = false;
          if (url != null) {
            window.open(url, "_blank");
            // this.display_message = "Document is downloading. Please wait for a moment"
          } else {
            // this.display_message = "Document is not available"
          }
        },
        error => {
          this.isDownloaded = false;
          if (error.status == 400) {
            // this.isPopup = true;
            // this.display_message = this.session_expired;
          }
        }
      );
  }

  onClickActivateUser() {
    //activateUserStatus
    let userVerificationStatus = {
      login_id: String(this.selectedUser.login_id),
      verify_status: 1
    };
    this.adminApiService
      .activateUserStatus(
        this.session.loginID,
        this.session.sessionID,
        userVerificationStatus
      )
      .subscribe(
        response => {
          if (response["status"] == 200) {
            this.selectedUser.verified_user = 1;
            this.showActiveButton = false;
            this.showInactiveButton = true;
            this.toastr.success(
              "Selected user activated successfully!",
              "Successful!",
              {
                closeButton: true,
                progressBar: true,
                progressAnimation: "increasing",
                positionClass: "toast-top-right"
              }
            );
          }
        },
        error => {
          this.toastr.error(
            "Failed to activate selected user!",
            "Unsuccessful!",
            {
              closeButton: true,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-top-right"
            }
          );
        }
      );
  }

  onClickDeactivateUser() {
    let userVerificationStatus = {
      login_id: String(this.selectedUser.login_id),
      verify_status: 0
    };
    this.adminApiService
      .activateUserStatus(
        this.session.loginID,
        this.session.sessionID,
        userVerificationStatus
      )
      .subscribe(
        response => {
          if (response["status"] == 200) {
            this.selectedUser.verified_user = 0;
            this.showActiveButton = true;
            this.showInactiveButton = false;
            this.toastr.success(
              "Selected user deactivated successfully!",
              "Successful!",
              {
                closeButton: true,
                progressBar: true,
                progressAnimation: "increasing",
                positionClass: "toast-top-right"
              }
            );
          }
        },
        error => {
          this.toastr.error(
            "Failed to deactivate selected user!",
            "Unsuccessful!",
            {
              closeButton: true,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-top-right"
            }
          );
        }
      );
  }
}
