import { Component, OnInit } from '@angular/core';
import { ExperimentService } from 'app/shared/experiment.service';
import { Experiment } from 'app/shared/experiment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-experiment-hub',
  templateUrl: './experiment-hub.component.html',
  styleUrls: ['./experiment-hub.component.css']
})
export class ExperimentHubComponent implements OnInit {

  selectedExperiment: Experiment;
  experiments: Observable<any>;

  constructor(public eService: ExperimentService) { }

  ngOnInit() {
    this.experiments = this.eService.getExperiments(1)
      .valueChanges
      .pipe(map(({data}) => data.researcher.experiments));
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

}
