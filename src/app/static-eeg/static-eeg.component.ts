import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { Session } from 'app/shared/classes/session';
import { Classification } from 'app/shared/classes/classification';



const colors = ['rgba(255,0,0,1)', 'rgba(0,255,0,1)', 'rgba(0,0,255,1)', 'cyan', 'yellow'];
@Component({
  selector: 'app-static-eeg',
  templateUrl: './static-eeg.component.html',
  styleUrls: ['./static-eeg.component.css']
})
export class StaticEegComponent implements OnInit {
  @Input() classifications: [Classification];
  @Input() session: Session;

  classToColors: any = {};

  chart: Chart;

  constructor() { }

  ngOnInit() {
    const data = this.session.eeg_data;

    const ctx = document.getElementById('eeg-chart');
    console.log(ctx);
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(x => x.timestamp),
        datasets: [
          {
            data: data.map(x => x.tp9),
            borderColor: 'rgba(0,0,0,0.2)',
            pointBackgroundColor: this.colorDecider,
            fill: false
          },
          {
            data: data.map(x => x.af7),
            borderColor: 'rgba(0,0,0,0.2)',
            pointBackgroundColor: this.colorDecider,
            fill: false
          },
          {
            data: data.map(x => x.af8),
            borderColor: 'rgba(0,0,0,0.2)',
            pointBackgroundColor: this.colorDecider,
            fill: false
          },
          {
            data: data.map(x => x.tp10),
            borderColor: 'rgba(0,0,0,0.2)',
            pointBackgroundColor: this.colorDecider,
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true,
          }],
        },
        elements: {
          point: {
            pointStyle: 'rect',
            radius: 10,
            borderWidth: 0,
          }
        }
      },
    });
  }

  colorDecider = (context: any) => {
    const index = context.dataIndex;
    const timestamp = this.session.eeg_data[index].timestamp;
    const classification = this.classifications.find(x => x.startTime <= timestamp && timestamp <= x.endTime);

    let color = this.classToColors[classification.class];

    if (!color) {
      this.classToColors[classification.class] = colors[Object.keys(this.classToColors).length];
      color = this.classToColors[classification.class];
    }

    return color;
  }
}
