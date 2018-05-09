import {Component, OnInit} from '@angular/core';
import {Channel, ChannelService} from "../service/channel.service";
import {DialogPosition, MatDialog, MatSelectChange, MatSlideToggleChange} from "@angular/material";
import {SecurityCheckDialogComponent} from "../../common/security-check-dialog/security-check-dialog.component";
import {ChannelDataSource} from "./ChannelDataSource";
import {ChannelRow} from "./ChannelRow";
import {CreateChannelDialogComponent} from "../create-channel-dialog/create-channel-dialog.component";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {noop} from "rxjs/internal-compatibility";

/**
 * @title Channels table
 */
@Component({
  selector: 'channels-table',
  styleUrls: ['channelsTable.css'],
  templateUrl: 'channelsTable.html'
})
export class ChannelsTable implements OnInit {
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
      this.subscribeToChannelChange(channelRow, channelRows);
    });
  }

  private subscribeToChannelChange(channelRow, channelRows: ChannelRow[]) {
    const formControl = channelRow.rowFormGroup.get('selectedChannel') as FormControl;

    formControl.setValidators(this.validateChangeSelectedChannel.bind(this, channelRows));

    formControl.valueChanges.subscribe(channelNr => noop()
    )
  }

  private validateChangeSelectedChannel(
    channelRows: ChannelRow[],
    changedFormControl: FormControl
  ) {
    let isUnique = true;
    channelRows
      .map(row => row.rowFormGroup.get('selectedChannel') as FormControl)
      .forEach(formControl => {
        if(formControl.value === changedFormControl.value && formControl !== changedFormControl) {
          formControl.setErrors({ 'notUnique': true });
          isUnique = false;
        } else {
          formControl.setErrors(null);
        }
      });

    return isUnique ? null : { 'notUnique': true };
  }

  addNewChannel() {
    const position: DialogPosition = {
      top: '200px'
    };

    let dialogRef = this.dialog.open(CreateChannelDialogComponent, {
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
    channelRow.viewState.editing = !channelRow.viewState.editing;
  }

  selectedChannelChanged(newChannel: MatSelectChange, oldChannel: ChannelRow) {
    //const changedChannel = Object.assign({}, oldChannel.channel);
    //changedChannel.selectedChannel = newChannel.value;

    //this.channelChanged(changedChannel);
  }

  private channelChanged(newOrChangedChannel: Channel) {
    this.channelService.createOrUpdateChannel(newOrChangedChannel);
  }

  removeChannel(channelRow: ChannelRow) {
    const position: DialogPosition = {
      top: '200px'
    };

    let dialogRef = this.dialog.open(SecurityCheckDialogComponent, {
      height: '190px',
      width: '400px',
      position
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
