import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../@core/services/auth.service";
import { UserService } from "../../@core/services/user.service";
import { FileService } from "../../@core/services/file.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { setTimeout } from "timers";

@Component({
  selector: "ngx-update-profile",
  templateUrl: "./update-profile.component.html",
  styleUrls: ["./update-profile.component.scss"],
})
export class UpdateProfileComponent implements OnInit {
  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();

  private getSubscription = new Subject<void>();

  public loading = true;
  public form: any;
  public data: any;
  public uid: any;
  public dataID: any;
  public showpassword = false;
  public eyeIcon = "eye-off-outline";
  public profile_pic: any;
  public role: any;
  public profile_pic_image: any;

  private userData: any;
  public buttonStatus: String = "primary";
  public buttonTxt: String = "action";
  public action: String = "action to perform in";
  public id: String;
  selected: String;

  loadingMediumGroup = false;

  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public auth: AuthService,
    public user: UserService,
    public file: FileService
  ) {
    this.profile_pic = this.auth.getUserProfilePic();
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirm: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.id = this.auth.getTokenUserID();
    this.getUser();
  }

  getUser() {
    this.user
      .getRoute("get", "profile", this.id)
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.form = this.formBuilder.group({
          username: [data.user.username, [Validators.required]],
          email: [data.user.email, [Validators.required]],
          password: ["", [Validators.required]],
          confirm: ["", [Validators.required]],
          role: [data.user.role, [Validators.required]],
        });
      });
  }

  showPassword() {
    if (this.showpassword == true) {
      this.showpassword = false;
      this.eyeIcon = "fas fa-eye";
    } else {
      this.showpassword = true;
      this.eyeIcon = "fas fa-eye-slash";
    }
  }

  imageLoader = false;
  elEventListenerActive: boolean;
  openFile(ev, id) {
    let file,
      el = document.getElementById(id);
    el.click();
    let handler = (fc) => {
      try {
        let fileList: any;
        let fd = new FormData();
        if (fc.target["files"][0]["name"] !== undefined) {
          fileList = fc.target;
          let file: File = fileList.files[0];
          fd.append("avatar", file, file.name);
          this.file
            .addAvatar(fd)
            .pipe(takeUntil(this.getSubscription))
            .subscribe((data: any) => {
              this.elEventListenerActive = false;
              this.profile_pic = data.data.source;
              el.removeEventListener("change", handler);
            });
        } else {
          // this.Product.image = '';
          ev.target.innerHTML = "Browse";
          this.elEventListenerActive = false;
          el.removeEventListener("change", handler);
        }
      } catch (e) {
        // this.Product.image = '';
        ev.target.innerHTML = "Browse";
        this.elEventListenerActive = false;
        el.removeEventListener("change", handler);
      }
    };
    if (!this.elEventListenerActive) {
      el.addEventListener("change", handler);
      this.elEventListenerActive = true;
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  executeAction(form) {
    form.value.id = this.id;
    form.value.profile_pic = this.profile_pic;
    let data = form.value;
    this.user
      .getRoute("put", "updateProfile", data)
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        if (data.success) {
          this.auth.makeToast(
            "success",
            `Updating ${form.value.username}`,
            data.message
          );
          this.closeModal();
          this.auth.logout();
        } else {
          this.auth.makeToast(
            "danger",
            `Updating ${form.value.username}`,
            data.message
          );
        }
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.getSubscription.unsubscribe();
  }
}
