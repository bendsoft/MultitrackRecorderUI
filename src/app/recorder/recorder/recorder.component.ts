import {Component, ViewChild} from '@angular/core';
import {RecordingTimerComponent} from '../recording-timer/recording-timer.component';
import {MatDialog, MatSnackBar} from "@angular/material";
import {CreateRecordingDialogComponent} from "../create-recording-dialog/create-recording-dialog.component";

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent {
  isRecording = false;
  recordingInfo: {
    recordingDate,
    name
  };

  @ViewChild(RecordingTimerComponent)
  private timer: RecordingTimerComponent;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  openCreateRecordingDialog() {
    const addChannelDialog = this.dialog.open(CreateRecordingDialogComponent, {
      height: '18rem',
      width: '22rem',
      position: {
        top: '200px'
      }
    });

    addChannelDialog.afterClosed().subscribe(result => {
      this.recordingInfo = {
        name: result.name,
        recordingDate: result.recordingDate.locale('de-ch').format('LL')
      };
    });
  }

  stopRecording() {
    this.isRecording = false;
    this.timer.stopTimer();
    this.snackBar.open('Aufnahme gestoppt!', '' ,{
      duration: 2000,
    });
  }

  startRecording() {
    this.isRecording = true;
    this.snackBar.open('Aufnahme läuft!', '' ,{
      duration: 2000,
    });
  }

  restartRecording() {
    this.timer.restartTimer();
  }
}
