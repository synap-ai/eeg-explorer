import { Injectable } from '@angular/core';
import { Subject } from './subject';

const exampleData: Subject[] = [
  {id: 'subject 1', age: 21, sex: 'male'},
  {id: 'subject 2', age: 22, sex: 'female'},
  {id: 'subject 3', age: 22, sex: 'male'},
]

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  subjects: Subject[] = exampleData;

  constructor() { }
}
