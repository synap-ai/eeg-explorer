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
      $videos: [VideoInput]
    ) {
      createExperiment(
        researcherId: $researcherId,
        title: $title,
        description: $description,
        epoch_samples: $epoch_samples,
        epoch_interval: $epoch_interval,
        uses_band_powers: $uses_band_powers,
        uses_covariance: $uses_covariance,
        videos: $videos,
      ) {
        id
      }
    }
  `;
  getExperimentsQuery = gql`
    query getExperiments($researcherId: ID!) {
      researcher(id: $researcherId) {
        experiments {
          id
          title
          description
          epoch_samples
          epoch_interval
          uses_band_powers
          uses_covariance
          videos {
            id
            title
            description
            youtube_id
            category
          }
        }
      }
    }
  `;
  deleteExperimentMutation = gql`
    mutation deleteExperiment($id: ID!) {
      deleteExperiment(id: $id)
    }
  `;

  constructor(private apollo: Apollo) {
  }

  getExperiments(id: Number) {
    return this.apollo
      .watchQuery<Response>({ query: this.getExperimentsQuery, variables: { researcherId: id }});
  }

  save(experiment: Experiment) {
    if (experiment.id) {
      // this.experiments[i] = experiment;
    } else {
      this.apollo.mutate({
        mutation: this.createExperimentMutation,
        variables: {
          researcherId: 1,
          title: experiment.title,
          description: experiment.description,
          epoch_samples: experiment.epoch_samples,
          epoch_interval: experiment.epoch_interval,
          uses_band_powers: !!experiment.uses_band_powers,
          uses_covariance: !!experiment.uses_covariance,
          videos: experiment.videos,
        }
      }).subscribe(({ data }) => {
        console.log('Experiment created - ', data);
      }, (error) => {
        console.log('There was an error sending the query', error);
      });
    }
  }



  delete(id: Number) {
    this.apollo.mutate({
      mutation: this.deleteExperimentMutation,
      variables: {
        id: id
      }
    }).subscribe(({ data }) => {
      console.log('Experiment delete - ', data);
    }, (error) => {
      console.log('There was an error deleting the experiment', error);
    });
  }
}
