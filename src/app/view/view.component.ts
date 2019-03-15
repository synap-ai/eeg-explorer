import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { EegStreamService } from 'app/shared/eeg-stream.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  get Streaming() {
    return this.eegStream.connected || this.eegStream.playingFile || this.eegStream.playingMock;
  }

  constructor(private snackBar: MatSnackBar, public eegStream: EegStreamService) {
  }

  ngOnInit() {}

  async connect() {
    const err = await this.eegStream.connect();
    if (err) {
      this.snackBar.open('Connection failed: ' + err.toString(), 'Dismiss');
    }
  }

  disconnect() {
    this.eegStream.disconnect();
  }

  handleFileInput(files: FileList) {
    this.eegStream.loadFile(files.item(0));
  }

  playFile() {
    this.eegStream.playFile();
  }

  playWave() {
    this.eegStream.playWave();
  }

}
