import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { Session } from 'app/shared/classes/session';
import { Classification } from 'app/shared/classes/classification';

const colors = [
  'rgba(255,0,0,1)',
  'rgba(0,0,255,1)',
  'rgba(0,255,0,1)',
  'cyan',
  'yellow',
];

@Component({
  selector: 'app-static-eeg',
  templateUrl: './static-eeg.component.html',
  styleUrls: ['./static-eeg.component.css'],
})
export class StaticEegComponent implements OnInit {
  @Input() classifications: [Classification];
  @Input() session: Session;

  colorKeys = [];
  classToColors: any = {};

  chart: Chart;

  constructor() {}

  ngOnInit() {
    const tp9_chart = document.getElementById('tp9-chart') as HTMLCanvasElement;
    const af7_chart = document.getElementById('af7-chart') as HTMLCanvasElement;
    const af8_chart = document.getElementById('af8-chart') as HTMLCanvasElement;
    const tp10_chart = document.getElementById(
      'tp10-chart'
    ) as HTMLCanvasElement;

    const charts = [tp9_chart, af7_chart, af8_chart, tp10_chart];
    const channels = ['tp9', 'af7', 'af8', 'tp10'];
    let i = 0;

    charts.forEach(chart => {
      if (chart.getContext) {
        const ctx = chart.getContext('2d');

        const data = this.session.eeg_data;

        const minTime = data[0].timestamp;
        const maxTime = data[this.session.eeg_data.length - 1].timestamp;
        const minVoltage = -1000;
        const maxVoltage = 1000;

        const width = chart.width;
        const height = chart.height;

        const timeToX = (time: number) => {
          return ((time - minTime) / (maxTime - minTime)) * width;
        };

        const voltToY = (voltage: number) => {
          return ((voltage - minVoltage) / (maxVoltage - minVoltage)) * height;
        };
        this.drawChannel(ctx, channels[i], timeToX, voltToY);
        i++;
      }
    });

    this.colorKeys = Object.keys(this.classToColors);
  }

  colorDecider = (index: number) => {
    const timestamp = this.session.eeg_data[index].timestamp;
    const classification = this.classifications.find(
      x => x.startTime <= timestamp && timestamp <= x.endTime
    );

    let color = this.classToColors[classification.class];

    if (!color) {
      this.classToColors[classification.class] =
        colors[Object.keys(this.classToColors).length];
      color = this.classToColors[classification.class];
    }

    return color;
  }

  private drawChannel(
    ctx: CanvasRenderingContext2D,
    channel: string,
    timeToX: (x: number) => number,
    voltToY: (x: number) => number
  ) {
    const data = this.session.eeg_data;
    const first = data[0];

    ctx.beginPath();
    ctx.moveTo(timeToX(first.timestamp), voltToY(first[channel]));
    for (let i = 0; i < data.length - 1; i++) {
      ctx.strokeStyle = this.colorDecider(i);
      const x = timeToX(data[i].timestamp);
      const y = voltToY(data[i][channel]);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
}
