import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { dataFilterPipe, NumberWithCommas, IsRead, SumPipe, AssetsPipe, ReverseDate, StripTags, RoundOff, ChatMessagePipe, FileNameOnly } from '../@core/pipes/dataFilter';
import { TruncatePipe, TruncateTextPipe } from '../@core/pipes/truncate';
import { NbStepperModule, NbSpinnerModule, NbListModule, } from '@nebular/theme';
import { NbMenuModule, NbActionsModule, NbTreeGridModule } from '@nebular/theme';

import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatStepperModule} from '@angular/material/stepper';

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
  NbCalendarModule


} from '@nebular/theme';

import { CommonComponent } from './common/common.component';
// import { FilesComponent } from './files/files.component';
// import { CustomerModalComponent } from './customer-modal/customer-modal.component';

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
  NbCalendarModule
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
    ...materialModules
  ],
  providers: [
    ReverseDate
  ]
})
export class SharedModule { }
