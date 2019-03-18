import { Injectable } from '@angular/core';
import { Session } from '../classes/session';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SimpleWebDriverClient } from 'blocking-proxy/built/lib/simple_webdriver_client';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  uploading = false;
  sessions: Session[];

  getSessionQuery = gql`query getSession($sId: ID!, $eId: ID!, $vId: ID!) {
    getSession(sId: $sId, eId: $eId, vId: $vId) {
      id,
      subjectId,
      experimentId,
      videoId,
      eeg_data { timestamp, tp9, af7, af8, tp10 }
    }
  }`;

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
    this.uploading = true;
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
      this.uploading = false;
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

  getSession(sId: number, eId: number, vId: number) {
    return this.apollo.query({
      query: this.getSessionQuery,
      variables: {
        sId: sId,
        eId: eId,
        vId: vId,
      },
      fetchPolicy: 'network-only'
    });
  }
}
