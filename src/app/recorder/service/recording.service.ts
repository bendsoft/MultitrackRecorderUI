import { Injectable } from '@angular/core';
import {RecordingModel} from './recording.model';
import {MTRService} from '../../shared/service/mtr-service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordingService extends MTRService<RecordingModel> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/recordings');
  }
}
