import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../@core/services/auth.service";
import { ConnectionService } from "../@core/services/connection.service";
import jwt_decode from "jwt-decode";
import { UserToken } from "../@core/data/user-token";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RegisterModalComponent } from "./register-modal/register-modal.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  msg: String;
  loader = false;
  disableSubmit;
  conn;
  userID;

  messageClass;
  message;
  processing = false;
  form: FormGroup;

  constructor(
    public cs: ConnectionService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public ngbModal: NgbModal
  ) {
    // this.createForm();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required], // Username field
      password: ["", Validators.required], // Password field
    });
  }

  enableForm() {
    this.form.controls["username"].enable(); // Enable username field
    this.form.controls["password"].enable(); // Enable password field
  }

  disableForm() {
    this.form.controls["username"].disable(); // Disable username field
    this.form.controls["password"].disable(); // Disable password field
  }
  Submit() {
    const user = {
      username: this.username,
      password: this.password,
    };
  }
  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    const user = {
      username: this.form.get("username").value, // Username input field
      password: this.form.get("password").value, // Password input field
    };

    // Function to send login data to API
    this.authService.login(user).subscribe((token: any) => {
      //Check if response was a success or error
      if (!token.success) {
        this.authService.makeToast(
          "danger",
          "Failed Logging in",
          token.message
        );
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      } else {
        let decoded = jwt_decode<UserToken>(token.token);
        this.authService.makeToast("success", "Success", token.message);
        this.authService.storeUserData(token.token, decoded);
        if (this.authService.CurrentlyloggedIn()) {
          this.authService.loggingIn(decoded.role);
        } else {
          this.authService.logout();
          this.router.navigate(["login"]); // Navigate to dashboard view
        }
      }
    });
  }

  register() {
    const activeModal = this.ngbModal.open(RegisterModalComponent, {
      size: "sm",
      container: "nb-layout",
      windowClass: "min_height",
      backdrop: "static",
    });
    activeModal.componentInstance.updateUser = false;
    activeModal.componentInstance.userData = {
      endpoint: "post",
      apiName: "register",
    };
  }
}
