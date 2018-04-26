import {Component, ViewChild} from '@angular/core';
import {ChannelService} from "./channel.service";
import {MatDialog, MatSort, MatTableDataSource} from "@angular/material";
import {SecurityCheckDialogComponent} from "../common/security-check-dialog/security-check-dialog.component";
import {DialogPosition} from "@angular/material/typings/dialog";
import {ChannelRow} from "./ChannelRow";

/**
 * @title Channels table
 */
@Component({
  selector: 'channels-table',
  styleUrls: ['channelsTable.css'],
  templateUrl: 'channelsTable.html',
  providers: [ ChannelService ]
})
export class ChannelsTable {
  displayedColumns = ['selectedChannel', 'edit', 'name', 'active', 'action'];
  channelRowData: MatTableDataSource<ChannelRow>;

  private dialog: MatDialog;
  @ViewChild(MatSort) sort: MatSort;

  constructor(channelService: ChannelService, dialog: MatDialog) {
    const channelData: ChannelRow[] = channelService.getChannels()
      .map(ChannelRow.create);
    this.channelRowData = new MatTableDataSource<ChannelRow>(channelData);

    this.dialog = dialog;
  }

  toggleActive(channel) {}

  editChannel(channel) {
    channel.viewState.editing = !channel.viewState.editing;
  }

  channelNumberChanged($event) {

  }

  removeChannel(channel) {
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
