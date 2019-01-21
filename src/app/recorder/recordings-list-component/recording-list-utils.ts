import {ChannelRecordingFile, RecordingModel, Track} from '../service/recording.model';
import * as _ from 'lodash';
import * as _moment from 'moment';

const moment = _moment;
moment.locale('de-CH');

export interface FileNode<T> extends Node {
  file: T;
}

export enum FolderType {
  PLAIN, RECORDING, TRACK
}

export interface FolderNode extends Node {
  id?: number | string;
  folderType: FolderType;
  children: Node[];
}

export interface Node {
  filename: String;
}

export class RecordingListUtils {
  public static buildFileTree(recordings: RecordingModel[]): Node[] {
    const yearsMap = new Map<string, FolderNode>();

    _.orderBy(recordings, 'recordingDate', 'desc')
      .filter(rec => rec.tracks.length > 0)
      .forEach((rec) => {
        let sessionItem = {
          filename: `${RecordingListUtils.extractDayMonth(rec)} ${rec.name}`,
          folderType: FolderType.RECORDING,
          children: RecordingListUtils.createTrackList(rec.tracks)
        };

        const year = RecordingListUtils.extractYear(rec);
        if (yearsMap.has(year)) {
          yearsMap.get(year).children.push(sessionItem);
        } else {
          yearsMap.set(year, {
            filename: year,
            folderType: FolderType.PLAIN,
            children: new Array<FolderNode>(sessionItem)
          });
        }
      });

    return Array.from(yearsMap.values());
  }

  private static createTrackList(tracks: Track[]): FolderNode[] {
    return _.sortBy(tracks,'trackNumber')
      .map(track => ({
        filename: `${track.trackNumber}. ${track.name}`,
        id: track.id,
        folderType: FolderType.TRACK,
        children: RecordingListUtils.createChannelList(track.channels)
      }));
  }

  private static createChannelList(channels: ChannelRecordingFile[]): FileNode<ChannelRecordingFile>[] {
    return _.sortBy(channels, 'channelNumber')
      .map((channel): FileNode<ChannelRecordingFile> => ({
        filename: channel.name,
        file: channel
      }));
  }

  private static extractYear(recording: RecordingModel) {
    return (recording.recordingDate as string).substring(0, 4);
  }

  private static extractDayMonth(recording: RecordingModel) {
    return moment((recording.recordingDate as string), 'YYYYMMDD').format('Do MMMM');
  }
}
