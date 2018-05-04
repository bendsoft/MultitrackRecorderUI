import {Component} from '@angular/core';
import {Channel, ChannelFactory, ChannelService} from "../service/channel.service";
import {MatDialog} from "@angular/material";
import {SecurityCheckDialogComponent} from "../../common/security-check-dialog/security-check-dialog.component";
import {DialogPosition} from "@angular/material/typings/dialog";
import {ChannelDataSource} from "./ChannelDataSource";
import {ChannelRow} from "./ChannelRow";
import {CreateChannelDialogComponent} from "../create-channel-dialog/create-channel-dialog.component";

/**
 * @title Channels table
 */
@Component({
  selector: 'channels-table',
  styleUrls: ['channelsTable.css'],
  templateUrl: 'channelsTable.html'
})
export class ChannelsTable {
  displayedColumns = ['selectedChannel', 'edit', 'name', 'active', 'action'];
  channelRowData;

  constructor(private channelService: ChannelService, private dialog: MatDialog) {
    this.channelRowData = new ChannelDataSource(channelService);
  }

  addNewChannel() {
    //this.channelRowData.push(ChannelRow.create({ id: 11, selectedChannel: 12, name: 'Dummy Entry', active: true, profile: 0 }))

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
      const newChannel = ChannelFactory.create(result);
      console.log(newChannel);
    });
  }

  toggleActive(channelRow: ChannelRow) {}

  editChannelName(channelRow: ChannelRow) {
    channelRow.viewState.editing = !channelRow.viewState.editing;

    if(!channelRow.viewState.editing) {
      this.channelChanged(channelRow)
    }
  }

  channelChanged(newOrChangedChannel: ChannelRow) {
    this.channelService.createOrUpdateChannel(newOrChangedChannel.channel);
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
