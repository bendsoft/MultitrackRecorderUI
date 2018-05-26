import {Component, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  filename: string;
  type: any;
  level: number;
  expandable: boolean;
}

@Injectable()
export class FileDatabase {
  dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(value: any, level: number): FileNode[] {
    const data: any[] = [];
    for (const k in value) {
      const v = value[k];
      const node = new FileNode();
      node.filename = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        node.children = this.buildFileTree(v, level + 1);
      } else {
        node.type = v;
      }
      data.push(node);
    }
    return data;
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
      flatNode.type = node.type;
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
const TREE_DATA = `
  {
    "2017": {
      "November": {
        "05": {
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
        }
      },
      "Dezember": {
        "08": {
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
        }
      }
    },
    "2018": {
      "Januar": {
        "15": {
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
        }
      },
      "Februar": {
        "25": {
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
        }
      },
      "März": {
        "16": {
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
      }
    }
}`;
