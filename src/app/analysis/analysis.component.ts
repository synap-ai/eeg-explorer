import { Component, OnInit } from '@angular/core';
import { TimeSeries, SmoothieChart } from 'smoothie';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';
import { Observable } from 'rxjs';
import { EEGSample } from 'muse-js';
import { map, filter, buffer, bufferCount } from 'rxjs/operators';

class Classifier {
  readonly result: Observable<number>;

  constructor(private stream: Observable<EEGSample>,
              public categories: String[],
              private transform: (s: Observable<EEGSample>) => Observable<number>) {
    this.result = this.transform(stream);
  }
}


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  series = new TimeSeries();
  canvas: HTMLCanvasElement;
  chart: SmoothieChart;
  interval: any;

  readonly uMeans = [0, 0, 0, 0, 0];

  classifier: Classifier;

  constructor(private eegService: EegStreamService) {

  }

  ngOnInit() {
    // Set up classifier
    this.classifier = new Classifier(
      this.eegService.data.pipe(
        map(sample => {
          for (let i = 0; i < sample.data.length; i++) {
            this.uMeans[i] = 0.99 * this.uMeans[i] + 0.01 * sample.data[i];
            sample.data[i] -= this.uMeans[i];
          }
          return sample;
        })
      ),
      ['Blink', 'No-Blink'],
      (stream) => {
        return stream.pipe(
          map(s => s.data.map(n => Math.abs(n))),
          bufferCount(25),
          map((maxes: number[][]) => {
            for (let i = 0; i < maxes.length; i++) {
              for (let j = 0; j < maxes[i].length; j++) {
                if (maxes[i][j] > 250) {
                  return 0.75;
                }
              }
            }
            return -0.75;
          })
        );
      }
    );

    // Create a time series
    this.series = new TimeSeries();

    // Find the canvas
    this.canvas = document.getElementsByClassName('analysis-canvas')[0] as HTMLCanvasElement;

    // Create the chart
    this.chart = new SmoothieChart({
      responsive: true,
      millisPerPixel: 8,
      maxValue: 1,
      minValue: -1,
      grid: {
        lineWidth: 1,
        fillStyle: 'black',
        strokeStyle: 'lightgrey',
        sharpLines: true,
        millisPerLine: 1000,
        verticalSections: this.classifier.categories.length,
        borderVisible: true,
      },
      labels: { fillStyle: 'rgb(60, 0, 0)' }
    });
    this.chart.addTimeSeries(this.series, { strokeStyle: 'green', lineWidth: 3 });
    this.chart.streamTo(this.canvas, 500);

    this.classifier.result.subscribe(value => {
      this.series.append(Date.now(), value);
    });
  }

}
