import { Injectable } from '@angular/core';
import { Subject } from './subject';

const exampleData: Subject[] = [
  {id: 'subject 1', age: 21, sex: 'male'},
  {id: 'subject 2', age: 22, sex: 'female'},
  {id: 'subject 3', age: 22, sex: 'male'},
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
