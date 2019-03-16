import { Component, OnInit, Input } from '@angular/core';
import { TimeSeries, SmoothieChart } from 'smoothie';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';
import { map, bufferCount } from 'rxjs/operators';
import { Classifier } from 'app/shared/classes/classifier';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit {
  @Input() classifier;
  series = new TimeSeries();
  canvas: HTMLCanvasElement;
  chart: SmoothieChart;
  interval: any;

  constructor(private eegService: EegStreamService) {}

  ngOnInit() {

    this.classifier.start(this.eegService.data);

    // Create a time series
    this.series = new TimeSeries();

    // Find the canvas
    this.canvas = document.getElementsByClassName(
      'analysis-canvas'
    )[0] as HTMLCanvasElement;

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
      labels: { fillStyle: 'rgb(60, 0, 0)' },
    });
    this.chart.addTimeSeries(this.series, {
      strokeStyle: 'green',
      lineWidth: 6,
    });
    this.chart.streamTo(this.canvas, 500);

    this.classifier.result.subscribe(value => {
      this.series.append(Date.now(), value);
    });
  }
}
