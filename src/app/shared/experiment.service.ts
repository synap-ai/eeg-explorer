import { Injectable } from '@angular/core';
import { Experiment } from './experiment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const exampleData: Experiment[] = [
  { id: '123', title: 'experiment 1', epoch: 256, epochInterval: 100, useBandPowers: true, useCovariance: true, videos: [
    { title: 'coffee break', id: 'GTcM7ydgAwo', label: 'comedy' },
  ]},
  { id: '321', title: 'experiment 2', epoch: 256, epochInterval: 100, useBandPowers: true, useCovariance: true, videos: []},
  { id: '213', title: 'experiment 3', epoch: 256, epochInterval: 100, useBandPowers: true, useCovariance: true, videos: []},
];
@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
  createExperiment = gql`
    mutation createExperiment(
      $researcherId: ID!,
      $title: String!,
      $description: String,
      $epoch_samples: Int,
      $epoch_interval: Int,
      $uses_band_powers: Boolean,
      $uses_covariance: Boolean,
    ) {
      createExperiment(
        researcherId: $researcherId,
        title: $title,
        description: $description,
        epoch_samples: $epoch_samples,
        epoch_interval: $epoch_interval,
        uses_band_powers: $uses_band_powers,
        uses_covariance: $uses_covariance,
      ) {
        id
      }
    }
  `;
  experiments: Experiment[];

  constructor(private apollo: Apollo) {
    this.experiments = exampleData;
  }

  save(experiment: Experiment) {
    const i = this.experiments.findIndex(e => e.id === experiment.id);
    if (i >= 0) {
      this.experiments[i] = experiment;
    } else {
      this.apollo.mutate({
        mutation: this.createExperiment,
        variables: {
          researcherId: 2,
          title: experiment.title,
          description: experiment.description,
          epoch_samples: experiment.epoch,
          epoch_interval: experiment.epochInterval,
          uses_band_powers: !!experiment.useBandPowers,
          uses_covariance: !!experiment.useCovariance
        }
      }).subscribe(({ data }) => {
        console.log('Experiment created - ', data);
      }, (error) => {
        console.log('There was an error sending the query', error);
      });
    }
  }



  delete(experiment: Experiment) {
    const i = this.experiments.indexOf(experiment);
    if (i >= 0) {
      this.experiments.splice(i, 1);
    }
  }
}
