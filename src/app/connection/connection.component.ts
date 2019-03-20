import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { EegStreamService } from '../shared/services/eeg-stream.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})

export class ConnectionComponent implements OnInit {

  get Streaming() {
    return this.eegStream.connected || this.eegStream.playingFile || this.eegStream.playingMock;
  }

  constructor(private snackBar: MatSnackBar, public eegStream: EegStreamService, public authService: AuthService) {
  }

  ngOnInit() {
  }

  disconnect() {
    this.eegStream.disconnect();
  }

  logout() {
    this.authService.logout();
  }
}
