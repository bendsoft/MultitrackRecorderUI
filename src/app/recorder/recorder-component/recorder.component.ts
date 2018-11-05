import {Component, ViewChild} from '@angular/core';
import {RecordingTimerComponent} from '../recording-timer/recording-timer.component';
import {ErrorStateMatcher, MatDialog, MatSelectChange, MatSnackBar} from '@angular/material';
import {CreateRecordingDialogComponent} from '../create-recording-dialog/create-recording-dialog.component';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecordingService} from '../service/recording.service';
import * as _moment from 'moment';
import {RecordingModel, RecordingModelFactory} from '../service/recording.model';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

const moment = _moment;
moment.locale('de-ch');

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent {
  isRecording = false;
  isRecordingSelected = false;

  currentRecordingForm = new FormGroup({
    selectRecording: new FormControl()
  });
  todaysSessions: Observable<RecordingModel[]>;

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
    private recordingService: RecordingService
  ) {
    const existingRecordingSelect = this.currentRecordingForm.get('selectRecording');
    existingRecordingSelect.disable();
    this.todaysSessions = this.recordingService.dataStream.pipe(
      map(recordings =>
        recordings.filter(recording =>
          recording.date === moment().format('YYYYMMDD')
        )
      ),
      tap(todayRec => {
        existingRecordingSelect.disable();
        if (Array.isArray(todayRec) && todayRec.length > 0) {
          existingRecordingSelect.setValue(todayRec[todayRec.length-1]);
          existingRecordingSelect.enable();
        }
      })
    );

    existingRecordingSelect.valueChanges.subscribe(changedValue => {
      this.isRecordingSelected = !!changedValue;
    });

    this.recordingService.updateDataStream();
  }

  onSelectRecording(selectedRecording: MatSelectChange) {
    if (selectedRecording.value) {
      console.log(selectedRecording.value);
    }
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
        this.recordingService.create(
          RecordingModelFactory.create(
            result.name,
            result.date.format('YYYYMMDD')
          )
        )
        .subscribe(() => this.snackBar.open('Aufnahme erfolgreich erstellt!', '' , {
          duration: 2000
        }));
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
    this.currentRecordingForm.get('selectRecording').enable();
    this.timer.stopTimer();

    this.snackBar.open('Aufnahme gestoppt!', '' , {
      duration: 2000,
    });
  }

  onClickStartRecording() {
    this.isRecording = true;
    this.currentRecordingForm.get('selectRecording').disable();
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
