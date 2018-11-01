import {Node} from './Node';

export interface FileNode<T> extends Node {
  file: T
}
