import {Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

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
    this.getConfigurationData()
      .subscribe(res => {
        this.data = res.data;
        this.channelProfiles = res.channelProfiles;
      });
  }

  getConfigurationData(): Observable<any> {
    return this.http.get("./assets/test.json")
  }

  menuItemClicked(target: EventTarget) {
    console.info(target);
  }

  toggleSidenav() {
    this.sideNav.toggle();
  }
}
