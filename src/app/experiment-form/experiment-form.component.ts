import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Output,
  EventEmitter
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
  @Output() onSave = new EventEmitter<void>();

  experimentOptions: FormGroup;

  constructor(
    fb: FormBuilder,
    private eService: ExperimentService,
  ) {
    this.experimentOptions = fb.group({
      title: null,
      description: null,
      videos: [],
    });
  }

  ngOnInit() {}

  ngOnChanges() {
    this.experimentOptions.reset();
    if (this.experiment.title) {
      this.experimentOptions.setValue(
        {
          title: this.experiment.title,
          description: this.experiment.description,
          videos: this.experiment.videos
        }
      );
    }
  }

  async save() {
    const videos = this.experiment.videos;
    Object.assign(this.experiment, this.experimentOptions.value);
    this.experiment.videos = videos;

    try {
      this.eService.save(this.experiment, () => this.onSave.emit());
    } catch {
      // do nothing
    }
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
