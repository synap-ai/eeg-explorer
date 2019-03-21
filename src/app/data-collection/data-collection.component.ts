import { Component, OnInit } from '@angular/core';
import { ExperimentService } from 'app/shared/services/experiment.service';
import { SubjectService } from 'app/shared/services/subject.service';
import { Subject } from 'app/shared/classes/subject';
import { Experiment } from 'app/shared/classes/experiment';
import { MediaDescription } from 'app/shared/classes/media-description';
import { EegStreamService } from 'app//shared/services/eeg-stream.service';
import { EEGSample, zipSamples } from 'muse-js';
import { Subscription, Observable } from 'rxjs';
import { SessionService } from 'app/shared/services/session.service';
import { Session } from 'app/shared/classes/session';

@Component({
  selector: 'app-data-collection',
  templateUrl: './data-collection.component.html',
  styleUrls: ['./data-collection.component.css']
})
export class DataCollectionComponent implements OnInit {
  subject: Subject;
  experiment: Experiment;
  experiments: Observable<Experiment[]>;
  Player: YT.Player;

  startTime = -1;
  endTime = Number.MAX_SAFE_INTEGER;

  sessionCreated = false;

  get uploading() {
    return this.sessionsService.uploading;
  }
  get video() {
    return this._video;
  }

  set video(value: MediaDescription) {
    if (value !== this._video) {
      this._video = null;
      setTimeout(() => this._video = value, 100);
      this.sessionCreated = false;
    }

  }
  _video: MediaDescription;

  private subscription: Subscription;
  samples: EEGSample[] = [];
  powers = [];
  coovariance = [];

  constructor(
    public eService: ExperimentService,
    public sService: SubjectService,
    public eegStream: EegStreamService,
    private sessionsService: SessionService
  ) {}

  ngOnInit() {
    this.experiments = this.eService.getExperiments();
  }

  savePlayer(player) {
    this.Player = player;
  }
  onStateChange(event) {
    const state = event.data;
    if (state === 1) {
      // playing
      this.startTime = Date.now();
      this.subscription = this.eegStream.data.subscribe(s => {
        if (s.timestamp >= this.startTime) {
          if (s.timestamp <= this.endTime) {
            this.samples.push(s);
          } else {
            this.cleanUp();
          }
        }
      });
    } else if (state === 0) {
      this.endTime = Date.now();
    } else if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async cleanUp() {
    this.subscription.unsubscribe();
    const eegSamples = this.samples.map(sample => {
      return {
        timestamp: sample.timestamp,
        tp9: sample.data[0],
        af7: sample.data[1],
        af8: sample.data[2],
        tp10: sample.data[3],
      };
    });

    this.sessionsService.save(new Session({
      subject_id: this.subject.id, // temp
      experiment_id: this.experiment.id,
      video_id: this.video.id,
      eeg_data: eegSamples
    }), () => this.sessionCreated = true);

    this.samples = [];
    this.startTime = -1;
    this.endTime = Number.MAX_VALUE;
  }
}
