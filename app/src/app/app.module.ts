/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { JwtModule } from "@auth0/angular-jwt";

import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from "@nebular/theme";
import { AdminModule } from "./admin/admin.module";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthGuard } from "./@core/guard/auth.guard";
import { NotAuthGuard } from "./@core/guard/notAuth.guard";
import { SharedModule } from "./shared/shared.module";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    AdminModule,
    NbDialogModule.forRoot(),
    NgbModule,
    SharedModule,
    // NgxDocViewerModule
  ],
  bootstrap: [AppComponent],
  providers: [
    // { provide: APP_BASE_HREF, useValue: '/' },
    AuthGuard,
    NotAuthGuard,
    NgbActiveModal,
    // AuthService,
    // ConnectionService
  ],
  entryComponents: [],
})
export class AppModule {}
