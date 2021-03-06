import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormGroup} from '@angular/forms';
import {ChannelErrorStateMatcher, ChannelRow} from '../table/channel-row';
import {ChannelDataSource} from '../table/channel-data-source';

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.css']
})
export class CreateChannelDialogComponent {
  availableChannels: number[];
  createChannelForm: FormGroup;
  chooseChannelErrorStateMatcher = new ChannelErrorStateMatcher(true, true);
  nameErrorStateMatcher = new ChannelErrorStateMatcher(true, true);

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      availableChannels: number[]
    },
    channelDataSource: ChannelDataSource
) {
    this.availableChannels = data.availableChannels;

    const channelRow = ChannelRow.create(
      {
        id: null,
        channelNumber: null,
        name: '',
        active: true
      },
      channelDataSource,
      false
    );

    this.createChannelForm = channelRow.rowFormGroup;
  }
}
