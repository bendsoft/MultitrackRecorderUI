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

    var recordings = [
      { date: '20170101', name: 'barney', channels: [1,2,3,4,5] },
      { date: '20170102', name: 'alfred', channels: [1,2,3,4,5] },
      { date: '20160202', name: 'pebbles', channels: [1,2,3,4,5] }
    ];

    var fileTree = _
      .chain(recordings)
      .sortBy(['date', 'name'])
      .map(rec => ({ name: rec.date.substring(0,4), isRecording: false, children: [rec] }))
      .reduce((yearFolders, currFolder) => {
        const yearFolderFound = yearFolders.find(folder => folder.name === currFolder.name);
        if(yearFolderFound) {
          currFolder.children.forEach(rec => yearFolderFound.children.push(rec));
        } else {
          yearFolders.push(currFolder);
        }
        return yearFolders;
      },[])
      //.groupBy(rec => rec.date.substring(0,4))
      //.mapKeys(year => ({ name: year })
      //.mapValues(recordingsByYear => _.chain(recordingsByYear)
      //  .groupBy(rec => rec.date.substring(4,4))
      //  .value()
      //)
      .value();


    const byYearAndMonthDay = _.groupBy(recordings, this.extractYear);

    Object.values(byYearAndMonthDay)
      .map(year => _.groupBy(year, this.extractDayMonth));


     recordings.map(recording => {
      const year = (recording.date as string).substring(0, 4);
      const dayMonth = moment((recording.date as string).substring(4, 4), 'MMDD').format('Do MMMM');

    });
  }

  private convertToFolderNode(
    recording: Recording,
    keyExtractor: (recording: Recording) => string,
    childrenExtractor: (recording: Recording) => Node[]
  ): FolderNode {

  }

  private extractYear(recording) {
    return (recording.date as string).substring(0, 4);
  }

  private extractDayMonth(recording) {
    return moment((recording.date as string).substring(4, 4), 'MMDD').format('Do MMMM');
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
