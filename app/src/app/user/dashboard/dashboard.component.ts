import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../@core/services/auth.service";
@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  profileJson: string = null;
  constructor(public user: AuthService) {}

  async ngOnInit() {
    console.log("dashboard component");
  }
}
