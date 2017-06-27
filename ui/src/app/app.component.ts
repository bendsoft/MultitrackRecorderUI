import {Component, ViewChild} from '@angular/core';
import { Http } from '@angular/http';
import {MdSidenav} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'BehringerMultitrackRecorder';
  data: String;
  channelProfiles: Array<any>;

  @ViewChild('sidenav') sideNav: MdSidenav;

  constructor(private http:Http) {

    this.http.get('assets/test.json')
      .map(response => response.json())
      .subscribe(res => {
        this.data = res.data;
        this.channelProfiles = res.channelProfiles;
      });
  }

  menuItemClicked(target: EventTarget) {
    console.info(target);
  }

  toggleSidenav() {
    this.sideNav.toggle();
  }
}
