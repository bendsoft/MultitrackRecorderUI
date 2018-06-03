import {Component, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';

class FileNode {
  children: FileNode[];
  filename: string;
  metadata: any;
}

class FileFlatNode {
  filename: string;
  metadata: any;
  level: number;
  expandable: boolean;
}

enum SORT_WAY {
  ASC, DESC
}

@Injectable()
export class FileDatabase {
  dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    const dataObject = JSON.parse(TREE_DATA);

    const data = this.buildFileTree(dataObject, 0);
    this.dataChange.next(this.sortBy(data, 'filename', SORT_WAY.DESC));
  }

  buildFileTree(value: any, level: number): FileNode[] {
    const data: FileNode[] = [];
    Object.entries(value).forEach(keyValue => {
      const node = new FileNode();
      node.filename = `${keyValue[0]}`;

      const nodeValue = keyValue[1] as FileNode;
      if (this.isFileMetadata(nodeValue)) {
        node.metadata = nodeValue;
      } else if (typeof nodeValue === 'object') {
        node.children = this.buildFileTree(nodeValue, level + 1);
      }
      data.push(node);
    });

    return data;
  }

  private isFileMetadata(node: FileNode) {
    const metadataProperties = ['id', 'size'];

    return metadataProperties
      .filter(prop => node.hasOwnProperty(prop))
      .length > 0;
  }

  private sortBy(data: FileNode[], key: string, sortWay: SORT_WAY = SORT_WAY.ASC): FileNode[] {
    if (!Array.isArray(data)) {
      return data;
    }

    const applySortWay = (a, way) => way === SORT_WAY.ASC ? a : a * -1;
    const compareNumbers = (a, b) => a - b;
    const compareStrings = (a, b) => a < b ? -1 : a > b ? 1 : 0;

    const sortAlgorithmToUse = (a, b, way) => applySortWay(
      Number.isInteger(data[0][key]) ? compareNumbers(a, b) : compareStrings(a, b), way
    );

    return data
      .map(node => node[key])
      .sort((a, b) => sortAlgorithmToUse(a, b, sortWay))
      .map(keyValue => data.find(node => node[key] === keyValue));
  }
}

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.component.html',
  styleUrls: ['./recordings-list.component.css'],
  providers: [FileDatabase]
})
export class RecordingsListComponent {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(database: FileDatabase) {
    const transformer = (node: FileNode, level: number) => {
      const flatNode = new FileFlatNode();
      flatNode.filename = node.filename;
      flatNode.metadata = node.metadata;
      flatNode.level = level;
      flatNode.expandable = !!node.children;
      return flatNode;
    };

    this.treeFlattener = new MatTreeFlattener(transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  private _getLevel = (node: FileFlatNode) => node.level;
  private _isExpandable = (node: FileFlatNode) => node.expandable;
  private _getChildren = (node: FileNode): Observable<FileNode[]> => of(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = `{
  "20171105": {
    "Aufnahme 1": {
      "Gesang Robin": {
        "id": 12,
        "size": 2345345
      },
      "Gesang Beni": {
        "id": 13,
        "size": 2698567
      },
      "Gesang Silvan": {
        "id": 14,
        "size": 3456345
      }
    }
  },
  "20171208": {
    "Aufnahme 1": {
      "Gesang Robin": {
        "id": 22,
        "size": 2345345
      },
      "Gesang Beni": {
        "id": 23,
        "size": 2698567
      },
      "Gesang Silvan": {
        "id": 24,
        "size": 3456345
      }
    }
  },
  "20180115": {
    "Aufnahme 1": {
      "Gesang Robin": {
        "id": 32,
        "size": 2345345
      },
      "Gesang Beni": {
        "id": 33,
        "size": 2698567
      },
      "Gesang Silvan": {
        "id": 34,
        "size": 3456345
      }
    }
  },
  "20180225": {
    "Aufnahme 1": {
      "Gesang Robin": {
        "id": 42,
        "size": 2345345
      },
      "Gesang Beni": {
        "id": 443,
        "size": 2698567
      },
      "Gesang Silvan": {
        "id": 44,
        "size": 3456345
      }
    }
  },
  "20180316": {
    "Aufnahme 1": {
      "Gesang Robin": {
        "id": 52,
        "size": 2345345
      },
      "Gesang Beni": {
        "id": 53,
        "size": 2698567
      },
      "Gesang Silvan": {
        "id": 54,
        "size": 3456345
      }
    }
  }
}`;
