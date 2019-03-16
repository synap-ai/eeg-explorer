import { Injectable } from '@angular/core';
import { Classifier } from '../classes/classifier';
import { of, Observable } from 'rxjs';
import { BlinkDetector } from '../classes/blink-detector';

@Injectable({
  providedIn: 'root'
})
export class ClassifierService {

  classifiers: Observable<Classifier[]>;

  constructor() {
    // for testing
    this.classifiers = of([ new BlinkDetector() ]);
   }
}
