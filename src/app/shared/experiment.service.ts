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
    if (experiment.id) {
      // this.experiments[i] = experiment;
    } else {
      const mut = this.apollo.mutate({
        mutation: this.createExperimentMutation,
        variables: {
          researcherId: 1,
          title: experiment.title,
          description: experiment.description,
          videos: experiment.videos,
        }
      });
      mut.subscribe(({ data }) => {
        console.log('Experiment created - ', data);
        this.queryRef.refetch();
        callback();
      }, (error) => {
        console.log('There was an error sending the query', error);
      });
      return mut;
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

  private anyToExperiment(a: any) {
    const e = new Experiment();

    e.id = a.id;
    e.title = a.title;
    e.description = a.description;
    e.videos = a.videos;

    return e;
  }
}
