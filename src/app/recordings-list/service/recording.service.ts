import { Injectable } from '@angular/core';
import {Recording} from '../types/Recording';
import {CRUDService} from '../../common/service/CRUDService';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordingService extends CRUDService<Recording> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/recordings');
  }
}
