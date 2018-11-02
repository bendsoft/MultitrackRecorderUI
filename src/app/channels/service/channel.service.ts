import {Injectable} from '@angular/core';
import {Channel} from "../types/Channel";
import {CRUDService} from "../../common/service/CRUDService";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ChannelService extends CRUDService<Channel> {
  constructor(
    http: HttpClient,
  ) {
    super(http, '/channels');
  }
}
