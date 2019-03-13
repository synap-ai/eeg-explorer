import { Injectable } from '@angular/core';
import { Experiment } from './experiment';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap } from 'rxjs/operators';
import { empty, of, Observable, Subject } from 'rxjs';

interface Response {
  researcher: {
    experiments: any[]
  };
}

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

  private last_id = -1;
  private queryRef: QueryRef<Response>;

  constructor(private apollo: Apollo) {
  }

  getExperiments(id: number) {
    if (this.last_id === id && this.queryRef) { // query is already on stored
      this.queryRef.refetch();
    } else {
      this.queryRef = this.apollo
        .watchQuery<Response>({ query: this.getExperimentsQuery, variables: { researcherId: id }});
      this.last_id = id;
    }
    return this.queryRef
      .valueChanges
      .pipe(
        switchMap(x => {
          const r = x.data.researcher;
          const e = r ? r.experiments : null;
          return e ? of(e) : empty();
        })
      );
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
        this.queryRef.refetch();
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
      this.queryRef.refetch();
    }, (error) => {
      console.log('There was an error deleting the experiment', error);
    });
  }
}
