import { Injectable } from '@angular/core';
import { Subject } from './subject';

const exampleData: Subject[] = [
  {id: 'subject 1', name:"Joe", dob: new Date('1995-12-17T03:24:00'), sex: 'Male', dominantHand: 'Left'},
  {id: 'subject 2', name:"Anna", dob: new Date('1995-12-17T03:24:00'), sex: 'Female', dominantHand: 'Right'},
  {id: 'subject 3', name:"Sophie", dob: new Date('1995-12-17T03:24:00'), sex: 'Female', dominantHand: 'Ambidextrous'},
];

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  subjects: Subject[];

  constructor() {
    this.subjects = exampleData;
  }

  save(subject: Subject) {
    const i = this.subjects.findIndex(e => e.id === subject.id);
    if (i >= 0) {
      this.subjects[i] = subject;
    } else {
      this.subjects.push(subject);
    }
  }

  delete(subject: Subject) {
    const i = this.subjects.indexOf(subject);
    if (i >= 0) {
      this.subjects.splice(i, 1);
    }
  }
}
