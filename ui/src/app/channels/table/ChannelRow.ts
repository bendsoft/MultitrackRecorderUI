import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material";
import {Channel} from "../service/channel.service";

export class ChannelRow {
  static readonly _allChannelNumbers = Array.from(Array(17).keys()).slice(1);
  get allChannelNumbers() {
    return ChannelRow._allChannelNumbers;
  }

  viewState: {
    editing
  } = {
    editing: false
  };

  chooseChannelErrorStateMatcher = new ChannelNumberErrorStateMatcher();

  rowFormGroup: FormGroup;

  public static create(channel: Channel) {
    return new ChannelRow(channel);
  }

  private constructor(public channel: Channel) {
    this.rowFormGroup = new FormGroup({
      selectedChannel: new FormControl(channel.selectedChannel, Validators.required),
      name: new FormControl(channel.name, Validators.required),
      active: new FormControl(channel.active)
    });
  }
}

export class ChannelNumberErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
