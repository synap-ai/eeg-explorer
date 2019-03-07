import { Injectable } from '@angular/core';
import { Experiment } from './experiment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

type Response = {
  researcher: {
    experiments: any[]
  };
};

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
  createExperimentMutation = gql`
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
  getExperimentsQuery = gql`
    query getExperiments($researcherId: ID!) {
      researcher(id: $researcherId) {
        experiments{
          title
          description
          epoch_samples
          epoch_interval
          uses_band_powers
          uses_covariance
        }
      }
    }
  `;

  constructor(private apollo: Apollo) {
  }

  getExperiments(id: Number) {
    return this.apollo
      .watchQuery<Response>({ query: this.getExperimentsQuery, variables: { researcherId: id }});
  }

  save(experiment: Experiment) {
    // const i = this.experiments.findIndex(e => e.id === experiment.id);
    // if (i >= 0) {
    //   this.experiments[i] = experiment;
    // } else {
      this.apollo.mutate({
        mutation: this.createExperimentMutation,
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
    // }
  }



  delete(experiment: Experiment) {
    // const i = this.experiments.indexOf(experiment);
    // if (i >= 0) {
    //   this.experiments.splice(i, 1);
    // }
  }
}
