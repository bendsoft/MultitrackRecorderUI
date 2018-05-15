import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Channel} from '../service/channel.service';
import {ErrorStateMatcher} from '@angular/material';

export class ChannelRow {
  static readonly _allChannelNumbers = Array.from(Array(17).keys()).slice(1);
  get allChannelNumbers() {
    return ChannelRow._allChannelNumbers;
  }

  chooseChannelErrorStateMatcher = new ChannelErrorStateMatcher(false, false);
  nameErrorStateMatcher = new ChannelErrorStateMatcher(false, false);
  rowFormGroup: FormGroup;

  public static create(channel: Channel) {
    return new ChannelRow(channel);
  }

  private constructor(public channel: Channel) {
    Object.freeze(this.channel);

    this.rowFormGroup = new FormGroup({
      selectedChannel: new FormControl(channel.selectedChannel, Validators.required),
      name: new FormControl({ value: channel.name, disabled: true }, Validators.required),
      active: new FormControl(channel.active)
    });

    const options = { onlySelf: true, emitEvent: false };

    const activeFormControl = this.rowFormGroup.get('active');
    this.rowFormGroup.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        activeFormControl.enable(options);
      } else {
        activeFormControl.disable(options);
      }
    });

    const nameFormControl = this.rowFormGroup.get('name');
    nameFormControl.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        nameFormControl.enable(options);
      }
    });
  }
}

export class ChannelErrorStateMatcher implements ErrorStateMatcher {
  constructor(
    private checkDirty: boolean,
    private checkSubmitted: boolean
  ) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !this.checkSubmitted || (form && form.submitted);
    const isDirty = !this.checkDirty || (control.dirty || control.touched);

    return (control && control.invalid && control.errors !== null && (isDirty || isSubmitted));
  }
}

