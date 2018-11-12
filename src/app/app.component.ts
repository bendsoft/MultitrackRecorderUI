import {Component, ViewChild} from '@angular/core';
import {RecorderComponent} from './recorder/recorder-component/recorder.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Multitrackrecorder';

  @ViewChild('sidenav') sideNav;
  @ViewChild(RecorderComponent) recorder;

  toggleSidenav() {
    this.sideNav.toggle();
  }
}
