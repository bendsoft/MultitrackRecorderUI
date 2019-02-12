import {Component} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {RecordingService} from '../service/recording.service';
import {ChannelRecordingFile} from '../types/ChannelRecordingFile';
import {FileNode, FolderNode, FolderType, Node, RecordingListUtils} from './recording-list-utils';
import {RecordingModel} from '../types/RecordingModel'

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.component.html',
  styleUrls: ['./recordings-list.component.css']
})
export class RecordingsListComponent {
  nestedTreeControl: NestedTreeControl<Node>;
  nestedDataSource: MatTreeNestedDataSource<Node>;

  constructor(recordingService: RecordingService) {
    this.nestedTreeControl = new NestedTreeControl<Node>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    recordingService.getRecordings()
      .subscribe(recordings => {
        this.nestedDataSource.data = RecordingListUtils.buildFileTree(recordings);
      });

    recordingService.changesStream.subscribe((recordings: RecordingModel[]) => {
      this.nestedDataSource.data = RecordingListUtils.buildFileTree(recordings);
    });
  }

  isFile(_: number, node: FileNode<ChannelRecordingFile>) {
    return !!node.file;
  }

  isRecordingOrTrack(_: number, node: FolderNode) {
    return node.folderType === FolderType.RECORDING || node.folderType === FolderType.TRACK;
  }

  private _getChildren(node: FolderNode) {
    return node.children;
  }
}
