import { Component, OnInit } from '@angular/core';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';
import { ConnectionComponent } from 'app/connection/connection.component';

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
