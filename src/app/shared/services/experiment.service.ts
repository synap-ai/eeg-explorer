import { Injectable } from '@angular/core';
import { Experiment } from '../classes/experiment';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap } from 'rxjs/operators';
import { empty, of, Observable, Subject } from 'rxjs';
import { debug } from 'util';
import { identifierModuleUrl } from '@angular/compiler';

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
      $videos: [VideoInput]
    ) {
      createExperiment(
        researcherId: $researcherId,
        title: $title,
        description: $description,
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
          videos {
            id
            title
            youtube_id
            category
          }
        }
      }
    }
  `;
  updateExperimentMutation = gql`
  mutation updateExperiment(
    $id: ID!,
    $title: String!,
    $description: String,
    $videos: [VideoInput]
  ) {
    updateExperiment(
      id: $id,
      title: $title,
      description: $description,
      videos: $videos,
    ) {
      id
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

  getExperiments(id: number): Observable<Experiment[]> {
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
          return e ? of(e.map(this.anyToExperiment)) : empty();
        })
      );
  }

  save(experiment: Experiment, callback: Function) {
    let mut: Observable<any>;
    const videos = experiment.videos.map(x => ({ id: x.id, title: x.title, category: x.category, youtube_id: x.youtube_id}));
    if (experiment.id) {

      mut = this.apollo.mutate({
        mutation: this.updateExperimentMutation,
        variables: {
          id: experiment.id,
          title: experiment.title,
          description: experiment.description,
          videos: videos,
        },
        errorPolicy: 'all'
      });

    } else {

      mut = this.apollo.mutate({
        mutation: this.createExperimentMutation,
        variables: {
          researcherId: 1, // temp
          title: experiment.title,
          description: experiment.description,
          videos: videos,
        }
      });

    }
      mut.subscribe(({ errors, data }) => {
        if (errors) {
          console.log('something went wrong', errors);
        }
        console.log('Experiment saved - ', data);
        this.queryRef.refetch();
        callback();
      }, (error) => {
        console.log('There was an error sending the query', error);
      });
      return mut;
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

  private anyToExperiment(a: any) {
    const e = new Experiment();

    e.id = a.id;
    e.title = a.title;
    e.description = a.description;
    e.videos = a.videos;

    return e;
  }
}
