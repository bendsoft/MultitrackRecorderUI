import {ChannelRecordingFile} from '../types/channel-recording-file';
import * as _ from 'lodash';
import * as _moment from 'moment';
import {Recording} from '../types/recording'
import {Track} from '../types/track'

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
  public static buildFileTree(recordings: Recording[]): FolderNode[] {
    const yearsMap = new Map<string, FolderNode>();

    _.orderBy(recordings, 'recordingDate', 'desc')
      .filter(rec => rec.tracks.length > 0)
      .forEach((rec) => {
        const sessionItem = {
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
            children: [sessionItem]
          });
        }
      });

    return Array.from(yearsMap.values());
  }

  private static createTrackList(tracks: Track[]): FolderNode[] {
    return _.sortBy(tracks,'trackNumber')
      .map(track => ({
        filename: `${track.trackNumber}. ${track.name}`,
        folderType: FolderType.TRACK,
        children: RecordingListUtils.createChannelList(track.channelRecordingFiles)
      }));
  }

  private static createChannelList(channels: ChannelRecordingFile[]): FileNode<ChannelRecordingFile>[] {
    return _.sortBy(channels, 'channelNumber')
      .map((channel): FileNode<ChannelRecordingFile> => ({
        filename: channel.name,
        file: channel
      }));
  }

  private static extractYear(recording: Recording) {
    return (recording.recordingDate as string).substring(0, 4);
  }

  private static extractDayMonth(recording: Recording) {
    return moment((recording.recordingDate as string), 'YYYYMMDD').format('Do MMMM');
  }
}
