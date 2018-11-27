import {Component} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {RecordingService} from '../service/recording.service';
import {HttpParams} from '@angular/common/http';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-create-recording-dialog',
  templateUrl: './create-recording-dialog.component.html',
  styleUrls: ['./create-recording-dialog.component.css']
})
export class CreateRecordingDialogComponent {
  createRecordingForm: FormGroup = new FormGroup({
    date: new FormControl(moment(), Validators.required),
    name: new FormControl('', Validators.required)
  });

  nameErrorStateMatcher = new RecordingErrorStateMatcher(true, true);

  private readonly DEFAULT_RECODING_NAME = 'Aufnahme';

  constructor(
    recordingService: RecordingService
  ) {
    const nameInput = this.createRecordingForm.get('name');
    nameInput.disable();

    recordingService.getRecordings(new HttpParams().set('date', moment().format('YYYYMMDD')))
      .subscribe(recordingsToday => {
        const standardRecordingsCount = recordingsToday.filter(rec => rec.name.indexOf(this.DEFAULT_RECODING_NAME) >= 0).length + 1;
        nameInput.setValue(`${this.DEFAULT_RECODING_NAME} ${standardRecordingsCount}`);
        nameInput.enable();
      });
  }
}

export class RecordingErrorStateMatcher implements ErrorStateMatcher {
  constructor(
    private checkDirty: boolean,
    private checkSubmitted: boolean
  ) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !this.checkSubmitted || (form && form.submitted);
    const isDirty = !this.checkDirty || (control.dirty || control.touched);

    return (control && control.invalid && RecordingErrorStateMatcher.hasError(control) && (isDirty || isSubmitted));
  }

  private static hasError(formControl: FormControl) {
    return Object.values(formControl.errors).some(error => error === true);
  }
}

