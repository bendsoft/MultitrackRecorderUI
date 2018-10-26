import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SecurityCheckDialogComponent} from '../../common/security-check-dialog/security-check-dialog.component';
import {ChannelDataSource} from './ChannelDataSource';
import {ChannelRow} from './ChannelRow';
import {CreateChannelDialogComponent} from '../create-channel-dialog/create-channel-dialog.component';
import {FormArray, FormGroup} from '@angular/forms';

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
    public channelDataSource: ChannelDataSource,
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
    const addChannelDialog = this.dialog.open(CreateChannelDialogComponent, {
      height: '20rem',
      width: '25rem',
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
      } else if (nameFormControl.valid) {
        nameFormControl.disable(options);

        this.channelChanged(channelRow);
      }
    }
  }

  private channelChanged(newOrChangedChannel: ChannelRow) {
    if (this.channelsFormGroup.invalid || newOrChangedChannel.rowFormGroup.get('name').enabled) {
      return;
    }

    newOrChangedChannel.isLoading = true;
    setTimeout(() => {
        this.channelDataSource.channelService
          .createOrUpdateChannel(this.createNewOrChangedChannel(newOrChangedChannel))
          .subscribe(result => {
            this.backendProcessResponse(result,`Kanal wurde ${ result ? '' : 'nicht ' }gespeichert`);
            newOrChangedChannel.isLoading = false
          });
      },
      3000
    );
  }

  private createNewOrChangedChannel(newOrChangedChannelRow) {
    const changedChannel = Object.assign({}, newOrChangedChannelRow.channel);
    changedChannel.selectedChannel = newOrChangedChannelRow.rowFormGroup.get('selectedChannel').value;
    changedChannel.name = newOrChangedChannelRow.rowFormGroup.get('name').value;
    changedChannel.active = newOrChangedChannelRow.rowFormGroup.get('active').value;

    return changedChannel;
  };

  removeChannel(channelRow: ChannelRow) {
    const checkChannelRemovalDialog = this.dialog.open(SecurityCheckDialogComponent, {
      height: '190px',
      width: '400px'
    });

    checkChannelRemovalDialog.afterClosed().subscribe(removeChannel => {
      if(removeChannel === true) {
        this.channelDataSource.channelService
          .removeChannel(channelRow.channel)
          .subscribe(result => this.backendProcessResponse(result,`Kanal wurde ${ result ? '' : 'nicht ' }entfernt`));
      }
    });
  }

  private backendProcessResponse(result, message: string) {
    this.snackBar.open(message, '' ,{
      duration: 2000,
    })
  }
}
