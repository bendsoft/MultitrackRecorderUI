import {Component, ViewChild} from '@angular/core';
import {RecordingTimerComponent} from '../recording-timer/recording-timer.component';
import {ErrorStateMatcher, MatDialog, MatSnackBar} from '@angular/material';
import {CreateRecordingDialogComponent} from '../create-recording-dialog/create-recording-dialog.component';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecordingService} from '../service/recording.service';
import {HttpParams} from '@angular/common/http';
import * as _moment from "moment";
import {RecordingModel} from '../service/recording.model';
import {Observable} from 'rxjs';
const moment = _moment;
moment.locale('de-ch');

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent {
  isRecording = false;
  recordingInfo: {
    date,
    name
  };

  continueExistingRecordingForm = new FormGroup({
    selectExistingRecord: new FormControl()
  });
  existingTodaysSessions: Observable<RecordingModel[]>;

  private trackCounter: number = 1;
  trackRecordingForm = new FormGroup({
    name: new FormControl(`Song ${this.trackCounter}`, Validators.required)
  });

  nameErrorStateMatcher = new TrackRecordingErrorStateMatcher();

  @ViewChild(RecordingTimerComponent)
  private timer: RecordingTimerComponent;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    recordingService: RecordingService
  ) {
    const existingRecordingSelect = this.continueExistingRecordingForm.get('selectExistingRecord');
    existingRecordingSelect.disable();
    this.existingTodaysSessions = recordingService.getAll(new HttpParams().set('date', moment().format('YYYYMMDD')));
    this.existingTodaysSessions
      .subscribe(recordingsToday => {
        if(recordingsToday.length > 0) {
          existingRecordingSelect.valueChanges.subscribe(recordingSelected => {
            console.log(recordingSelected);

            if (recordingSelected) {
              this.recordingInfo = {
                date: moment(recordingSelected.date, 'YYYYMMDD').format('LL'),
                name: recordingSelected.name
              }
            }
          });
          existingRecordingSelect.enable();
        }
      });
  }

  toggleEditMode() {
    if (!this.trackRecordingForm.valid) {
      return;
    }

    const trackName = this.trackRecordingForm.get('name');
    if (trackName.enabled) {
      trackName.disable();
    } else {
      trackName.enable();
    }
  }

  openCreateRecordingDialog() {
    const addChannelDialog = this.dialog.open(CreateRecordingDialogComponent, {
      height: '18rem',
      width: '22rem'
    });

    addChannelDialog.afterClosed().subscribe(result => {
      if (result) {
        this.trackCounter = 0;
        this.recordingInfo = {
          name: result.name,
          date: result.date.format('LL')
        };
      }
    });
  }

  onClickStopRecording() {
    if (!this.trackRecordingForm.valid) {
      return;
    }

    this.trackCounter++;
    this.trackRecordingForm.get('name').reset();
    this.isRecording = false;
    this.timer.stopTimer();

    this.snackBar.open('Aufnahme gestoppt!', '' , {
      duration: 2000,
    });
  }

  onClickStartRecording() {
    this.isRecording = true;
    this.snackBar.open('Aufnahme läuft!', '' , {
      duration: 2000,
    });
  }

  onClickRecordNextTrack() {
    this.timer.restartTimer();

    this.trackRecordingForm.get('name').reset();
    this.trackCounter++;

    this.snackBar.open('Nächste Aufnahme gestartet!', '' , {
      duration: 2000,
    });
  }
}

export class TrackRecordingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.invalid && TrackRecordingErrorStateMatcher.hasError(control));
  }

  private static hasError(formControl: FormControl) {
    return Object.values(formControl.errors).some(error => error === true);
  }
}
