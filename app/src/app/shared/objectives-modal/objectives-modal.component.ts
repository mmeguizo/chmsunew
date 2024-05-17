import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../@core/services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "../../@core/services/department.service";
import { MatTableDataSource } from "@angular/material/table";
import { addDocumentComponent } from "../add-document-modal/add-document.component";
import { CommonComponent } from "../common/common.component";
import { ObjectiveService } from "../../@core/services/objective.service";

@Component({
  selector: "ngx-objectives-modal",
  templateUrl: "./objectives-modal.component.html",
  styleUrls: ["./objectives-modal.component.scss"],
})
export class ObjectivesModalComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  @Input() modalService: NgbModal;

  displayedColumns: string[] = [
    "#",
    "functional_objective",
    "performance_indicator",
    "target",
    "formula",
    "programs",
    "department",
    "responsible_persons",
    "clients",
    "timetable",
    "frequency_monitoring",
    "data_source",
    "budget",
    "createdAt",
    "options",
  ];

  private getSubscription = new Subject<void>();

  public id: string;
  public data: any;
  public model: string;
  loading: boolean = true;
  dataSource: any;
  constructor(
    public auth: AuthService,
    public activeModal: NgbActiveModal,
    public objective: ObjectiveService,
    public ngbModal: NgbModal,
    private DepartmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    console.log("department component");
    this.getAllObjectives(this.id);
  }

  getAllObjectives(id: any) {
    console.log("getAllObjectivesid", id);

    this.objective
      .getRoute("get", "objectives", `getAllByIdObjectives/${id}`)
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.data = data.Objectives;
        this.dataSource = new MatTableDataSource(data.Objectives);
        this.loading = false;
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getSubscription.unsubscribe();
    this.passEntry.emit("close");
  }

  addDepartment() {
    console.log("add department");
    const activeModal = this.ngbModal.open(addDocumentComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
    });
    activeModal.componentInstance.buttonStatus = "success";
    activeModal.componentInstance.buttonTxt = "add";
    activeModal.componentInstance.action = "add";
    activeModal.componentInstance.DepartmentData = {
      endpoint: "post",
      apiName: "addDepartment",
      model: "department",
    };
    activeModal.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Adding ${receivedEntry.data?.department}`,
              receivedEntry.message
            ),
            // this.getAllDept(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Adding ${receivedEntry.data?.department || "failed"}`,
              receivedEntry.message
            ),
          ];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateDepartment(department: any) {
    console.log("update DepartmentData", department);

    const activeModal = this.ngbModal.open(addDocumentComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
    });
    activeModal.componentInstance.buttonStatus = "success";
    activeModal.componentInstance.buttonTxt = "submit";
    activeModal.componentInstance.action = "edit";
    activeModal.componentInstance.passedData = department;
    activeModal.componentInstance.DepartmentData = {
      endpoint: "put",
      apiName: "updateDepartment",
      model: "department",
    };
    activeModal.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              `Adding ${receivedEntry.data?.department}`,
              receivedEntry.message
            ),
            // this.getAllDept(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Adding ${receivedEntry.data?.department || "failed"}`,
              receivedEntry.message
            ),
          ];
    });
  }

  deleteDepartment(data: any) {
    console.log("delete DepartmentData", data);

    const activeModal = this.ngbModal.open(CommonComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
    });
    activeModal.componentInstance.DepartmentData = {
      endpoint: "put",
      apiName: "deleteDepartment",
      model: "department",
    };
    activeModal.componentInstance.apiName = "setInactiveDepartment";
    activeModal.componentInstance.endpoint = "put";
    activeModal.componentInstance.frontEnddata = data;
    activeModal.componentInstance.model = "department";
    activeModal.componentInstance.anyVariable = data.department;
    activeModal.componentInstance.headerTitle = "Delete";
    activeModal.componentInstance.bodyContent = "Deleting";
    activeModal.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      receivedEntry.success
        ? [
            this.auth.makeToast(
              "success",
              "Deleting Success",
              `Done Deleting ${receivedEntry.data}`
            ),
            // this.getAllDept(),
          ]
        : [
            this.auth.makeToast(
              "danger",
              `Deleting ${receivedEntry.data || "failed"}`,
              "Error Deleting " + receivedEntry.data
            ),
          ];
    });
  }
}
