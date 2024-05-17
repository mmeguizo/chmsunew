import { throwError } from "rxjs";

import { Component, OnInit } from "@angular/core";
import { UserService } from "../../@core/services/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NbThemeService } from "@nebular/theme";
import { takeWhile } from "rxjs/operators";
import { DepartmentService } from "../../@core/services/department.service";

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  on: string;
}

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public totalUsers;
  public loadingStorages = false;
  public storages = [];
  date;
  hours: string;
  minutes: string;
  seconds: string;
  PmAmTime: string;
  public timerId = null;
  attendance: any;
  employees: any;
  onDuty = 0;
  leaves = 0;
  loans = 0;
  PmAm = 0;
  userData;
  customerData;
  private getSubscription = new Subject<void>();

  lightCard: CardSettings;
  departmentCard: CardSettings;

  private alive = true;

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  };

  constructor(
    public user: UserService,
    private themeService: NbThemeService,
    private DepartmentService: DepartmentService
  ) {
    this.date = new Date();
    this.setCurrentTime();
    this.timerId = this.updateTime();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllDepartments();
  }
  private updateTime() {
    setInterval(() => {
      this.setCurrentTime();
    }, 1000);
  }

  private setCurrentTime() {
    const time = new Date(Date.now());
    this.hours = this.leftPadZero((time.getHours() + 24) % 12 || 12);
    this.PmAmTime = this.leftPadZero(time.getHours());
    this.minutes = this.leftPadZero(time.getMinutes());
    this.seconds = this.leftPadZero(time.getSeconds());
    this.PmAm = parseInt(this.PmAmTime);
  }

  private leftPadZero(value: number) {
    return value < 10 ? `0${value}` : value.toString();
  }

  getAllUsers() {
    this.user
      .getRoute("get", "users", "getAllUsers")
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.userData = data.user.length;
        this.lightCard = this.setIconData(
          "Users",
          data.user.length,
          this.lightCard,
          "nb-person",
          "primary"
        );
        this.setDashboard(this.lightCard, "warning");
        this.RunthemeService();
      });
  }

  getAllDepartments() {
    this.DepartmentService.getRoute("get", "department", "getAllDepartment")
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        console.log(data.department);

        // this.employees = data.employees.length;
        this.departmentCard = this.setIconData(
          "Departments",
          data.department.length,
          this.departmentCard,
          "fas fa-building",
          "success"
        );
        this.setDashboard(this.departmentCard, "warning");
        this.RunthemeService();
      });
  }

  setIconData(
    title: string,
    count: number,
    variable: any,
    iconClass: string,
    type: string
  ) {
    return (variable = {
      title: `${title} ${count}`,
      iconClass: iconClass,
      type: type,
      on: `/admin/${title.toLowerCase() || ""}`,
    });
  }

  setDashboard(dashboardCard: any, type: string) {
    this.commonStatusCardsSet.push(dashboardCard);
    this.statusCardsByThemes = {
      // default: this.commonStatusCardsSet,
      // cosmic: [],
      // corporate: [],
      // dark: this.commonStatusCardsSet,

      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: "warning",
          // },
          // {
          //   ...this.rollerShadesCard,
          //   type: "primary",
          // },
          // {
          //   ...this.wirelessAudioCard,
          //   type: "danger",
          // },
          // {
          //   ...this.coffeeMakerCard,
          //   type: "info",
        },
      ],
      dark: this.commonStatusCardsSet,
    };
  }

  RunthemeService() {
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
  }

  ngOnDestroy() {
    this.getSubscription.unsubscribe();
  }
}
