import { Injectable } from '@angular/core';
import { Subject } from '../classes/subject';
import gql from 'graphql-tag';
import { Observable, of, empty, throwError } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import { switchMap } from 'rxjs/operators';

interface Response {
  subjects: Subject[];
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  getSubjectsQuery = gql`
  query getSubjects {
    subjects {
      id
      first_name
      last_name
      email
      dob
      gender
      dominant_hand
    }
  }`;

  createSubjectMutation = gql`mutation createSubject(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String
    $dob: Date
    $dominant_hand: String
    ) {
    createSubject(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      dominant_hand: $dominant_hand
      dob: $dob,
      gender: $gender
    ) {
      id
    }
  }`;

  updateSubjectMutation = gql`mutation updateSubject(
    $id: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $dob: Date
    $dominant_hand: String
    ) {
    updateSubject(
      id: $id
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      dob: $dob
      dominant_hand: $dominant_hand
    ) {
      id
    }
  }`;

  delteSubjectMutation = gql`mutation deleteSubject(
      $id: ID!
    ) {
      deleteSubject(id: $id)
    }`;

  subjects: Observable<Subject[]>;

  private queryRef: QueryRef<Response>;

  constructor(private apollo: Apollo) {
    this.queryRef = this.apollo.watchQuery<Response>({ query: this.getSubjectsQuery});

    this.subjects = this.queryRef.valueChanges.pipe(
      switchMap(x =>  x.data.subjects ? of(x.data.subjects.map(this.anyToSubject)) : empty())
      );

  }

  save(subject: Subject, callback: Function = () => null) {
    let mut: Observable<any>;
    if (subject.id) {

      mut = this.apollo.mutate({
        mutation: this.updateSubjectMutation,
        variables: {
          id: subject.id,
          first_name: subject.first_name,
          last_name: subject.last_name,
          email: subject.email,
          dob: subject.dob,
          gender: subject.gender,
          dominant_hand: subject.dominant_hand,
        }
      });

    } else {

      mut = this.apollo.mutate({
        mutation: this.createSubjectMutation,
        variables: {
          first_name: subject.first_name,
          last_name: subject.last_name,
          email: subject.email,
          dob: subject.dob,
          gender: subject.gender,
          dominant_hand: subject.dominant_hand,
        }
      });

    }
      mut.subscribe(({ errors, data }) => {
        if (errors) {
          console.log('something went wrong', errors);
        }
        console.log('Subject saved - ', data);
        this.queryRef.refetch();
        callback();
      }, (error) => {
        console.log('There was an error sending the query', error);
      });
      return mut;
  }

  delete(id: String) {
    this.apollo.mutate({
      mutation: this.delteSubjectMutation,
      variables: {
        id: id
      }
    }).subscribe(({ data }) => {
      console.log('Subject delete - ', data);
      this.queryRef.refetch();
    }, (error) => {
      console.log('There was an error deleting the subject', error);
    });
  }

  private anyToSubject(a: any) {
    const s = new Subject();
    s.id = a.id;
    s.first_name = a.first_name;
    s.last_name = a.last_name;
    s.email = a.email;
    s.gender = a.gender;
    s.dob = a.dob;
    s.dominant_hand = a.dominant_hand;
    return s;
  }
}
