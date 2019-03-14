import { Injectable } from '@angular/core';
import { Subject } from './subject';
import gql from 'graphql-tag';
import { Observable, of, empty } from 'rxjs';
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

  subjects: Observable<Subject[]>;

  private queryRef: QueryRef<Response>;

  constructor(private apollo: Apollo) {
    this.queryRef = this.apollo.watchQuery<Response>({ query: this.getSubjectsQuery});

    this.subjects = this.queryRef.valueChanges.pipe(
      switchMap(x =>  x.data.subjects ? of(x.data.subjects.map(this.anyToSubject)) : empty())
      );

  }

  save(subject: Subject) {
    // const i = this.subjects.findIndex(e => e.id === subject.id);
    // if (i >= 0) {
    //   this.subjects[i] = subject;
    // } else {
    //   this.subjects.push(subject);
    // }
  }

  delete(subject: Subject) {
    // const i = this.subjects.indexOf(subject);
    // if (i >= 0) {
    //   this.subjects.splice(i, 1);
    // }
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
