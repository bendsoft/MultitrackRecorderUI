import {Injectable} from '@angular/core';
import {ChannelModel} from "./channel.model";
import {MTRService} from "../../shared/service/mtr-service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ChannelService extends MTRService<ChannelModel> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/channels');
  }
}
