import { Component } from '@angular/core';

import * as _moment from 'moment';
const moment = _moment;

export interface RecordingTimer {
  restartTimer();
  stopTimer();
  startTimer();
}

@Component({
  selector: 'recording-timer',
  templateUrl: './recording-timer.component.html',
  styleUrls: ['./recording-timer.component.css']
})
export class RecordingTimerComponent implements RecordingTimer {
  private static readonly intervalPrecision = 1000;
  private static readonly timeFormat = 'HH : mm : ss';

  private _currentUnformattedValue;
  currentValue;

  private runningClock;

  constructor() {
    this.resetTimer();
  }

  private updateFormattedValue() {
    this.currentValue = this._currentUnformattedValue.format(RecordingTimerComponent.timeFormat);
  }

  private resetTimer() {
    this._currentUnformattedValue = moment().hour(0).minute(0).second(0);
    this.updateFormattedValue();
  }

  restartTimer() {
    this.stopTimer();
    this.resetTimer();
    this.startTimer();
  }

  startTimer() {
    this.runningClock = setInterval(() => {
      this._currentUnformattedValue.add(RecordingTimerComponent.intervalPrecision, 'ms');
      this.updateFormattedValue();
    }, RecordingTimerComponent.intervalPrecision);
  }

  stopTimer() {
    clearInterval(this.runningClock);
  }
}
