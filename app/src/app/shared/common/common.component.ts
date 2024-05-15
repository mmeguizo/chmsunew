import {
  Component,
  OnInit,
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
import { DepartmentService } from "../../@core/services/department.service";

@Component({
  selector: "ngx-common",
  templateUrl: "./common.component.html",
  styleUrls: ["./common.component.scss"],
})
export class CommonComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();

  public headerTitle;
  public bodyContent;

  public frontEnddata;
  public username;
  public anyVariable;
  DepartmentData: any;
  passedData: any;
  public id;
  public data;
  public model;
  public apiName;
  public endpointType;

  constructor(
    public auth: AuthService,
    public user: UserService,
    public customer: CustomerService,
    public activeModal: NgbActiveModal,
    private DepartmentService: DepartmentService
  ) {}

  ngOnInit(): void {}

  runQuery() {
    if (this.model && this.model === "user") {
      this.user
        .getRoute(this.endpointType, this.apiName, this.frontEnddata)
        .pipe(takeUntil(this.getSubscription))
        .subscribe((data: any) => {
          this.passEntry.emit(data);
          this.activeModal.close();
        });
    } else if (this.model && this.model === "fileupload") {
      this.user
        .getRoute(this.endpointType, this.apiName, this.frontEnddata)
        .pipe(takeUntil(this.getSubscription))
        .subscribe((data: any) => {
          this.passEntry.emit(data);
          this.activeModal.close();
        });
    } else if (this.model && this.model === "department") {
      this.DepartmentService.getRoute(
        this.DepartmentData.endpoint,
        this.DepartmentData.model,
        this.DepartmentData.apiName,
        this.passedData
      )
        .pipe(takeUntil(this.getSubscription))
        .subscribe((data: any) => {
          // { acknowledged: true, deletedCount: 1
          console.log(data);
          data.success
            ? [this.passEntry.emit(data), this.activeModal.close()]
            : this.passEntry.emit(data);
        });
    } else {
      this.logout();
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getSubscription.unsubscribe();
  }
}
