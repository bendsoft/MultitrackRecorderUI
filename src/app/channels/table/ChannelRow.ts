import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Channel} from '../service/channel.service';
import {ErrorStateMatcher} from '@angular/material';
import {ChannelDataSource} from "./ChannelDataSource";
import {ChannelRowValidator} from "./ChannelRowValidator";
import * as _ from "lodash";

export class ChannelRow {
  static readonly _allChannelNumbers = Array.from(Array(17).keys()).slice(1);
  get allChannelNumbers() {
    return ChannelRow._allChannelNumbers;
  }

  chooseChannelErrorStateMatcher = new ChannelErrorStateMatcher(false, false);
  nameErrorStateMatcher = new ChannelErrorStateMatcher(false, false);
  rowFormGroup: FormGroup;

  public static create(channel: Channel, channelRowData: ChannelDataSource, formStates?) {
    return new ChannelRow(channel, channelRowData, formStates);
  }

  private constructor(
    public channel: Channel,
    private channelRowData: ChannelDataSource,
    formStates
  ) {
    Object.freeze(this.channel);
    const formStateWithDefaults = {
      name: { disabled: true },
      active: { disabled: false }
    };

    _.merge(formStates, formStateWithDefaults);

    this.rowFormGroup = new FormGroup({
      selectedChannel: new FormControl(channel.selectedChannel, [
        Validators.required,
        ChannelRowValidator.checkUnique.bind(this, 'selectedChannel', this.channelRowData, true)
      ]),
      name: new FormControl({ value: channel.name, disabled: formStateWithDefaults.name.disabled }, [
        Validators.required,
        ChannelRowValidator.checkUnique.bind(this, 'name', this.channelRowData, true)
      ]),
      active: new FormControl({ value: channel.active, disabled: formStateWithDefaults.active.disabled })
    });

    const activeFormControl = this.rowFormGroup.get('active');
    const nameFormControl = this.rowFormGroup.get('name');

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

export class ChannelErrorStateMatcher implements ErrorStateMatcher {
  constructor(
    private checkDirty: boolean,
    private checkSubmitted: boolean
  ) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !this.checkSubmitted || (form && form.submitted);
    const isDirty = !this.checkDirty || (control.dirty || control.touched);

    return (control && control.invalid && ChannelErrorStateMatcher.hasError(control) && (isDirty || isSubmitted));
  }

  private static hasError(formControl: FormControl) {
    return Object.values(formControl.errors).some(error => error === true);
  }
}

