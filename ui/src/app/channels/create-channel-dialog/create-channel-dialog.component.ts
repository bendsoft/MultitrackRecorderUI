import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {Channel} from "../service/channel.service";

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.css']
})
export class CreateChannelDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      availableChannels: number[]
    }
  ) {}
}
