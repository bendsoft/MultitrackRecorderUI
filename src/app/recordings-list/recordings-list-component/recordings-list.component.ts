import {Component} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {Observable, of} from 'rxjs';
import {FileNode} from '../types/FileNode';
import {RecordingService} from '../service/recording.service';
import {Node} from '../types/Node';
import {Recording} from '../types/Recording';
import * as _ from 'lodash';
import * as _moment from 'moment';
import {FolderNode} from '../types/FolderNode';
const moment = _moment;

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.component.html',
  styleUrls: ['./recordings-list.component.css'],
  providers: [RecordingService]
})
export class RecordingsListComponent {
  treeControl: FlatTreeControl<Node>;
  treeFlattener: MatTreeFlattener<FileNode, Node>;
  dataSource: MatTreeFlatDataSource<FileNode, Node>;

  constructor(recordingService: RecordingService) {
    const transformer = (node: Node, level: number) => {
      const flatNode = new FileFlatNode();
      flatNode.filename = node.filename;
      flatNode.metadata = node.metadata;
      flatNode.level = level;
      flatNode.isFile = !Array.isArray(node.children);
      flatNode.isRecordingFolder = this.isFolderContainingRecordings(node);
      return flatNode;
    };

    this.treeFlattener = new MatTreeFlattener(transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    recordingService.dataStream.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  private buildFileTree(recordings: Recording[]) {
    const recordingsTree: FolderNode[] = [];

    const byYear = _.groupBy(recordings, recording => (recording.date as string).substring(0, 4));
    const byYearAndMonthDay = byYear.map(year =>
      _.groupBy(year, recording =>
        moment((recording.date as string).substring(4, 4), 'MMDD').format('Do MMMM')
      )
    );

    const byYearAndMonthDayAndRecordingName = byYearAndMonthDay.map(monthDay => _.groupBy(monthDay, 'name'));

     recordings.map(recording => {
      const year = (recording.date as string).substring(0, 4);
      const dayMonth = moment((recording.date as string).substring(4, 4), 'MMDD').format('Do MMMM');

    });
  }

  private isFolderContainingRecordings(node: FileNode) {
    return Array.isArray(node.children)
      && !Array.isArray(node.children[0].children);
  }

  private getLevel(node: FileFlatNode) {
    return node.level;
  }
  private isExpandable(node: FileFlatNode) {
    return !node.isFile;
  }
  private getChildren(node: FileNode): Observable<FileNode[]> {
    return of(node.children);
  }

  isFile(_: number, _nodeData: FileFlatNode) {
    return _nodeData.isFile;
  }

  isRecording(_: number, _nodeData: FileFlatNode) {
    return _nodeData.isRecordingFolder;
  }
}
