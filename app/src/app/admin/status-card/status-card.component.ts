import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-status-card",
  styleUrls: ["./status-card.component.scss"],
  template: `
    <nb-card (click)="click(on)">
      <div class="icon-container">
        <div class="icon status-{{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h5">{{ title }}</div>
        <!-- <div class="title h5">{{ counts }}</div> -->
        <!-- <div class="status paragraph-2">{{ on }}</div> -->
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {
  @Input() title: string;
  @Input() type: string;
  @Input() on: string;

  constructor(private router: Router) {}

  click(link: string) {
    this.router.navigate([link]);
  }
}
