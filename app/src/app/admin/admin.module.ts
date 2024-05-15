import { NgModule } from "@angular/core";
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbCardModule,
  NbBadgeModule,
  NbTabsetModule,
  NbTooltipModule,
  NbDatepickerModule,
  NbWindowModule,
  NbCheckboxModule,
  NbDialogModule,
  NbInputModule,
  NbPopoverModule,
  NbCalendarModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { UsersComponent } from "./users/users.component";
import { DataTablesModule } from "angular-datatables";
import { CustomersComponent } from "./customers/customers.component";
import { UsersModalComponent } from "../shared/users-modal/users-modal.component";
import { UpdateProfileComponent } from "../shared/update-profile/update-profile.component";
import { CustomerModalComponent } from "../shared/customer-modal/customer-modal.component";
import { FilesComponent } from "../shared/files/files.component";
import { UploadsComponent } from "../shared/uploads/uploads.component";

import { StatusCardComponent } from "./status-card/status-card.component";
import { ObjectivesComponent } from "./objectives/objectives.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { DepartmentComponent } from "../shared/department-modal/department.component";
import { addDocumentComponent } from "../shared/add-document-modal/add-document.component";
import { ResearchComponent } from "./research/research.component";
import { addGoalComponent } from "../shared/add-goal/add-goal.component";

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbCardModule,
  NbBadgeModule,
  NbTabsetModule,
  NbTooltipModule,
  NbWindowModule,
  NbCheckboxModule,
  NbDialogModule.forChild(),
  NbInputModule,
  NbPopoverModule,
  NbCalendarModule,
];

@NgModule({
  imports: [
    AdminRoutingModule,
    ThemeModule,
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    // BsDropdownModule.forRoot(),
    NbActionsModule,
    SharedModule,
    DataTablesModule,
    // ImageCropperModule,
    ...NB_MODULES,
    Ng2SmartTableModule,

    // NgApexchartsModule
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsersComponent,
    CustomersComponent,
    UpdateProfileComponent,
    UsersModalComponent,
    addGoalComponent,
    addDocumentComponent,
    CustomerModalComponent,
    FilesComponent,
    UploadsComponent,
    StatusCardComponent,
    ObjectivesComponent,
    DepartmentComponent,
    ResearchComponent,
  ],
  entryComponents: [
    UpdateProfileComponent,
    UsersModalComponent,
    addGoalComponent,
    addDocumentComponent,
    DepartmentComponent,
    CustomerModalComponent,
    FilesComponent,
    UploadsComponent,
  ],
  exports: [],
  providers: [
    UsersModalComponent,
    addGoalComponent,
    addDocumentComponent,
    DepartmentComponent,
    UpdateProfileComponent,
    CustomerModalComponent,
    FilesComponent,
    UploadsComponent,
    DepartmentComponent,
  ],
})
export class AdminModule {}
