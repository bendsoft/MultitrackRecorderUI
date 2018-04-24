import {Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Multitrackrecorder';
  data: String;
  channelProfiles: Array<any>;

  @ViewChild('sidenav') sideNav;

  constructor(private http:HttpClient) {
    this.http.get('./assets/test.json')
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
