import { Component } from '@angular/core';

import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-recording-timer',
  templateUrl: './recording-timer.component.html',
  styleUrls: ['./recording-timer.component.css']
})
export class RecordingTimerComponent {
  private static readonly intervalPrecision = 1000;
  private static readonly timeFormat = 'HH : mm : ss';

  private _currentValue;
  formattedValue;

  private runningClock;

  constructor() {
    this.restartTimer();
  }

  private displayTime() {
    this._currentValue.add(RecordingTimerComponent.intervalPrecision, 'ms');
    this.updateFormattedValue();
  }

  private updateFormattedValue() {
    this.formattedValue = this._currentValue.format(RecordingTimerComponent.timeFormat);
  }

  resetTimer() {
    this._currentValue = moment().hour(0).minute(0).second(0);
    this.updateFormattedValue();
  }

  restartTimer() {
    clearInterval(this.runningClock);
    this.resetTimer();
    this.startTimer();
  }

  startTimer() {
    this.runningClock = setInterval(this.displayTime.bind(this), RecordingTimerComponent.intervalPrecision);
  }

  stopTimer() {
    clearInterval(this.runningClock);
  }
}
