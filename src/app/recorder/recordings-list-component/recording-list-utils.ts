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
  id?: number;
  folderType: FolderType;
  children: Node[];
}

export interface Node {
  filename: String;
}

export class RecordingListUtils {
  public static buildFileTree(recordings: RecordingModel[]): Node[] {
    const yearsMap = new Map<string, FolderNode>();
    _.sortBy(recordings, ['date', 'name']);
    recordings.forEach((rec) => {
        const year = RecordingListUtils.extractYear(rec);
        yearsMap.set(year, {
          filename: year,
          folderType: FolderType.PLAIN,
          children: new Array<FolderNode>(
            {
              filename: `${RecordingListUtils.extractDayMonth(rec)} ${rec.name}`,
              folderType: FolderType.RECORDING,
              children: this.createTrackList(rec)
            }
          )
        });
      });
    return Array.from(yearsMap.values());
  }

  private static createTrackList(rec: RecordingModel): FolderNode[] {
    return _.chain(rec.tracks)
      .sortBy('track.trackNumber')
      .map(track => ({
        filename: `${track.trackNumber}. ${track.name}`,
        id: track.id,
        folderType: FolderType.TRACK,
        children: this.createChannelList(track)
      }))
      .value();
  }

  private static createChannelList(track: Track): FileNode<ChannelRecordingFile>[] {
    return _.chain(track.channels)
      .sortBy('file.channelNr')
      .map((channel): FileNode<ChannelRecordingFile> => ({
        filename: channel.name,
        file: channel
      }))
      .value();
  }

  private static groupByName(groupedFolders, currFolder) {
    const folderFound = groupedFolders.find(folder => folder.filename === currFolder.filename);
    if (folderFound) {
      currFolder.children.forEach(rec => folderFound.children.push(rec));
    } else {
      groupedFolders.push(currFolder);
    }
    return groupedFolders;
  }

  private static extractYear(recording: RecordingModel) {
    return (recording.date as string).substring(0, 4);
  }

  private static extractDayMonth(recording: RecordingModel) {
    return moment((recording.date as string), 'YYYYMMDD').format('Do MMMM');
  }
}
