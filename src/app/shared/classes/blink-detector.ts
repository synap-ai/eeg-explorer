import { Observable, Subject } from 'rxjs';
import { EEGSample } from 'muse-js';
import { map, bufferCount, takeLast, takeUntil } from 'rxjs/operators';

export class BlinkDetector {
  name = 'Blink Detector';
  categories = ['Blink', 'No-Blink'];

  get result(): Observable<number> {
    return this._result;
  }
  private _result: Observable<number>;
  readonly uMeans = [0, 0, 0, 0, 0];

  private destroy = new Subject<void>();

  start(stream: Observable<EEGSample>): void {
    this._result = stream.pipe(
      takeUntil(this.destroy),
      map(sample => {
        for (let i = 0; i < sample.data.length; i++) {
          this.uMeans[i] = 0.99 * this.uMeans[i] + 0.01 * sample.data[i];
          sample.data[i] -= this.uMeans[i];
        }
        return sample;
      }),
      map(s => s.data.map(n => Math.abs(n))),
      bufferCount(25),
      map((maxes: number[][]) => {
        for (let i = 0; i < maxes.length; i++) {
          for (let j = 0; j < maxes[i].length; j++) {
            if (maxes[i][j] > 100) {
              return 0.75;
            }
          }
        }
        return -0.75;
      })
    );
  }

  stop() {
    this.destroy.next();

  }
}
