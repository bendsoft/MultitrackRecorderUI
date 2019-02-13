import {AfterViewChecked, Component, ViewChild} from '@angular/core'
import {RecordingTimerComponent} from '../recording-timer/recording-timer.component'
import {ErrorStateMatcher, MatDialog, MatSelectChange, MatSnackBar} from '@angular/material'
import {CreateRecordingDialogComponent} from '../create-recording-dialog/create-recording-dialog.component'
import {FormControl, Validators} from '@angular/forms'
import {RecordingService} from '../service/recording.service'
import * as _moment from 'moment'
import {RecordingFactory} from '../types/recording-factory'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {HttpParams} from '@angular/common/http'
import {ChannelDataSource} from '../../channels/table/channel-data-source'
import {RecordingTimerComponentQueue} from './recording-timer-component-queue'
import {RecordingTimer} from '../types/recording-timer'
import {Recording} from '../types/recording'

const moment = _moment
moment.locale('de-ch')

@Component({
  selector: 'mtr-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements AfterViewChecked {
  private _isRecording = false
  set isRecording(value) {
    this._isRecording = value;
    value ?
      this.chooseRecordingSelect.disable() :
      this.chooseRecordingSelect.enable()
  }
  get isRecording() {
    return this._isRecording
  }

  isRecordingSelected = false

  currentRecordingInfo: Recording
  private trackCounter = 1

  chooseRecordingSelect = new FormControl()
  trackNameInput = new FormControl(this.getNextSongTitle(), Validators.required)
  nameErrorStateMatcher = new TrackRecordingErrorStateMatcher()
  todaysSessions: Observable<Recording[]>

  @ViewChild(RecordingTimerComponent) timerComponent
  private timer: RecordingTimer = new RecordingTimerComponentQueue()

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private recordingService: RecordingService,
    private channelDataSource: ChannelDataSource
  ) {
    this.updateSelectableRecordings()

    this.chooseRecordingSelect.valueChanges.subscribe(changedValue => {
      this.isRecordingSelected = !!changedValue
    })

    this.recordingService.updateDataStream()
  }

  ngAfterViewChecked(): void {
    if (this.isRecording && this.timerComponent) {
      if (this.timer && (<RecordingTimerComponentQueue>this.timer).applyQueuedMethods) {
        (<RecordingTimerComponentQueue>this.timer).applyQueuedMethods(this.timerComponent)
      }
      this.timer = this.timerComponent
    } else if (this.isRecording === false) {
      this.timer = new RecordingTimerComponentQueue()
      this.timerComponent = undefined
    }
  }

  private updateSelectableRecordings() {
    this.chooseRecordingSelect.disable()
    this.todaysSessions = this.recordingService.getRecordings(
      new HttpParams().set('recordingDate', moment().format('YYYYMMDD'))
    ).pipe(
      tap(todayRec => {
        this.chooseRecordingSelect.disable()
        if (Array.isArray(todayRec) && todayRec.length > 0) {
          const lastRecordingToday: Recording = todayRec[todayRec.length - 1]
          this.chooseRecordingSelect.setValue(lastRecordingToday)
          this.chooseRecordingSelect.enable()
          this.trackCounter = lastRecordingToday.tracks.length + 1
        }
      })
    )
  }

  private getNextSongTitle() {
    return `Song ${this.trackCounter}`
  }

  onSelectRecording(selectedRecording: MatSelectChange) {
    if (selectedRecording.value) {
      this.trackCounter = selectedRecording.value.tracks.length + 1
    }
  }

  openCreateRecordingDialog() {
    const addChannelDialog = this.dialog.open(CreateRecordingDialogComponent, {
      height: '18rem',
      width: '22rem'
    })

    addChannelDialog.afterClosed().subscribe(result => {
      if (result) {
        this.recordingService.createRecording(
          RecordingFactory.createRecording(
            result.name,
            result.date.format('YYYYMMDD')
          )
        )
          .subscribe((newRecording: Recording) => {
            this.currentRecordingInfo = newRecording
            this.updateSelectableRecordings()

            this.snackBar.open('Aufnahme erfolgreich erstellt!', '', {
              duration: 2000
            })
          })
      }
    })
  }

  onClickStartRecording() {
    this.timer.startTimer()

    this.isRecording = true
    this.trackNameInput.setValue(this.getNextSongTitle())

    this.addNewTrack()

    this.snackBar.open('Aufnahme läuft!', '', {
      duration: 2000
    })
  }

  onClickStopRecording() {
    this.isRecording = false

    if (!this.trackNameInput.valid) {
      this.snackBar.open('Aufnahme konnte nicht gespeichert werden, da kein gültiger Name vergeben wurde!', '', {
        duration: 2000
      })

      return
    }

    this.trackCounter++
    this.recordingService.updateRecording(this.currentRecordingInfo).subscribe(() => {
      this.snackBar.open('Aufnahme gestoppt!', '', {
        duration: 2000
      })
    })
  }

  onClickRecordNextTrack() {
    this.trackCounter++

    this.timer.restartTimer()

    this.recordingService.updateRecording(this.currentRecordingInfo).subscribe(() => {
      this.trackNameInput.setValue(this.getNextSongTitle())

      this.addNewTrack()

      this.snackBar.open('Nächste Aufnahme gestartet!', '', {
        duration: 2000
      })
    })
  }

  private addNewTrack() {
    this.currentRecordingInfo.tracks.push(RecordingFactory.createTrack(
      this.trackCounter,
      this.trackNameInput.value,
      this.channelDataSource.getChannelRows()
        .map(channelRow => RecordingFactory.transformChannelModelToChannelRecordingFile(channelRow.channel))
    ))
  }
}

export class TrackRecordingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched))
  }
}
