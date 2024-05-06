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
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "ngx-register-modal",
  templateUrl: "./register-modal.component.html",
  styleUrls: ["./register-modal.component.scss"],
})
export class RegisterModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();

  private userData: any;
  public buttonStatus: String = "primary";
  public form: any;
  public showpassword: Boolean = false;
  public id: String;
  public updateUser: Boolean;
  selected: String;
  eyeIcon: string = "eye-off-outline";

  constructor(
    public auth: AuthService,
    public user: UserService,
    public customer: CustomerService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.showpassword = false;
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ["", [Validators.required]],
      // email: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^.+@chmsu.edu.ph$"),
        ],
      ],
      password: ["", [Validators.required]],
      role: ["", [Validators.required]],
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

  executeAction(form) {
    this.user
      .getRoute("post", "register", this.form.value)
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        console.log(data);
        if (!data.success) {
          this.auth.makeToast("danger", "Error", data.message);
        } else {
          this.passEntry.emit(data);
          this.activeModal.close();
        }
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
}
