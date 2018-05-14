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
      channelRow.rowFormGroup.get('selectedChannel').setValidators(this.validateChangeSelectedChannel.bind(this, channelRows));

      Object.values(channelRow.rowFormGroup.controls).forEach(formControl =>
        formControl.valueChanges.subscribe(() => this.channelChanged(channelRow))
      );
    });
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

  private channelChanged(newOrChangedChannel: ChannelRow) {
    if(this.channelsFormGroup.valid) {
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
