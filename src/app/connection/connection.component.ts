import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { EegStreamService } from '../shared/services/eeg-stream.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})

export class ConnectionComponent implements OnInit {

  get Streaming() {
    return this.eegStream.connected || this.eegStream.playingFile || this.eegStream.playingMock;
  }

  constructor(public eegStream: EegStreamService) {
  }

  ngOnInit() {}

  disconnect() {
    this.eegStream.disconnect();
  }
}
