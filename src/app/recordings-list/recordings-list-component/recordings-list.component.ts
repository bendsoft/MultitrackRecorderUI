import {Component} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {RecordingService} from '../service/recording.service';
import {Node} from '../types/Node';
import {ChannelRecordingFile, Recording} from '../types/Recording';
import * as _ from 'lodash';
import {FolderNode} from '../types/FolderNode';
import {FileNode} from "../types/FileNode";

import * as _moment from 'moment';
const moment = _moment;
moment.locale('de-CH');

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.component.html',
  styleUrls: ['./recordings-list.component.css'],
  providers: [RecordingService]
})
export class RecordingsListComponent {
  nestedTreeControl: NestedTreeControl<Node>;
  nestedDataSource: MatTreeNestedDataSource<Node>;

  constructor(recordingService: RecordingService) {
    this.nestedTreeControl = new NestedTreeControl<Node>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    recordingService.getAll()
      .subscribe(recordings => {
        this.nestedDataSource.data = this.buildFileTree(recordings);
      });

    recordingService.dataStream.subscribe(data => {
      this.nestedDataSource.data = this.buildFileTree(data);
    });
  }

  isFile(_: number, node: FileNode<ChannelRecordingFile>) {
    return !!node.file;
  }

  isRecording(_: number, node: FolderNode) {
    return !!node.isRecording;
  }

  private _getChildren(node: FolderNode) {
    return node.children;
  }

  private groupByName(groupedFolders, currFolder) {
    const folderFound = groupedFolders.find(folder => folder.filename === currFolder.filename);
    if(folderFound) {
      currFolder.children.forEach(rec => folderFound.children.push(rec));
    } else {
      groupedFolders.push(currFolder);
    }
    return groupedFolders;
  };

  private buildFileTree(recordings: Recording[]): FolderNode[] {
    return _
      .chain(recordings)
      .sortBy(['date', 'name'])
      .map((rec): FolderNode => ({
          filename: this.extractYear(rec),
          isRecording: false,
          children: new Array<FolderNode>(
            {
              filename: this.extractDayMonth(rec),
              isRecording: false,
              children: new Array<FolderNode>(
                {
                  filename: rec.name,
                  id: rec.id,
                  isRecording: true,
                  children: new Array<FileNode<ChannelRecordingFile>>(...
                    _.chain(rec.channels)
                      .map(channel => ({
                        filename: channel.name,
                        file: channel
                      }))
                      .sortBy('file.channelNr')
                      .value()
                  )
                }
              )
            }
          )
      }))
      .reduce(this.groupByName,[])
      .tap(folderTree => folderTree.forEach(yearFolder => {
        yearFolder.children = yearFolder.children.reduce(this.groupByName,[])
      }))
      .value();
  }

  private extractYear(recording) {
    return (recording.date as string).substring(0, 4);
  }

  private extractDayMonth(recording) {
    return moment((recording.date as string), 'YYYYMMDD').format('Do MMMM');
  }
}
