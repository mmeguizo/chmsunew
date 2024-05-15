import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonComponent } from "../../shared/common/common.component";
import { AuthService } from "../../@core/services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { GoalService } from "../../@core/services/goal.service";
import { addGoalComponent } from "../../shared/add-goal/add-goal.component";

@Component({
  selector: "ngx-objectives",
  templateUrl: "./objectives.component.html",
  styleUrls: ["./objectives.component.scss"],
})
export class ObjectivesComponent implements OnInit {
  displayedColumns: string[] = [
    "#",
    "goals",
    "budget",
    "createdBy",
    "createdAt",
    "options",
  ];
  dataSource: any;

  data: any;
  loading = true;

  private getGoalSubscription = new Subject<void>();
  constructor(
    public goal: GoalService,
    public auth: AuthService,
    public ngbModal: NgbModal,
    public add_goal_modal: addGoalComponent
  ) {}

  ngOnInit() {
    this.getGoals();
  }

  getGoals() {
    this.goal
      .getRoute("get", "goals", "getAllGoals")
      .pipe(takeUntil(this.getGoalSubscription))
      .subscribe((data: any) => {
        this.data = data.goals;
        console.log(this.data);
        this.dataSource = new MatTableDataSource(data.goals);
        this.loading = false;
      });
  }

  addGoals() {
    const activeModal = this.ngbModal.open(addGoalComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.buttonStatus = "success";
    activeModal.componentInstance.buttonTxt = "add";
    activeModal.componentInstance.action = "add";
    activeModal.componentInstance.updateGoal = false;
    activeModal.componentInstance.goalData = {
      endpoint: "post",
      apiName: "addGoals",
      model: "goals",
    };
    //
    activeModal.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Adding ${receivedEntry.data?.goal}`,
              receivedEntry.message
            ),
            this.getGoals(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Adding ${receivedEntry.data?.goal || "failed"}`,
              receivedEntry.message
            ),
          ];
    });
  }

  updateGoal(data: any) {
    console.log(data);

    const activeModal = this.ngbModal.open(addGoalComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.buttonStatus = "success";
    activeModal.componentInstance.buttonTxt = "update";
    activeModal.componentInstance.action = "update";
    activeModal.componentInstance.updateGoal = true;
    activeModal.componentInstance.passedData = data;
    activeModal.componentInstance.goalData = {
      apiName: "updateGoals",
      endpoint: "put",
      model: "goals",
      id: data.id,
      _id: data._id,
      data: data,
    };
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Updating ${receivedEntry.data?.username}`,
              receivedEntry.message
            ),
            this.getGoals(),
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
  deleteGoal(person) {
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
    activeModal.componentInstance.apiName = "setInactiveGoal";
    activeModal.componentInstance.headerTitle = "Delete Goal";
    activeModal.componentInstance.bodyContent = "Deleting";
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Deleting ${receivedEntry.data?.username || person.username}`,
              receivedEntry.message
            ),
            this.getGoals(),
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
    activeModal.componentInstance.apiName = "changeGoalStatus";
    activeModal.componentInstance.headerTitle = "Status Change";
    activeModal.componentInstance.bodyContent = "Changing Status of";
    activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      receivedEntry && [
        this.auth.makeToast(
          "success",
          "Changing Status Success",
          `Status change ${person.username}`
        ),
        this.getGoals(),
      ];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getGoalSubscription.unsubscribe();
  }
}
