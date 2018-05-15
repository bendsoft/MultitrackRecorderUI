import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {
  recordingDate = new FormControl(moment(), Validators.required);

  constructor() {}

  ngOnInit() {}

}
