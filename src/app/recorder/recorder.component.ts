import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {
  recordingDate = new FormControl(moment(), Validators.required);
  isRecording = false;

  timer = new RecordingTimer();

  constructor() {}

  ngOnInit() {}

  toggleRecording() {
    this.isRecording = !this.isRecording;

    if (this.isRecording) {
      this.timer.startWatch();
    } else {
      this.timer.stopWatch();
    }
  }

}

// TODO: Transform to own component
class RecordingTimer {
  public static readonly timeFormat = 'HH : mm : ss';
  public static readonly intervalPrecision = 1000;

  private _currentValue = moment().hour(0).minute(0).second(0);
  public formattedValue = this._currentValue.format(RecordingTimer.timeFormat);

  private runningClock;

  constructor() {}

  private displayTime() {
    this._currentValue.add(RecordingTimer.intervalPrecision, 'ms');
    this.formattedValue = this._currentValue.format(RecordingTimer.timeFormat);
  }

  startWatch() {
    this.runningClock = setInterval(this.displayTime.bind(this), RecordingTimer.intervalPrecision);
  }

  stopWatch() {
    clearInterval(this.runningClock);
  }
}
