import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule, MatListModule, MatTabsModule, MatButtonToggleModule, MatInputModule, MatDatepickerModule,
  MatNativeDateModule, MatSelectModule, MatFormFieldModule, MatTableModule, MatCheckboxModule, MatDialogModule
} from '@angular/material';
import { FormsModule } from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ChannelsTable} from "./channels/ChannelsTable";
import { SecurityCheckDialogComponent } from './common/security-check-dialog/security-check-dialog.component';

@NgModule({
  declarations: [
    AppComponent, ChannelsTable, SecurityCheckDialogComponent
  ],
  entryComponents: [SecurityCheckDialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDatepickerModule, MatDialogModule,
    MatNativeDateModule, MatCheckboxModule,
    MatSelectModule, MatFormFieldModule, MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
