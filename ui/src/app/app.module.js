"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const app_component_1 = require("./app.component");
const animations_1 = require("@angular/platform-browser/animations");
const material_1 = require("@angular/material");
const http_1 = require("@angular/http");
const forms_1 = require("@angular/forms");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            animations_1.BrowserAnimationsModule,
            material_1.MatButtonModule,
            material_1.MatMenuModule,
            material_1.MatCardModule,
            material_1.MatToolbarModule,
            material_1.MatIconModule,
            material_1.MatSidenavModule,
            material_1.MatListModule,
            material_1.MatTabsModule,
            material_1.MatButtonToggleModule,
            material_1.MatInputModule,
            material_1.MatDatepickerModule,
            material_1.MatNativeDateModule,
            material_1.MatSelectModule
        ],
        providers: [],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map