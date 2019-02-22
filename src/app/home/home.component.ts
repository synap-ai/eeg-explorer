import { Component, OnInit } from '@angular/core';
import { EegStreamService } from 'app/shared/eeg-stream.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public eegStream: EegStreamService) {
  }
  ngOnInit() {
  }
}
