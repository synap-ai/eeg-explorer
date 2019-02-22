import { Injectable } from '@angular/core';
import { Experiment } from './experiment';

const exampleData: Experiment[] = [
  { id: '123', title: 'experiment 1', epoch: 256, epochInterval: 100, useBandPowers: true, useCovariance: true, videos: [
    { title: 'coffe break', id: 'GTcM7ydgAwo', label: 'comedy' },
  ]},
  { id: '321', title: 'experiment 2', epoch: 256, epochInterval: 100, useBandPowers: true, useCovariance: true, videos: []},
  { id: '213', title: 'experiment 3', epoch: 256, epochInterval: 100, useBandPowers: true, useCovariance: true, videos: []},
];
@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  experiments: Experiment[];


  constructor() {
    this.experiments = exampleData;
  }

  save(experiment: Experiment) {
    const i = this.experiments.findIndex(e => e.id === experiment.id);
    if (i >= 0) {
      this.experiments[i] = experiment;
    } else {
      this.experiments.push(experiment);
    }
  }



  delete(experiment: Experiment) {
    const i = this.experiments.indexOf(experiment);
    if (i >= 0) {
      this.experiments.splice(i, 1);
    }
  }
}
