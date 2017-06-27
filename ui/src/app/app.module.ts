import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
  MdSidenavModule, MdListModule, MdTabsModule, MdButtonToggleModule, MdInputModule, MdDatepickerModule,
  MdNativeDateModule, MdSelectModule
} from '@angular/material';
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdMenuModule,
    MdCardModule,
    MdToolbarModule,
    MdIconModule,
    MdSidenavModule,
    MdListModule,
    MdTabsModule,
    MdButtonToggleModule,
    MdInputModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
