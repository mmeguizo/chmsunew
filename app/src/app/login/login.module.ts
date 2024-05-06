import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";

import { ThemeModule } from "../@theme/theme.module";
import { NbSpinnerModule } from "@nebular/theme";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterModalComponent } from "./register-modal/register-modal.component";

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
    CommonModule,
    LoginRoutingModule,
    ThemeModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    ...NB_MODULES,
  ],
  declarations: [LoginComponent, RegisterModalComponent],
  providers: [RegisterModalComponent],
  entryComponents: [RegisterModalComponent],
})
export class LoginModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
