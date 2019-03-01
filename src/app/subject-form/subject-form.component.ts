import { Component, OnInit } from '@angular/core';
import { Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MediaDescription } from 'app/shared/media-description';
import { Subject } from 'app/shared/subject';
import { e } from '@angular/core/src/render3';
import { SubjectService } from 'app/shared/subject.service';

export interface Sex {
  value: string;
}


@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit, OnChanges {

  sexes: Sex[] = [
    {value: 'Male'},
    {value: 'Female'},
    {value: 'Other'}
  ];
  @Input() subject: Subject;

  subjectOptions: FormGroup;

  constructor(fb: FormBuilder, private eService: SubjectService) { 
    this.subjectOptions = fb.group({
      id: null,
      age: null,
      sex: null
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
