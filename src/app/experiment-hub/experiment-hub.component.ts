import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExperimentService } from 'app/shared/services/experiment.service';
import { Experiment } from 'app/shared/classes/experiment';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-experiment-hub',
  templateUrl: './experiment-hub.component.html',
  styleUrls: ['./experiment-hub.component.css']
})
export class ExperimentHubComponent implements OnInit {
  selectedExperiment: Experiment;
  experiments: Observable<any[]>;

  constructor(public eService: ExperimentService) { }

  ngOnInit() {
    this.updateExperiments();
  }

  updateExperiments() {
    this.experiments = this.eService.getExperiments(1);
  }

  editExperiment(experiment: Experiment) {
    this.selectedExperiment = experiment;
  }
  deleteExperiment(id: Number) {
    this.eService.delete(id);
  }
  newExperiment() {
    this.selectedExperiment = new Experiment();
  }


  onSave() {
    this.selectedExperiment = null;
  }

}
