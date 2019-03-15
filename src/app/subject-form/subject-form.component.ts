import { Component, OnInit } from '@angular/core';
import { Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'app/shared/classes/subject';
import { SubjectService } from 'app/shared/services/subject.service';

export interface Sex {
  value: string;
}
export interface DominantHands {
  value: string;
}

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit, OnChanges {

  genders: Sex[] = [
    {value: 'M'},
    {value: 'F'},
    {value: 'O'}
  ];
  dominant_hands: DominantHands[] = [
    {value: 'R'},
    {value: 'L'},
    {value: 'A'}
  ];
  @Input() subject: Subject;

  subjectOptions: FormGroup;

  constructor(fb: FormBuilder, private eService: SubjectService) {
    this.subjectOptions = fb.group({
      id: null,
      first_name: null,
      last_name: null,
      email: null,
      gender: null,
      dob: null,
      dominant_hand: null
    });
  }

  ngOnInit() {
  }
  ngOnChanges() {
    this.subjectOptions.reset();
    if (this.subject.id) {
      this.subjectOptions.setValue(this.subject);
    }
  }
  save() {
    const id = this.subject.id;
    Object.assign(this.subject, this.subjectOptions.value);
    this.eService.save(this.subject);
  }

}
