import {ChannelRow} from "./ChannelRow";
import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import {Channel, ChannelService} from "../service/channel.service";
import 'rxjs/add/observable/from';
import "rxjs/add/operator/map";

export class ChannelDataSource extends DataSource<ChannelRow> {
  constructor(
    public channelService: ChannelService,
  ) {
    super();
  }

  private transformChannelToSortedChannelRow(channels: Channel[]): ChannelRow[] {
    const sortedChannels = new Array(16);
    channels
      .map(ChannelRow.create)
      .forEach(channelRow => {
        sortedChannels[channelRow.channel.selectedChannel] = channelRow;
      });

    return sortedChannels
      .filter(channel => !!channel)
      .map(channel => channel);
  }

  connect(collectionViewer: CollectionViewer): Observable<ChannelRow[]> {
    return this.channelService.channelsStream
      .map(this.transformChannelToSortedChannelRow);
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
