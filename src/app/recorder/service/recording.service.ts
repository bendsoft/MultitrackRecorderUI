import { Injectable } from '@angular/core';
import {RecordingModel} from './recording.model';
import {CRUDService} from '../../shared/service/abstract-crud-service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordingService extends CRUDService<RecordingModel> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/recordings');
  }
}
