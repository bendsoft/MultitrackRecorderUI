import {Component, OnInit} from '@angular/core';
import {ChannelService} from '../service/channel.service';
import {DialogPosition, MatDialog} from '@angular/material';
import {SecurityCheckDialogComponent} from '../../common/security-check-dialog/security-check-dialog.component';
import {ChannelDataSource} from './ChannelDataSource';
import {ChannelRow} from './ChannelRow';
import {CreateChannelDialogComponent} from '../create-channel-dialog/create-channel-dialog.component';
import {FormArray, FormGroup} from '@angular/forms';
import {ChannelRowValidator} from './ChannelRowValidator';

/**
 * @title Channels table
 */
@Component({
  selector: 'app-channels-table',
  styleUrls: ['channelsTable.component.css'],
  templateUrl: 'channelsTable.component.html'
})
export class ChannelsTableComponent implements OnInit {
  displayedColumns = ['selectedChannel', 'edit', 'name', 'active', 'action'];
  channelRowData;

  private channelsFormGroup = new FormGroup(
    {
      rows: new FormArray([])
    }
  );

  constructor(
    private channelService: ChannelService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.channelRowData = new ChannelDataSource(this.channelService);
    this.channelRowData.channelRowStream.subscribe(this.assignNewRowsFormArray.bind(this));
  }

  private assignNewRowsFormArray(channelRows: ChannelRow[]) {
    this.channelsFormGroup.setControl(
      'rows',
      new FormArray(channelRows.map(row => row.rowFormGroup))
    );

    channelRows.forEach(channelRow => {
      channelRow.rowFormGroup.get('selectedChannel').setValidators(
        ChannelRowValidator.checkUnique.bind(this, 'selectedChannel', channelRows)
      );
      channelRow.rowFormGroup.get('name').setValidators(
        ChannelRowValidator.checkUnique.bind(this, 'name', channelRows)
      );

      Object.values(channelRow.rowFormGroup.controls).forEach(formControl =>
        formControl.valueChanges.subscribe(() => this.channelChanged(channelRow))
      );
    });
  }

  addNewChannel() {
    const position: DialogPosition = {
      top: '200px'
    };

    const dialogRef = this.dialog.open(CreateChannelDialogComponent, {
      height: '20rem',
      width: '25rem',
      position,
      data: {
        availableChannels: ChannelRow._allChannelNumbers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.channelService.createOrUpdateChannel(result);
    });
  }

  toggleEditMode(channelRow: ChannelRow) {
    const options = { onlySelf: true, emitEvent: false };
    const nameFormControl = channelRow.rowFormGroup.get('name');

    if (nameFormControl.disabled) {
      nameFormControl.enable(options);
      console.log(channelRow);
    } else if (nameFormControl.valid) {
      nameFormControl.disable(options);
    }
  }

  private channelChanged(newOrChangedChannel: ChannelRow) {
    if (this.channelsFormGroup.invalid || newOrChangedChannel.rowFormGroup.get('name').enabled) {
      return;
    }

    const createNewOrChangedChannel = changedChannel => {
      changedChannel = Object.assign({}, newOrChangedChannel.channel);
      changedChannel.selectedChannel = newOrChangedChannel.rowFormGroup.get('selectedChannel').value;
      changedChannel.name = newOrChangedChannel.rowFormGroup.get('name').value;
      changedChannel.active = newOrChangedChannel.rowFormGroup.get('active').value;

      return changedChannel;
    };

    this.channelService.createOrUpdateChannel(
      (this.channelsFormGroup.get('rows') as FormArray).controls
      .filter(formControl => formControl.dirty)
      .map(createNewOrChangedChannel)
    );
  }

  removeChannel(channelRow: ChannelRow) {
    const position: DialogPosition = {
      top: '200px'
    };

    const dialogRef = this.dialog.open(SecurityCheckDialogComponent, {
      height: '190px',
      width: '400px',
      position
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
