import {Injectable} from '@angular/core';
import {ChannelModel} from "./channel.model";
import {CRUDService} from "../../shared/service/abstract-crud-service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ChannelService extends CRUDService<ChannelModel> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/channels');
  }
}
