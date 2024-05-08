import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  dataFilterPipe,
  NumberWithCommas,
  IsRead,
  SumPipe,
  AssetsPipe,
  ReverseDate,
  StripTags,
  RoundOff,
  ChatMessagePipe,
  FileNameOnly,
} from "../@core/pipes/dataFilter";
import { TruncatePipe, TruncateTextPipe } from "../@core/pipes/truncate";
import { NbStepperModule, NbSpinnerModule, NbListModule } from "@nebular/theme";
import {
  NbMenuModule,
  NbActionsModule,
  NbTreeGridModule,
} from "@nebular/theme";

import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbInputModule,
  NbPopoverModule,
  NbSelectModule,
  NbTabsetModule,
  NbTooltipModule,
  NbWindowModule,
  NbAccordionModule,
  NbRadioModule,
  NbIconModule,
  NbLayoutModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbThemeModule,
  NbBadgeModule,
  NbDatepickerModule,
  NbCalendarModule,
} from "@nebular/theme";

import { CommonComponent } from "./common/common.component";
// import { FilesComponent } from './files/files.component';
// import { CustomerModalComponent } from './customer-modal/customer-modal.component';

import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CdkTableModule } from "@angular/cdk/table";
import { A11yModule } from "@angular/cdk/a11y";
import { BidiModule } from "@angular/cdk/bidi";
import { OverlayModule } from "@angular/cdk/overlay";
import { PlatformModule } from "@angular/cdk/platform";
import { ObserversModule } from "@angular/cdk/observers";
import { PortalModule } from "@angular/cdk/portal";

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatSnackBarModule,
  MatIconModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatStepperModule,

  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatTableModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatStepperModule,
  CdkTableModule,
  A11yModule,
  BidiModule,
  ObserversModule,
  OverlayModule,
  PlatformModule,
  PortalModule,
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatCardModule,
  MatProgressBarModule,
];

const MODULES = [
  NbDialogModule.forChild(),
  NbWindowModule.forChild(),
  NbCardModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbPopoverModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbThemeModule,
  NbBadgeModule,
  NbCalendarModule,
];

@NgModule({
  imports: [
    // DataTableModule,
    NbStepperModule,
    NbSpinnerModule,
    // BsDatepickerModule.forRoot(),
    // TimepickerModule.forRoot(),
    // TooltipModule.forRoot(),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NbMenuModule.forRoot(),
    NbTreeGridModule,
    // BsDropdownModule,
    // PasswordStrengthMeterModule,
    // NgImageFullscreenViewModule,
    NbAccordionModule,
    NbRadioModule,
    RouterModule,
    // DataTablesModule,
    ...MODULES,
    ...materialModules,
  ],
  declarations: [
    dataFilterPipe,
    NumberWithCommas,
    IsRead,
    TruncateTextPipe,
    TruncatePipe,
    SumPipe,
    AssetsPipe,
    ReverseDate,
    StripTags,
    RoundOff,
    ChatMessagePipe,
    FileNameOnly,
    CommonComponent,
    // FilesComponent,
    // CustomerModalComponent,
    //UpdateProfileComponent,
  ],
  entryComponents: [
    CommonComponent,
    //UpdateProfileComponent,
  ],
  exports: [
    dataFilterPipe,
    NumberWithCommas,
    IsRead,
    SumPipe,
    AssetsPipe,
    ReverseDate,
    ChatMessagePipe,
    FileNameOnly,
    TruncateTextPipe,
    TruncatePipe,
    StripTags,
    RoundOff,
    NbStepperModule,
    NbSpinnerModule,
    // BsDatepickerModule,
    // TimepickerModule,
    NbListModule,
    // TooltipModule,
    CommonModule,
    // TimeagoModule,
    // DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    // PasswordStrengthMeterModule,
    NbAccordionModule,
    RouterModule,
    // NgxProgressiveImageLoaderModule,
    // NgImageFullscreenViewModule,
    ...materialModules,
  ],
  providers: [ReverseDate],
})
export class SharedModule {}
