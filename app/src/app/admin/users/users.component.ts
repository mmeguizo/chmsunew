import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../../@core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonComponent } from "../../shared/common/common.component";
import { AuthService } from "../../@core/services/auth.service";
import { UsersModalComponent } from "../../shared/users-modal/users-modal.component";
import { MatTableDataSource } from "@angular/material/table";

export interface UsersElement {
  _id: string;
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: "ngx-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "#",
    "username",
    "email",
    "role",
    "status",
    "options",
  ];
  dataSource: any;

  data: UsersElement;
  loading = true;

  private getUserSubscription = new Subject<void>();
  constructor(
    public user: UserService,
    public auth: AuthService,
    public ngbModal: NgbModal,
    public user_modal: UsersModalComponent
  ) {}

  ngOnInit() {
    this.getAllUsersInitially();

    //workaround for dark theme for table
  }

  getAllUsersInitially() {
    this.user
      .getAllUsers()
      .pipe(takeUntil(this.getUserSubscription))
      .subscribe((data: any) => {
        this.data = data.user;
        this.dataSource = new MatTableDataSource(data.user);
        console.log(this.data);
        this.loading = false;
      });
  }

  addUser() {
    const activeModal = this.ngbModal.open(UsersModalComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.buttonStatus = "success";
    activeModal.componentInstance.buttonTxt = "add";
    activeModal.componentInstance.action = "add";
    activeModal.componentInstance.updateUser = false;
    activeModal.componentInstance.DocumentData = {
      endpoint: "post",
      apiName: "addUser",
      model: "user",
    };
    //
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Adding ${receivedEntry.data?.username}`,
              receivedEntry.message
            ),
            this.getAllUsersInitially(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Adding ${receivedEntry.data?.username || "failed"}`,
              receivedEntry.message
            ),
          ];
    });
  }

  updateUser(id) {
    const activeModal = this.ngbModal.open(UsersModalComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.buttonStatus = "success";
    activeModal.componentInstance.buttonTxt = "update";
    activeModal.componentInstance.action = "update";
    activeModal.componentInstance.updateUser = true;
    activeModal.componentInstance.userData = {
      endpoint: "post",
      apiName: "findById",
      apiName2: "updateUser",
      endpoint2: "put",
      id: id,
    };
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Updating ${receivedEntry.data?.username}`,
              receivedEntry.message
            ),
            this.getAllUsersInitially(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Updating ${receivedEntry.data?.username || "failed"}`,
              receivedEntry.message
            ),
          ];
    });
  }
  deleteUser(person) {
    const activeModal = this.ngbModal.open(CommonComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.username = person.username;
    activeModal.componentInstance.id = person.id;
    activeModal.componentInstance.frontEnddata = person;
    activeModal.componentInstance.model = "user";
    activeModal.componentInstance.endpointType = "put";
    activeModal.componentInstance.apiName = "setInactiveUser";
    activeModal.componentInstance.headerTitle = "Delete User";
    activeModal.componentInstance.bodyContent = "Deleting";
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Deleting ${receivedEntry.data?.username || person.username}`,
              receivedEntry.message
            ),
            this.getAllUsersInitially(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Deleting ${receivedEntry.data?.username || "failed"}`,
              receivedEntry.message
            ),
          ];
    });
  }
  changeStatus(person) {
    const activeModal = this.ngbModal.open(CommonComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.username = person.username;
    activeModal.componentInstance.id = person.id;
    activeModal.componentInstance.frontEnddata = person;
    activeModal.componentInstance.model = "user";
    activeModal.componentInstance.endpointType = "put";
    activeModal.componentInstance.apiName = "changeUserStatus";
    activeModal.componentInstance.headerTitle = "Status Change";
    activeModal.componentInstance.bodyContent = "Changing Status of";
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry && [
        this.auth.makeToast(
          "success",
          "Changing Status Success",
          `Status change ${person.username}`
        ),
        this.getAllUsersInitially(),
      ];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getUserSubscription.unsubscribe();
  }
}
