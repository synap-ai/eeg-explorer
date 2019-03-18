import { Injectable } from '@angular/core';
import { Classifier } from '../classes/classifier';
import { of, Observable } from 'rxjs';
import { Classification } from '../classes/classification';
import { Session } from '../classes/session';

@Injectable({
  providedIn: 'root'
})
export class ClassifierService {

  classifiers: Observable<Classifier[]>;

  constructor() {
    // for testing
    this.classifiers = of([ {name: 'odd/even', id: 1 } ]);
   }

   classify(classifier: Classifier, session: Session): Classification[] {
     if (classifier.id = 1) {
       const result = [];
       let current: Classification | null = null;
       for (let i = 0; i < session.eeg_data.length; i++) {
         const timestamp = session.eeg_data[i].timestamp;

         const even = Math.round(timestamp / 1000) % 2;

         if (even && current == null) {
           current = new Classification();
           current.startTime = timestamp;
           current.class = 'even';
         } else if (!even && current == null) {
           current = new Classification();
           current.startTime = timestamp;
           current.class = 'odd';
         } else if (even && current) {
           if (current.class === 'even') {
             continue;
           }
           current.endTime = timestamp;
           result.push(current);
           current = new Classification();
           current.startTime = timestamp;
           current.class = 'even';
         } else if (!even && current) {
          if (current.class === 'odd') {
            continue;
          }
          current.endTime = timestamp;
          result.push(current);
          current = new Classification();
          current.startTime = timestamp;
          current.class = 'odd';
        }
       }
       if (current != null) {
         current.endTime = session.eeg_data[session.eeg_data.length - 1].timestamp;
         result.push(current);
       }
       return result;
     } else {
       return [];
     }
   }
}
