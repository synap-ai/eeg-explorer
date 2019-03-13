import { Injectable } from '@angular/core';
import { Session } from './session';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessions: Session[];

  createSessionMutation = gql`
    mutation createSession(
    $subjectId: ID!
    $experimentId: ID!
    $videoId: ID!
    $eeg_data: [EEGInput!]!
  ){
    createSession(
      subjectId: $subjectId,
      experimentId: $experimentId,
      videoId: $videoId,
      eeg_data: $eeg_data,
    ){
      id
    }
  }
  `;

  constructor(private apollo: Apollo) {
  }

  save(session: Session) {
    this.apollo.mutate({
      mutation: this.createSessionMutation,
      variables: {
        subjectId: session.subject_id,
        experimentId: session.experiment_id,
        videoId: session.video_id,
        eeg_data: session.eeg_data,
      }
    }).subscribe(({ data }) => {
      console.log('Session created - ', data);
    }, (error) => {
      console.log('There was an error sending the query', error);
    });
  }

  delete(session: Session) {
    const i = this.sessions.indexOf(session);
    if (i >= 0) {
      this.sessions.splice(i, 1);
    }
  }
}
