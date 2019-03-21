import { Injectable } from '@angular/core';
import { Classifier } from '../classes/classifier';
import { of, Observable } from 'rxjs';
import { Classification } from '../classes/classification';
import { Session } from '../classes/session';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { allowPreviousPlayerStylesMerge } from '@angular/animations/browser/src/util';

const EMOTION_API_URL = 'https://synap-eeg-emotion-api.appspot.com/predict';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ClassifierService {

  classifiers: Observable<Classifier[]>;

  constructor(private http: HttpClient) {
    // for testing
    this.classifiers = of([ {name: 'Pleasure / Arousal', id: 1 } ]);
   }

   classify(classifier: Classifier, session: Session) {
     return this.http.post(EMOTION_API_URL, {eeg : session.eeg_data}, httpOptions)
     .pipe(
       map((response: any) => {
         if (!response.succesful) {
           return { arousal: response.predictions.arousal[0] as string[], pleasure: response.predictions.pleasure[0] as string[] };
         } else {
           throw new Error('Somthing went wrong getting classifications');
         }
       }),
       map(ap => {
        const classifications: Classification[] = [];
        const firstStart = session.eeg_data[0].timestamp;
        for (let i = 0; i < ap.arousal.length; i++) {
          const startTime = firstStart + i * (1000 / 16);
          const endTime = startTime + 1000;
          const clf = ap.arousal[i] + '-' + ap.pleasure[i];

          classifications.push({ startTime, endTime, class: clf});

         }
         return classifications;
       })
      );
   }
}
