import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SecurityCheckDialogComponent} from '../../shared/security-check-dialog/security-check-dialog.component';
import {ChannelDataSource} from './ChannelDataSource';
import {ChannelRow} from './ChannelRow';
import {CreateChannelDialogComponent} from '../create-channel-dialog/create-channel-dialog.component';
import {FormArray, FormGroup} from '@angular/forms';
import {ChannelModel} from '../types/ChannelModel';

/**
 * @title Channels table
 */
@Component({
  selector: 'app-channels-table',
  styleUrls: ['channelsTable.component.css'],
  templateUrl: 'channelsTable.component.html'
})
export class ChannelsTableComponent implements OnInit {
  private _isLoading = false;
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(state) {
    this._isLoading = state;
  }

  displayedColumns = ['channelNumber', 'edit', 'name', 'active', 'action'];

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
    this.channelDataSource.channelRowStream.subscribe(channelRows => {
      this.handleRows(channelRows);
      this.isLoading = false;
    });
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

    addChannelDialog.afterClosed().subscribe(newChannel => {
      if (!!newChannel) {
        this.setLoadingStatus(true, newChannel);
        this.channelDataSource.channelService.createChannel(newChannel)
          .subscribe(result => {
            this.handleResponse(`Kanal wurde ${ result ? '' : 'nicht ' }gespeichert`);
        });
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

    this.setLoadingStatus(true, newOrChangedChannel);

    this.channelDataSource.channelService
      .updateChannel(this.createNewOrChangeChannel(newOrChangedChannel))
      .subscribe(result => {
        this.handleResponse(`Kanal wurde ${ result ? '' : 'nicht ' }gespeichert`);
        this.setLoadingStatus(false, newOrChangedChannel);
      });
  }

  private createNewOrChangeChannel(newOrChangedChannelRow): ChannelModel {
    const changedChannel = Object.assign({}, newOrChangedChannelRow.channel);
    changedChannel.channelNumber = newOrChangedChannelRow.rowFormGroup.get('channelNumber').value;
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
        this.setLoadingStatus(true, channelRow);

        this.channelDataSource.channelService
          .deleteChannel(channelRow.channel.id)
          .subscribe(result => {
            this.handleResponse(`Kanal wurde ${ result ? '' : 'nicht ' }entfernt`);
          });
      }
    });
  }

  private setLoadingStatus(status: boolean, channelRow: ChannelRow) {
    if(channelRow) {
      channelRow.isLoading = status;
    }
    if(status) this.isLoading = true;
  }

  private handleResponse(message: string) {
    this.snackBar.open(message, '' ,{
      duration: 2000,
    });
  }
}
