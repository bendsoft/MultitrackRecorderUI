import {Component} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {RecordingService} from '../service/recording.service';
import {ChannelRecordingFile} from '../service/recording.model';
import {FileNode, FolderNode, FolderType, Node, RecordingListUtils} from './recording-list-utils';

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
        this.nestedDataSource.data = RecordingListUtils.buildFileTree(recordings);
      });

    recordingService.dataStream.subscribe(recordings => {
      this.nestedDataSource.data = RecordingListUtils.buildFileTree(recordings);
    });
  }

  isFile(_: number, node: FileNode<ChannelRecordingFile>) {
    return !!node.file;
  }

  isSimpleFolder(_: number, node: FolderNode) {
    return node.type === FolderType.PLAIN;
  }

  isRecording(_: number, node: FolderNode) {
    return node.type === FolderType.RECORDING;
  }

  isTrack(_: number, node: FolderNode) {
    return node.type === FolderType.TRACK;
  }

  isRecordingOrTrack(_: number, node: FolderNode) {
    return node.type === FolderType.RECORDING || node.type === FolderType.TRACK;
  }

  private _getChildren(node: FolderNode) {
    return node.children;
  }
}
