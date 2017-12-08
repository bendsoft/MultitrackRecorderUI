"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const material_1 = require("@angular/material");
let AppComponent = class AppComponent {
    constructor(http) {
        this.http = http;
        this.title = 'BehringerMultitrackRecorder';
        this.http.get('assets/test.json')
            .map(response => response.json())
            .subscribe(res => {
            this.data = res.data;
            this.channelProfiles = res.channelProfiles;
        });
    }
    menuItemClicked(target) {
        console.info(target);
    }
    toggleSidenav() {
        this.sideNav.toggle();
    }
};
__decorate([
    core_1.ViewChild('sidenav'),
    __metadata("design:type", typeof (_a = typeof material_1.MdSidenav !== "undefined" && material_1.MdSidenav) === "function" && _a || Object)
], AppComponent.prototype, "sideNav", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    }),
    __metadata("design:paramtypes", [http_1.Http])
], AppComponent);
exports.AppComponent = AppComponent;
var _a;
//# sourceMappingURL=app.component.js.map