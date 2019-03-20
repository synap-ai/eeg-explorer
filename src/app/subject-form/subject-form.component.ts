import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'app/shared/classes/subject';
import { SubjectService } from 'app/shared/services/subject.service';

export interface Sex {
  value: string;
  viewValue: string;
}
export interface DominantHands {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit, OnChanges {
  @Input() subject: Subject;
  @Output() onSave = new EventEmitter<void>();
  date = new Date();
  minDate = new Date(this.date.getFullYear() - 100, 0, 1);
  maxDate = new Date(this.date.getFullYear(), 0, 1);

  genders: Sex[] = [
    {value: 'M', viewValue: 'Male'},
    {value: 'F', viewValue: 'Female'},
    {value: 'O', viewValue: 'Other'}
  ];
  dominant_hands: DominantHands[] = [
    {value: 'R', viewValue: 'Right'},
    {value: 'L', viewValue: 'Left'},
    {value: 'A', viewValue: 'Ambidextrous'}
  ];

  subjectOptions: FormGroup;

  constructor(fb: FormBuilder, private sService: SubjectService) {
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

  async save() {
    const id = this.subject.id;
    Object.assign(this.subject, this.subjectOptions.value);
    this.sService.save(this.subject, () => this.onSave.emit());
  }
}
