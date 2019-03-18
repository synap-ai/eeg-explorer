import { Component, OnInit } from '@angular/core';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';
import { ClassifierService } from 'app/shared/services/classifier.service';
import { Classifier } from 'app/shared/classes/classifier';

@Component({
  selector: 'app-analysis-hub',
  templateUrl: './analysis-hub.component.html',
  styleUrls: ['./analysis-hub.component.css']
})
export class AnalysisHubComponent implements OnInit {

  get connected() {
    return (this.eegService.data !== null);
  }

  get classifiers() {
    return this.cService.classifiers;
  }

  classifier: Classifier | null = null;

  constructor(private eegService: EegStreamService, private cService: ClassifierService) { }

  ngOnInit() {
  }

}
