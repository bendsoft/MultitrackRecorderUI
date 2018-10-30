import {Component} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {Observable, of} from 'rxjs';
import {FileFlatNode} from '../types/file-flat-node';
import {FileNode} from '../types/FileNode';
import {RecordingListService} from '../service/recording-list.service';

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.component.html',
  styleUrls: ['./recordings-list.component.css'],
  providers: [RecordingListService]
})
export class RecordingsListComponent {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(recordingListService: RecordingListService) {
    const transformer = (node: FileNode, level: number) => {
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

    recordingListService.dataChange.subscribe(data => {
      this.dataSource.data = data;
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
