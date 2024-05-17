import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../@core/services/auth.service";
import { UserService } from "../../@core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CustomerService } from "../../@core/services/customer.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { log } from "console";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentComponent } from "../department-modal/department.component";
import { DepartmentService } from "../../@core/services/department.service";
@Component({
  selector: "ngx-users-modal",
  templateUrl: "./users-modal.component.html",
  styleUrls: ["./users-modal.component.scss"],
})
export class UsersModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();

  private userData: any;
  public buttonStatus: String = "primary";
  public buttonTxt: String = "action";
  public action: String = "action to perform in";
  public form: any;
  public showpassword: Boolean = false;
  public id: String;
  public _id: String;
  public updateUser: Boolean;
  selected: String;
  eyeIcon: string = "eye-off-outline";
  department: any;

  constructor(
    public auth: AuthService,
    public user: UserService,
    public customer: CustomerService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public ngbModal: NgbModal,
    public department_modal: DepartmentComponent,
    private documentService: DepartmentService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.buttonTxt === "update" ? this.getUser(this.userData.id) : "";
    this.showpassword = false;
    this.getAllDepartment();
  }
  getAllDepartment() {
    this.documentService
      .getRoute("get", "department", "getAllDepartment")
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        console.log({ getAllDept: data });
        this.department = data.department;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ["", [Validators.required]],
      email: [
        "",

        [
          Validators.required,
          Validators.email,
          Validators.pattern("^.+@chmsu.edu.ph$"),
        ],
      ],
      department: ["", [Validators.required]],
      password: ["", [Validators.required]],
      // role:     ['', [Validators.required]],
      confirm: ["", [Validators.required]],
    });
  }

  getErrorMessage(formControlName: string) {
    if (this.form.get(formControlName)?.hasError("required")) {
      return "You must enter a value.";
    } else if (this.form.get(formControlName)?.hasError("email")) {
      return "Please enter a valid email address.";
    } else if (this.form.get(formControlName)?.hasError("pattern")) {
      return "Only Chmsu addresses (chmsu.edu.ph) are accepted.";
    }
    return "";
  }

  closeModal() {
    this.activeModal.close();
  }

  getUser(id) {
    this.user
      .getRoute("post", this.userData.model, "findById", { id: id })
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.selected = data.user.department;
        console.log(data.user.department);
        this.form = this.formBuilder.group({
          username: [data.user.username, [Validators.required]],
          email: [data.user.email, [Validators.required]],
          // role:     [data.user.role, [Validators.required]],
          password: ["", [Validators.required]],
          department: new FormControl(data.user.department),
          confirm: ["", [Validators.required]],
        });
        this.form.get("department").setValue(data.user.department);
        // data.success ? [this.passEntry.emit(data) , this.activeModal.close()] : this.passEntry.emit(data)
      });
  }

  /*
   <nb-select
              formControlName="department"
              (ngModelChange)="editDept($event)"
              [selected]="selected"
            >
              <nb-option value="editDept" style="color: greenyellow">
                --Manage/Edit Dept--
              </nb-option>
              <nb-option
                *ngFor="let dept of department"
                [value]="dept.department"
                [nbTooltip]="dept.department | titlecase"
                nbTooltipPlacement="top"
                >{{
                  (dept.department.length > 20
                    ? (dept.department | slice : 0 : 20) + "..."
                    : dept.department
                  ) | titlecase
                }}</nb-option
              >
            </nb-select>

  */

  executeAction(form) {
    this.form.value._id = this.userData._id || "";
    this.form.value.id = this.userData.id || "";
    this.user
      .getRoute(
        this.userData.endpoint,
        this.userData.model,
        this.userData.apiName,
        this.form.value
      )
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        data.success
          ? [this.passEntry.emit(data), this.activeModal.close()]
          : this.passEntry.emit(data);
      });
  }

  showPassword() {
    if (this.showpassword == true) {
      this.showpassword = false;
      this.eyeIcon = "eye-off-outline";
    } else {
      this.showpassword = true;
      this.eyeIcon = "eye-outline";
    }
  }

  editDept(e: string) {
    if (e === "editDept") {
      const activeModal = this.ngbModal.open(DepartmentComponent, {
        size: "medium",
        container: "nb-layout",
        windowClass: "min_height",
      });
      activeModal.componentInstance.buttonStatus = "success";
      activeModal.componentInstance.buttonTxt = "add";
      activeModal.componentInstance.action = "add";
      activeModal.componentInstance.updateUser = false;
      activeModal.componentInstance.DocumentData = {
        endpoint: "post",
        apiName: "addUser",
        model: "department",
      };
      activeModal.componentInstance.passEntry.subscribe(
        (receivedEntry: any) => {
          receivedEntry && this.getAllDepartment();
        }
      );
    }
  }
}
