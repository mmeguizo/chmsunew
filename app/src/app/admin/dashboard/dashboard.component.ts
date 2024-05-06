import { throwError } from "rxjs";

import { Component, OnInit } from "@angular/core";
import { UserService } from "../../@core/services/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CustomerService } from "../../@core/services/customer.service";
import { log } from "console";
import { NbThemeService } from "@nebular/theme";
import { takeWhile } from "rxjs/operators";

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  on: boolean;
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
  rollerShadesCard: CardSettings;
  // lightCard: CardSettings = {
  //   title: "Users",
  //   iconClass: "nb-person",
  //   type: "primary",
  //   counts: 0,
  // };
  // rollerShadesCard: CardSettings = {
  //   title: "Roller Shades",
  //   iconClass: "nb-roller-shades",
  //   type: "success",
  // };
  // wirelessAudioCard: CardSettings = {
  //   title: "Wireless Audio",
  //   iconClass: "nb-audio",
  //   type: "info",
  // };
  // coffeeMakerCard: CardSettings = {
  //   title: "Coffee Maker",
  //   iconClass: "nb-coffee-maker",
  //   type: "warning",
  // };

  private alive = true;

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    // this.lightCard,
    // this.rollerShadesCard,
    // this.wirelessAudioCard,
    // this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  };

  constructor(
    public user: UserService,
    public customer: CustomerService,
    private themeService: NbThemeService
  ) {
    this.date = new Date();
    this.setCurrentTime();
    this.timerId = this.updateTime();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllCustomer();
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

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
  }

  private leftPadZero(value: number) {
    return value < 10 ? `0${value}` : value.toString();
  }

  getAllUsers() {
    this.user
      .getAllUsers()
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        this.userData = data.user.length;
        this.setIconData(data.user.length);
      });
  }

  setIconData(count) {
    this.lightCard = {
      title: `Users ${count}`,
      iconClass: "nb-person",
      type: "primary",
      on: false,
    };

    this.rollerShadesCard = {
      title: "Roller Shades",
      iconClass: "nb-roller-shades",
      type: "success",
      on: false,
    };

    this.commonStatusCardsSet.push(this.lightCard);
    this.commonStatusCardsSet.push(this.rollerShadesCard);

    this.statusCardsByThemes = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: "warning",
        },
        {
          ...this.rollerShadesCard,
          type: "primary",
        },
        // {
        //   ...this.wirelessAudioCard,
        //   type: "danger",
        // },
        // {
        //   ...this.coffeeMakerCard,
        //   type: "info",
        // },
      ],
      dark: this.commonStatusCardsSet,
    };
  }
  getAllCustomer() {
    this.customer
      .getAllCustomers()
      .pipe(takeUntil(this.getSubscription))
      .subscribe((data: any) => {
        console.log("getAllCustomer");
        console.log(data);

        this.customerData = data.customer.length;
      });
  }

  ngOnDestroy() {
    this.getSubscription.unsubscribe();
  }
}
