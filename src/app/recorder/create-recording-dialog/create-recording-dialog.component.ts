import { Component } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material";
import * as _moment from "moment";
const moment = _moment;

@Component({
  selector: 'app-create-recording-dialog',
  templateUrl: './create-recording-dialog.component.html',
  styleUrls: ['./create-recording-dialog.component.css']
})
export class CreateRecordingDialogComponent {
  createRecordingForm: FormGroup;
  nameErrorStateMatcher = new RecordingErrorStateMatcher(true, true);

  constructor() {
    this.createRecordingForm = new FormGroup({
      recordingDate: new FormControl(moment(), Validators.required),
      name: new FormControl('', Validators.required)
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

