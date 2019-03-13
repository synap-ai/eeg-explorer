import { Component, OnInit } from '@angular/core';
import { ExperimentService } from 'app/shared/experiment.service';
import { SubjectService } from 'app/shared/subject.service';
import { Subject } from 'app/shared/subject';
import { Experiment } from 'app/shared/experiment';
import { MediaDescription } from 'app/shared/media-description';
import { EegStreamService } from 'app/shared/eeg-stream.service';
import { EEGSample, zipSamples } from 'muse-js';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from 'app/shared/session.service';
import { Session } from 'app/shared/session';

@Component({
  selector: 'app-data-collection',
  templateUrl: './data-collection.component.html',
  styleUrls: ['./data-collection.component.css']
})
export class DataCollectionComponent implements OnInit {
  subject: Subject;
  experiment: Experiment;
  video: MediaDescription;
  experiments: Observable<Experiment[]>;
  Player: YT.Player;

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
    this.experiments = this.eService.getExperiments(1);
  }

  savePlayer(player) {
    this.Player = player;
  }
  onStateChange(event) {
    const state = event.data;
    if (state === 1) {
      // playing
      this.subscription = this.eegStream.data.subscribe(s => {
        this.samples.push(s);
      });
    } else if (state === 0) {
      this.subscription.unsubscribe();
      this.cleanUp();
    } else if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async cleanUp() {
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
      subject_id: 1, // temp
      experiment_id: this.experiment.id,
      video_id: this.video.id,
      eeg_data: eegSamples
    }));

    this.samples = [];
  }
}
