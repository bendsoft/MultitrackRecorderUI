import {Component, OnInit} from '@angular/core';
import {ChannelService} from '../service/channel.service';
import {DialogPosition, MatDialog, MatSnackBar} from '@angular/material';
import {SecurityCheckDialogComponent} from '../../common/security-check-dialog/security-check-dialog.component';
import {ChannelDataSource} from './ChannelDataSource';
import {ChannelRow} from './ChannelRow';
import {CreateChannelDialogComponent} from '../create-channel-dialog/create-channel-dialog.component';
import {FormArray, FormGroup, Validators} from '@angular/forms';
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

  private channelsFormGroup = new FormGroup(
    {
      rows: new FormArray([])
    }
  );

  constructor(
    private dialog: MatDialog,
    private channelDataSource: ChannelDataSource,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.channelDataSource.channelRowStream.subscribe(this.handleRows.bind(this));
  }

  private handleRows(channelRows: ChannelRow[]) {
    this.channelsFormGroup.setControl(
      'rows',
      new FormArray(channelRows.map(row => row.rowFormGroup))
    );

    channelRows.forEach(channelRow => {
      Object.values(channelRow.rowFormGroup.controls).forEach(formControl =>
        formControl.valueChanges.subscribe(() => this.channelChanged(channelRow))
      );
    });
  }

  addNewChannel() {
    const position: DialogPosition = {
      top: '200px'
    };

    const addChannelDialog = this.dialog.open(CreateChannelDialogComponent, {
      height: '20rem',
      width: '25rem',
      position,
      data: {
        availableChannels: ChannelRow._allChannelNumbers
      }
    });

    addChannelDialog.afterClosed().subscribe(result => {
      if (!!result) {
        this.channelDataSource.channelService.createOrUpdateChannel(result);
      }
    });
  }

  toggleEditMode(channelRow: ChannelRow) {
    const options = { onlySelf: true, emitEvent: false };
    const nameFormControl = channelRow.rowFormGroup.get('name');

    if (channelRow.rowFormGroup.status === 'VALID') {
      if (nameFormControl.disabled) {
        nameFormControl.enable(options);
        console.log(channelRow);
      } else if (nameFormControl.valid) {
        nameFormControl.disable(options);
      }
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

    this.channelDataSource.channelService.createOrUpdateChannel(
      (this.channelsFormGroup.get('rows') as FormArray).controls
        .filter(formControl => formControl.dirty)
        .map(createNewOrChangedChannel)
    );
  }

  removeChannel(channelRow: ChannelRow) {
    const position: DialogPosition = {
      top: '200px'
    };

    const checkChannelRemovalDialog = this.dialog.open(SecurityCheckDialogComponent, {
      height: '190px',
      width: '400px',
      position
    });

    checkChannelRemovalDialog.afterClosed().subscribe(removeChannel => {
      if(removeChannel === true) {
        this.channelDataSource.channelService.removeChannel(channelRow.channel)
          .subscribe(result => this.snackBar.open(`Kanal wurde ${ result ? '' : 'nicht ' }entfernt`, '' ,{
              duration: 2000,
            })
          );
      }
    });
  }
}
