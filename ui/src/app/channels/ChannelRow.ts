import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material";

export class ChannelRow {
  availableChannels = this.createAvailableChannels();
  selectedChannel: number;
  name: string;
  active: boolean;
  profile: number;
  selected = new FormControl('valid', [
    Validators.required,
    Validators.pattern(/[0-9]+/),
  ]);
  channelNumberErrorStateMatcher = new ChannelNumberErrorStateMatcher();

  viewState: {
    editing: boolean
  } = { editing: false };

  public static create(channel) {
    return new ChannelRow(channel);
  }

  private constructor(channel) {
    this.selectedChannel = channel.number;
    this.name = channel.name;
    this.active = channel.active;
    this.profile = channel.profile;
  }

  private createAvailableChannels() {
    return Array.from(Array(17).keys()).slice(1);
  }
}

export class ChannelNumberErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
