import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/shared/session.service';
import { Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Session } from 'app/shared/session';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Experiment } from 'app/shared/experiment';
import { Subject } from 'app/shared/subject';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.css']
})
export class SessionFormComponent implements OnInit, OnChanges {
  @Input() session: Session;

  experiments: Experiment[] = [
    {id: '1568', title: 'Experiment 1', epoch: 125, epochInterval: 200, useBandPowers: true, useCovariance: true, videos: null },
    {id: '19803', title: 'Experiment 2', epoch: 125, epochInterval: 200, useBandPowers: true, useCovariance: true, videos: null },
    {id: '4896', title: 'Experiment 3', epoch: 125, epochInterval: 200, useBandPowers: true, useCovariance: true, videos: null }
  ];
  subjects: Subject[] = [
    {id: '56', name: 'Subject 1', dob: new Date(), sex: 'Male', dominantHand: 'Left' },
    {id: '98', name: 'Subject 2', dob: new Date(), sex: 'Male', dominantHand: 'Left' },
    {id: '45', name: 'Subject 3', dob: new Date(), sex: 'Male', dominantHand: 'Left' }
  ];
  sessionOptions: FormGroup;

  constructor(fb: FormBuilder, private eService: SessionService) {
    this.sessionOptions = fb.group({
      id: null,
      subject_id: null,
      experiment_id: null,
      date: null,
      video_id: null,
      eeg_data: null
    });
  }

  ngOnInit() {
  }
  ngOnChanges() {
    this.sessionOptions.reset();
    if (this.session.id) {
      this.sessionOptions.setValue(this.session);
    }
  }
  save() {
    const id = this.session.id;
    Object.assign(this.session, this.sessionOptions.value);
    this.eService.save(this.session);
  }


}
