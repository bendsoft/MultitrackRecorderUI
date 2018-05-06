import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material";
import {Channel} from "../service/channel.service";

export class ChannelRow {
  static readonly _allChannelNumbers = Array.from(Array(17).keys()).slice(1);
  get allChannelNumbers() {
    return ChannelRow._allChannelNumbers;
  }

  viewState: {
    editing,
    selectedChannelValid
  } = {
    editing: false,
    selectedChannelValid: true
  };

  chooseChannelErrorStateMatcher = new ChannelNumberErrorStateMatcher();
  chooseChannelFormControl: FormControl;

  public static create(channel: Channel) {
    return new ChannelRow(channel);
  }

  private constructor(public channel: Channel) {}
}

export class ChannelNumberErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
