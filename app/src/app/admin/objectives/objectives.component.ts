import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonComponent } from "../../shared/common/common.component";
import { AuthService } from "../../@core/services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { GoalService } from "../../@core/services/goal.service";
import { addGoalComponent } from "../../shared/add-goal/add-goal.component";
import { ObjectivesModalComponent } from "../../shared/objectives-modal/objectives-modal.component";

@Component({
  selector: "ngx-objectives",
  templateUrl: "./objectives.component.html",
  styleUrls: ["./objectives.component.scss"],
})
export class ObjectivesComponent implements OnInit, OnDestroy {
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
  deleteGoal(data) {
    console.log({ deleteGoal: data });

    const activeModal = this.ngbModal.open(CommonComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.anyVariable = data.goals;
    activeModal.componentInstance.id = data.id;
    activeModal.componentInstance.frontEnddata = data;
    activeModal.componentInstance.model = "goals";
    activeModal.componentInstance.endpoint = "put";
    activeModal.componentInstance.apiName = "deleteGoals";
    activeModal.componentInstance.headerTitle = "Delete Goal";
    activeModal.componentInstance.bodyContent = "Deleting: ";
    activeModal.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Deleting ${receivedEntry.data?.username || data.username}`,
              receivedEntry.message
            ),
            this.getGoals(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Deleting ${receivedEntry.data?.goal || "failed"}`,
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

  objectivesModal(id: string) {
    console.log({ objectivesModal: id });
    const activeModal = this.ngbModal.open(ObjectivesModalComponent, {
      size: "xl",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.id = id;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getGoalSubscription.unsubscribe();
  }
}
