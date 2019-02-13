import {Injectable} from '@angular/core';
import {Recording} from '../types/recording';
import {MTRService} from '../../shared/service/mtr-service';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordingService extends MTRService<Recording> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/recordings');
  }

  getRecordings(params?: HttpParams) {
    return this.getAll(params);
  }

  createRecording(object, params?: HttpParams) {
    return this.create(object, params);
  }

  updateRecording(object, params?: HttpParams) {
    return this.update(object, params);
  }
}
