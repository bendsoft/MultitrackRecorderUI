import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FileNode} from '../types/file-node';

enum SORT_WAY {
  ASC, DESC
}

@Injectable({
  providedIn: 'root'
})
export class RecordingListService {
  private _dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
  dataChange = this._dataChange.asObservable();

  get data(): FileNode[] { return this._dataChange.value; }

  constructor() {
    const dataObject = JSON.parse(TREE_DATA);

    const data = this.buildFileTree(dataObject, 0);
    this._dataChange.next(this.sortBy(data, 'filename', SORT_WAY.DESC));
  }

  private buildFileTree(value: any, level: number): FileNode[] {
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

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = `
  {
    "2017": {
      "5. November": {
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
      "8. Dezember": {
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
    },
    "2018": {
      "15. Januar": {
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
      "25. Februar": {
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
      "16. März": {
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
}`;
