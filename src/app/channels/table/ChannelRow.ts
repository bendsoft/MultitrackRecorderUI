import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Channel} from '../service/channel.service';
import {ErrorStateMatcher} from '@angular/material';

export class ChannelRow {
  static readonly _allChannelNumbers = Array.from(Array(17).keys()).slice(1);
  get allChannelNumbers() {
    return ChannelRow._allChannelNumbers;
  }

  chooseChannelErrorStateMatcher = new ChannelNumberErrorStateMatcher();
  nameErrorStateMatcher = new NameErrorStateMatcher();
  rowFormGroup: FormGroup;

  public static create(channel: Channel) {
    return new ChannelRow(channel);
  }

  private constructor(public channel: Channel) {
    Object.freeze(this.channel);

    const nameFormControl = new FormControl({ value: channel.name, disabled: true }, Validators.required);
    const activeFormControl = new FormControl(channel.active);
    this.rowFormGroup = new FormGroup({
      selectedChannel: new FormControl(channel.selectedChannel, Validators.required),
      name: nameFormControl,
      active: activeFormControl
    });

    const options = { onlySelf: true, emitEvent: false };
    this.rowFormGroup.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        activeFormControl.enable(options);
      } else {
        activeFormControl.disable(options);
      }
    });

    nameFormControl.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        nameFormControl.enable(options);
      }
    });
  }
}

class ChannelNumberErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && control.errors !== null);
  }
}

class NameErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && control.errors !== null);
  }
}
