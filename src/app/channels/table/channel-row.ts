import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ChannelModel} from '../service/channel.model';
import {ErrorStateMatcher} from '@angular/material';
import {ChannelDataSource} from './channel-data-source';
import {ChannelRowValidator} from './channel-row-validator';

export class ChannelRow {
  static readonly _allChannelNumbers = Array.from(Array(17).keys()).slice(1);
  get allChannelNumbers() {
    return ChannelRow._allChannelNumbers;
  }

  private _isLoading = false;
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(state) {
    this._isLoading = state;
    this.toggleControlsEneable();
  }

  chooseChannelErrorStateMatcher = new ChannelErrorStateMatcher(false, false);
  nameErrorStateMatcher = new ChannelErrorStateMatcher(false, false);

  rowFormGroup: FormGroup;
  private readonly allControls: FormControl[];
  private static readonly ENABLE_DISABLE_OPTIONS = { onlySelf: true, emitEvent: false };

  public static create(channel: ChannelModel, channelRowData: ChannelDataSource, isChannelRowForTable?: Boolean) {
    return new ChannelRow(channel, channelRowData, isChannelRowForTable);
  }

  private constructor(
    public channel: ChannelModel,
    private channelRowData: ChannelDataSource,
    private isChannelRowForTable: Boolean = true
  ) {
    Object.freeze(this.channel);

    const selectedChannel = new FormControl(channel.channelNumber, [
      Validators.required,
      ChannelRowValidator.checkUnique.bind(this, 'channelNumber', this.channelRowData, true)
    ]);
    const name = new FormControl(channel.name, [
      Validators.required,
      ChannelRowValidator.checkUnique.bind(this, 'name', this.channelRowData, true)
    ]);
    const active = new FormControl(channel.active);

    this.allControls = [selectedChannel, name, active];
    this.toggleControlsEneable();

    this.rowFormGroup = new FormGroup({
      channelNumber: selectedChannel,
      name: name,
      active: active
    });

    name.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        name.enable(ChannelRow.ENABLE_DISABLE_OPTIONS);
      }
    });
  }

  private toggleControlsEneable() {
    if (this._isLoading) {
      this.allControls.forEach(control => control.disable(ChannelRow.ENABLE_DISABLE_OPTIONS));
    } else {
      this.allControls.forEach((control, index) => {
        if (this.isChannelRowForTable && index === 1) {
          control.disable(ChannelRow.ENABLE_DISABLE_OPTIONS);
        } else {
          control.enable(ChannelRow.ENABLE_DISABLE_OPTIONS)
        }
      });
    }
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
