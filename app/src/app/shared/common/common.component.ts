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
import { GoalService } from "../../@core/services/goal.service";

@Component({
  selector: "ngx-common",
  templateUrl: "./common.component.html",
  styleUrls: ["./common.component.scss"],
})
export class CommonComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();

  public headerTitle: string;
  public bodyContent: string;

  public frontEnddata: any;
  public username: string;
  public anyVariable: any;
  DepartmentData: any;
  passedData: any;
  public id: any;
  public data: any;
  public model: string;
  public apiName: string;
  public endpoint: string;
  public startUrl: string;

  constructor(
    public auth: AuthService,
    public users: UserService,
    public customer: CustomerService,
    public activeModal: NgbActiveModal,
    private goal: GoalService,
    private department: DepartmentService
  ) {}

  ngOnInit(): void {}

  runQuery() {
    if (this.model) {
      const routeService =
        this.model === "users"
          ? this.users
          : this.model === "department"
          ? this.department
          : this.goal;
      routeService
        .getRoute(this.endpoint, this.model, this.apiName, this.frontEnddata)
        .pipe(takeUntil(this.getSubscription))
        .subscribe((data: any) => {
          this.passEntry.emit(data);
          this.activeModal.close();
        });
    } else {
      this.auth.logout();
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
