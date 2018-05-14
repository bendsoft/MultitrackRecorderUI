import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.css']
})
export class CreateChannelDialogComponent {
  private availableChannels: number[];

  createChannelForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      availableChannels: number[]
    }
  ) {
    this.availableChannels = data.availableChannels;

    this.createChannelForm = new FormGroup({
      selectedChannel: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      active: new FormControl()
    })
  }
}
