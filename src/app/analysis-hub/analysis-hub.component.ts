import { Component, OnInit } from '@angular/core';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';

@Component({
  selector: 'app-analysis-hub',
  templateUrl: './analysis-hub.component.html',
  styleUrls: ['./analysis-hub.component.css']
})
export class AnalysisHubComponent implements OnInit {

  get connected() {
    return (this.eegService.data !== null);
  }

  constructor(private eegService: EegStreamService) { }

  ngOnInit() {
  }

}
