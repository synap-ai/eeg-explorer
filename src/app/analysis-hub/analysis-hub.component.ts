import { Component, OnInit } from '@angular/core';
import { EegStreamService } from 'app/shared/services/eeg-stream.service';
import { ClassifierService } from 'app/shared/services/classifier.service';
import { Classifier } from 'app/shared/classes/classifier';
import { Observable } from 'rxjs';
import { Experiment } from 'app/shared/classes/experiment';
import { MediaDescription } from 'app/shared/classes/media-description';
import { Subject } from 'app/shared/classes/subject';
import { MatSnackBar } from '@angular/material';
import { ExperimentService } from 'app/shared/services/experiment.service';
import { SubjectService } from 'app/shared/services/subject.service';
import { SessionService } from 'app/shared/services/session.service';
import { Classification } from 'app/shared/classes/classification';
import { Session } from 'app/shared/classes/session';

@Component({
  selector: 'app-analysis-hub',
  templateUrl: './analysis-hub.component.html',
  styleUrls: ['./analysis-hub.component.css']
})
export class AnalysisHubComponent implements OnInit {
  subject: Subject;
  experiment: Experiment;
  video: MediaDescription;
  classifier: Classifier | null = null;
  experiments: Observable<Experiment[]>;

  loadingSession = false;
  loadingClfs = false;
  selectedSession: Session | null = null;
  classifications: Classification[];

  chart = [];
  highPositiveCount = 0;
  lowPositiveCount = 0;
  highNegativeCount = 0;
  lowNegativeCount = 0;

  get connected() {
    return (this.eegService.data !== null);
  }

  get classifiers() {
    return this.cService.classifiers;
  }

  constructor(private snackBar: MatSnackBar,
    public eService: ExperimentService,
    public sService: SubjectService,
    public eegService: EegStreamService,
    private sessionsService: SessionService,
    private cService: ClassifierService) {
  }

  ngOnInit() {
    this.experiments = this.eService.getExperiments();
  }

  getSession() {
    this.selectedSession = null;
    this.loadingSession = true;
    this.sessionsService.getSession(
      this.subject.id,
      this.experiment.id,
      this.video.id).subscribe((session) => {
        if ((session.data as any).getSession) {
          this.selectedSession = (session.data as any).getSession as Session;
        } else {
          this.snackBar.open('Failed to fetch session', 'Dismiss');
        }
      }, (error => {
        this.snackBar.open('Failed to fetch session: ' + error.toString(), 'Dismiss');
      }), () => {
        this.loadingSession = false;
      });
  }

  classify() {
    this.classifications = null;
    this.loadingClfs = true;
    this.cService.classify(this.classifier, this.selectedSession).subscribe(clfs => {
      if (clfs) {
        this.classifications = clfs;
      } else {
        this.snackBar.open('Failed to get classifications', 'Dismiss');
      }
      for (let i = 0; i < clfs.length; i++) {
        const clf = clfs[i];
        this.highPositiveCount += clf.class === 'High-Positive' ? 1 : 0;
        this.lowPositiveCount += clf.class === 'Low-Positive' ? 1 : 0;
        this.highNegativeCount += clf.class === 'High-Negative' ? 1 : 0;
        this.lowNegativeCount += clf.class === 'Low-Negative' ? 1 : 0;
      }
    }, error => {
      this.snackBar.open('Failed to get classifications: ' + error.toString(), 'Dismiss');
    }, () => {
      this.loadingClfs = false;
    });
  }
}
