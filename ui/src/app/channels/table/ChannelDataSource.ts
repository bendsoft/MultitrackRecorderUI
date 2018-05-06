import {ChannelRow} from "./ChannelRow";
import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";
import {Channel, ChannelService} from "../service/channel.service";
import {Observable} from "rxjs/internal/Observable";
import {map} from 'rxjs/operators';

export class ChannelDataSource extends DataSource<ChannelRow> {
  constructor(
    public channelService: ChannelService,
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ChannelRow[]> {
    return this.channelService.channelsStream.pipe(
      map(this.transformChannelToSortedChannelRow)
    );
  }
  disconnect(collectionViewer: CollectionViewer): void {
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
}
