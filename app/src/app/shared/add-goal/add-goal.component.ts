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
import { GoalService } from "../../@core/services/goal.service";

@Component({
  selector: "ngx-add-goal",
  templateUrl: "./add-goal.component.html",
  styleUrls: ["./add-goal.component.scss"],
})
export class addGoalComponent implements OnInit {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();

  private goalData: any;
  public buttonStatus: String = "primary";
  public buttonTxt: String = "action";
  public action: String = "action to perform in";
  public form: any;
  public id: String;
  selected: String;
  eyeIcon: string = "eye-off-outline";
  public passedData: any;
  public updateGoal: Boolean;
  loadingMediumGroup = false;
  private createdBy: string = "";
  updatedBy: string;
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
    this.createdBy = this.auth.getTokenUserID();
    this.updatedBy = this.auth.getTokenUserID();
    console.log(this.createdBy);
    console.log(this.updatedBy);

    console.log("add document component", this.goalData);
    console.log("add document component", this.passedData);
    console.log("add document component", this.updateGoal);
    this.createForm(this.passedData?.goals || "", this.passedData?.budget || 0);
  }

  createForm(goals: any, budget?: number) {
    this.form = this.formBuilder.group({
      goals: [goals || "", [Validators.required]],
      budget: [budget || "", [Validators.required]],
    });
    //initializing form blank if nothing is passed
    if (!goals) {
      this.form.get("goal")?.setErrors(null);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  executeAction(form) {
    // this.form.value.id = this.passedData ? this.passedData.id : null;

    //if update is true then createBy and id will be passed to updateGoal
    this.updateGoal
      ? [
          (this.form.value.updatedBy = this.updatedBy),
          (this.form.value.id = this.passedData?.id),
        ]
      : [(this.form.value.createdBy = this.createdBy)];

    console.log(this.form.value);

    console.log(
      this.goalData.endpoint,
      this.goalData.model,
      this.goalData.apiName,
      this.form.value
    );

    this.documentService
      .getRoute(
        this.goalData.endpoint,
        this.goalData.model,
        this.goalData.apiName,
        this.form.value
      )
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.loadingMediumGroup = true;
        data.success
          ? [
              (this.loadingMediumGroup = false),
              this.passEntry.emit(data),
              this.activeModal.close(),
            ]
          : [(this.loadingMediumGroup = false), this.passEntry.emit(data)];
      });
  }
}
