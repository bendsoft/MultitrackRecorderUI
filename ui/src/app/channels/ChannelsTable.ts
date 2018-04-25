import {Component} from '@angular/core';
import {ChannelService} from "./channel.service";
import {MatDialog} from "@angular/material";
import {SecurityCheckDialogComponent} from "../common/security-check-dialog/security-check-dialog.component";

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
  displayedColumns = ['position', 'name', 'active', 'action'];
  dataSource;
  private dialog: MatDialog;

  constructor(channelService: ChannelService, dialog: MatDialog) {
    this.dataSource = channelService.getChannels();
    this.dialog = dialog;
  }

  toggleActive(channel) {

  }

  removeChannel(channel) {
    let dialogRef = this.dialog.open(SecurityCheckDialogComponent, {
      height: '190px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
