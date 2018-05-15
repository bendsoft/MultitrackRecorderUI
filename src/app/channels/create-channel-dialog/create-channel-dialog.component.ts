import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChannelErrorStateMatcher, ChannelRow} from '../table/ChannelRow';
import {ChannelRowValidator} from '../table/ChannelRowValidator';
import {Observable} from 'rxjs';

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
      availableChannels: number[],
      channelRowStream: Observable<ChannelRow[]>
    }
  ) {
    this.availableChannels = data.availableChannels;

    data.channelRowStream.subscribe(channelRows => {
      this.createChannelForm = new FormGroup({
        selectedChannel: new FormControl('', [
            Validators.required,
            ChannelRowValidator.checkUnique.bind(this, 'selectedChannel', channelRows, false)
          ]
        ),
        name: new FormControl('', [
            Validators.required,
            ChannelRowValidator.checkUnique.bind(this, 'name', channelRows, false)
          ]
        ),
        active: new FormControl(true)
      });
    });
  }
}
