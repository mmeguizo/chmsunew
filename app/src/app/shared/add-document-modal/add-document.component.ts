import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../@core/services/auth.service";
import { UserService } from "../../@core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CustomerService } from "../../@core/services/customer.service";
import { FormBuilder, Validators } from "@angular/forms";
import { log } from "console";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentComponent } from "../department-modal/department.component";
import { DepartmentService } from "../../@core/services/department.service";

@Component({
  selector: "ngx-add-document",
  templateUrl: "./add-document.component.html",
  styleUrls: ["./add-document.component.scss"],
})
export class addDocumentComponent implements OnInit {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();

  private DepartmentData: any;
  public buttonStatus: String = "primary";
  public buttonTxt: String = "action";
  public action: String = "action to perform in";
  public form: any;
  public showpassword: Boolean = false;
  public id: String;
  selected: String;
  eyeIcon: string = "eye-off-outline";
  public passedData: any;

  constructor(
    public auth: AuthService,
    public user: UserService,
    public customer: CustomerService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public ngbModal: NgbModal,
    public department_modal: DepartmentComponent,
    private documentService: DepartmentService
  ) {}

  ngOnInit(): void {
    console.log("add document component", this.DepartmentData);
    this.createForm(this.passedData?.department || "");
  }

  createForm(string: any) {
    this.form = this.formBuilder.group({
      department: [string || "", [Validators.required]],
    });
    //initializing form blank if nothing is passed
    if (!string) {
      this.form.get("department")?.setErrors(null);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  executeAction(form) {
    this.form.value.id = this.passedData ? this.passedData.id : null;
    console.log(this.form.value);

    console.log(
      this.DepartmentData.endpoint,
      this.DepartmentData.model,
      this.DepartmentData.apiName,
      this.form.value
    );

    this.documentService
      .getRoute(
        this.DepartmentData.endpoint,
        this.DepartmentData.model,
        this.DepartmentData.apiName,
        this.form.value
      )
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        data.success
          ? [this.passEntry.emit(data), this.activeModal.close()]
          : this.passEntry.emit(data);
      });
  }
}
