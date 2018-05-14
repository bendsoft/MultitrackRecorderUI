import {ChannelRow} from "./ChannelRow";
import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";
import {Channel, ChannelService} from "../service/channel.service";
import {Observable} from "rxjs/internal/Observable";
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

export class ChannelDataSource extends DataSource<ChannelRow> {
  private _channelRowStream = new BehaviorSubject<ChannelRow[]>([]);
  public channelRowStream = this._channelRowStream.asObservable();

  constructor(
    public channelService: ChannelService,
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ChannelRow[]> {
    return this.channelService.channelsStream.pipe(
      map(this.transformChannelToSortedChannelRow),
      tap(channelRows => this._channelRowStream.next(channelRows))
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  private transformChannelToSortedChannelRow(channels: Channel[]): ChannelRow[] {
    const sortedChannels = new Array(16);
    channels
      .map(ChannelRow.create)
      .forEach(channelRow => {
        sortedChannels[channelRow.rowFormGroup.get('selectedChannel').value] = channelRow;
      });

    return sortedChannels
      .filter(channel => !!channel)
      .map(channel => channel);
  }
}
