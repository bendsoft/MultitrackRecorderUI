import {ChannelRow} from './ChannelRow';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {Channel, ChannelService} from '../service/channel.service';
import {Observable} from 'rxjs/internal/Observable';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ChannelDataSource extends DataSource<ChannelRow> {
  private _channelRowStream = new BehaviorSubject<ChannelRow[]>([]);
  public channelRowStream = this._channelRowStream.asObservable();

  constructor(
    public channelService: ChannelService
  ) {
    super();

    channelService.channelsStream.subscribe(channels =>
      this._channelRowStream.next(this.transformChannelToSortedChannelRow(channels))
    );
  }

  connect(collectionViewer: CollectionViewer): Observable<ChannelRow[]> {
    return this.channelRowStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  getChannelRows() {
    return this._channelRowStream.getValue();
  }

  private transformChannelToSortedChannelRow(channels: Channel[]): ChannelRow[] {
    const sortedChannels = new Array(16);
    channels
      .map(channel => ChannelRow.create(channel, this))
      .forEach(channelRow => {
        sortedChannels[channelRow.rowFormGroup.get('selectedChannel').value] = channelRow;
      });

    return sortedChannels
      .filter(channel => !!channel);
  }
}
