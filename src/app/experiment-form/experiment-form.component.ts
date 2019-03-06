import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MediaDescription } from 'app/shared/media-description';
import { Experiment } from 'app/shared/experiment';
import { e } from '@angular/core/src/render3';
import { ExperimentService } from 'app/shared/experiment.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-experiment-form',
  templateUrl: './experiment-form.component.html',
  styleUrls: ['./experiment-form.component.css']
})
export class ExperimentFormComponent implements OnInit, OnChanges {
  @Input() experiment: Experiment;

  experimentOptions: FormGroup;

  constructor(
    fb: FormBuilder,
    private eService: ExperimentService,
    private apollo: Apollo
  ) {
    this.experimentOptions = fb.group({
      title: null,
      id: null,
      epoch: 256,
      epochInterval: 100,
      useBandPowers: true,
      useCovariance: true,
      videos: []
    });
  }

  ngOnInit() {}

  ngOnChanges() {
    this.experimentOptions.reset();
    if (this.experiment.title) {
      this.experimentOptions.setValue(this.experiment);
    }
  }

  save() {
    const videos = this.experiment.videos;
    Object.assign(this.experiment, this.experimentOptions.value);
    this.experiment.videos = videos;
    this.eService.save(this.experiment);
  }

  addVideo() {
    this.experiment.videos.push(new MediaDescription());
  }
  deleteVideo(video: MediaDescription) {
    const i = this.experiment.videos.indexOf(video);
    if (i >= 0) {
      this.experiment.videos.splice(i, 1);
    }
  }
}
