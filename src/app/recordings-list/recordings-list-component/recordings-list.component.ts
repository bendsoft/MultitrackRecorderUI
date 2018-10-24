import {Component} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {Observable, of} from 'rxjs';
import {FileFlatNode} from '../types/file-flat-node';
import {FileNode} from '../types/file-node';
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
      flatNode.expandable = !!node.children;
      return flatNode;
    };

    this.treeFlattener = new MatTreeFlattener(transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    recordingListService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  private getLevel = (node: FileFlatNode) => node.level;
  private isExpandable = (node: FileFlatNode) => node.expandable;
  private getChildren = (node: FileNode): Observable<FileNode[]> => of(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
}
