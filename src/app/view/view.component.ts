import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';
import { AuthService } from 'app/shared/services/auth.service';
import { Experiment } from 'app/shared/classes/experiment';
import { MediaDescription } from 'app/shared/classes/media-description';
import { Subject } from 'app/shared/classes/subject';
import { SubjectService } from 'app/shared/services/subject.service';
import { ExperimentService } from 'app/shared/services/experiment.service';
import { SessionService } from 'app/shared/services/session.service';
import { Observable } from 'rxjs';
import { Session } from 'app/shared/classes/session';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  subject: Subject;
  experiment: Experiment;
  video: MediaDescription;

  experiments: Observable<Experiment[]>;

  _loadingSession = false;

  get loadingSession() {
    return this._loadingSession;
  }

  get Streaming() {
    return this.eegStream.connected || this.eegStream.playingFile || this.eegStream.playingMock;
  }

  get loggedIn() {
    return this.authService.isLogged();
  }

  constructor(private snackBar: MatSnackBar,
    public eService: ExperimentService,
    public sService: SubjectService,
    public eegStream: EegStreamService,
    private sessionsService: SessionService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.experiments = this.eService.getExperiments(1);
  }

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

  playSession() {
    this._loadingSession = true;
    this.sessionsService.getSession(
      this.subject.id,
      this.experiment.id,
      this.video.id).subscribe((session) => {
        if ((session.data as any).getSession) {
          this.eegStream.playSession((session.data as any).getSession as Session);
        } else {
          this.snackBar.open('Failed to fetch session', 'Dismiss');
        }
      }, (error => {
        this.snackBar.open('Failed to fetch session: ' + error.toString(), 'Dismiss');
      }), () => {
        this._loadingSession = false;
      });
  }

}
