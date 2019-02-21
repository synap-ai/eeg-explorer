import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MediaDescription } from 'app/media-description';

@Component({
  selector: 'app-experiment-form',
  templateUrl: './experiment-form.component.html',
  styleUrls: ['./experiment-form.component.css']
})
export class ExperimentFormComponent implements OnInit {

  experimentOptions: FormGroup;
  videos: MediaDescription[] = [
    {title: 'video 1', id: 'dsfafadsf', label: 2.00},
    {title: 'video 2', id: 'dfasdfsd', label: 3.00},
    {title: 'video 3', id: 'dsfasdf', label: 4.00},
    {title: 'video 4', id: 'asdfgasdg', label: 5.00},
  ];

  constructor(fb: FormBuilder) {
    this.experimentOptions = fb.group({
      experimentID: null,
      epoch: 256,
      epochInterval: 100,
      useBandPowers: true,
      useCovariance: true,
    });
  }

  ngOnInit() {
  }

  addVideo() {
    this.videos.push(new MediaDescription());
  }
  deleteVideo(video: MediaDescription) {
    const i = this.videos.indexOf(video);
    if (i >= 0) {
      this.videos.splice(i, 1);
    }
  }

}
