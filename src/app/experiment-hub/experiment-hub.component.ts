import { Component, OnInit } from '@angular/core';
import { ExperimentService } from 'app/shared/experiment.service';
import { Experiment } from 'app/shared/experiment';

@Component({
  selector: 'app-experiment-hub',
  templateUrl: './experiment-hub.component.html',
  styleUrls: ['./experiment-hub.component.css']
})
export class ExperimentHubComponent implements OnInit {

  selectedExperiment: Experiment;

  constructor(private eService: ExperimentService) { }

  ngOnInit() {
  }

  editExperiment(experiment: Experiment) {
    this.selectedExperiment = experiment;
  }
  deleteExperiment(experiment: Experiment) {
    this.eService.delete(experiment);
  }
  newExperiment() {
    this.selectedExperiment = new Experiment();
  }

}
