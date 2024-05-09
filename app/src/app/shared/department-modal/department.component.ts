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
import { UserService } from "../../@core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CustomerService } from "../../@core/services/customer.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "../../@core/services/department.service";
import { MatTableDataSource } from "@angular/material/table";
import { addDocumentComponent } from "../add-document-modal/add-document.component";

@Component({
  selector: "ngx-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
})
export class DepartmentComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  @Input() modalService: NgbModal;

  displayedColumns: string[] = ["#", "department", "options"];

  private getSubscription = new Subject<void>();

  public headerTitle: string;
  public bodyContent: string;

  public frontEnddata;
  public username: string;
  public anyVariable: string;

  public id: string;
  public data;
  public model: string;
  public apiName: string;
  public endpointType: string;
  loading: boolean = true;
  dataSource: any;
  constructor(
    public auth: AuthService,
    public activeModal: NgbActiveModal,
    public ngbModal: NgbModal,
    private DepartmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    console.log("department component");
    this.getAllDept();
  }

  getAllDept() {
    this.DepartmentService.getRoute("get", "department", "getAllDepartment")
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        console.log({ getAllDept: data });
        this.dataSource = new MatTableDataSource(data.department);
        this.loading = false;
        // this.passEntry.emit(data);
        // this.activeModal.close();
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getSubscription.unsubscribe();
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
    activeModal.componentInstance.updateDocument = false;
    activeModal.componentInstance.DocumentData = {
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
            this.getAllDept(),
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

  updateDocument(id: string) {
    console.log("update document", id);
  }

  deleteDocument(id: string) {
    console.log("delete document", id);
  }
}

/*

this.DepartmentService
      .getRoute(this.endpointType, this.apiName, this.frontEnddata)
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.passEntry.emit(data);
        this.activeModal.close();
      });

*/
