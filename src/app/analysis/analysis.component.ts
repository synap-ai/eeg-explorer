import { Component, OnInit } from '@angular/core';
import { TimeSeries, SmoothieChart } from 'smoothie';

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
  constructor() { }

  ngOnInit() {
    // Create a time series
    this.series = new TimeSeries();
 
    // Find the canvas
    this.canvas = document.getElementsByClassName('analysis-canvas')[0] as HTMLCanvasElement;
 
    // Create the chart
    this.chart = new SmoothieChart({
      responsive: true,
      millisPerPixel: 5,
      maxValue: 1,
      minValue: -1,
      grid: {
        lineWidth: 1,
        fillStyle: 'black',
        strokeStyle: 'lightgrey',
        sharpLines: true,
        millisPerLine: 1000,
        verticalSections: 4,
        borderVisible: true,
      },
      labels: { fillStyle: 'rgb(60, 0, 0)' }
    });
    this.chart.addTimeSeries(this.series, { strokeStyle: 'green', lineWidth: 3 });
    this.chart.streamTo(this.canvas, 500);

    this.interval = setInterval(() => {
      this.series.append(Date.now(), (Math.random() * 2) - 1);
    }, 100);
  }

}
