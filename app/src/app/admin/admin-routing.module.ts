import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { CustomersComponent } from "./customers/customers.component";
import { ObjectivesComponent } from "./objectives/objectives.component";
import { ResearchComponent } from "./research/research.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "users", component: UsersComponent },
      { path: "research", component: ResearchComponent },
      { path: "objectives", component: ObjectivesComponent },
    ],
  },
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
