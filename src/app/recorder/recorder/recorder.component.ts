import {Component, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import * as _moment from 'moment';
import {RecordingTimerComponent} from '../recording-timer/recording-timer.component';
const moment = _moment;

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent {
  recordingDate = new FormControl(moment(), Validators.required);
  isRecording = false;

  @ViewChild(RecordingTimerComponent)
  private timer: RecordingTimerComponent;

  constructor() {}

  stopRecording() {
    this.isRecording = false;
    this.timer.stopTimer();
  }

  startRecording() {
    this.isRecording = true;
  }

  restartRecording() {
    this.timer.restartTimer();
  }
}
