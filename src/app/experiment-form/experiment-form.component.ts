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
import { ExperimentService } from 'app/shared/experiment.service';

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
  ) {
    this.experimentOptions = fb.group({
      title: null,
      description: null,
      epoch_samples: 256,
      epoch_interval: 100,
      uses_band_powers: true,
      uses_covariance: true,
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
