import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'app/shared/services/subject.service';
import { Subject } from 'app/shared/classes/subject';

@Component({
  selector: 'app-subject-hub',
  templateUrl: './subject-hub.component.html',
  styleUrls: ['./subject-hub.component.css']
})
export class SubjectHubComponent implements OnInit {
  selectedSubject: Subject;

  constructor(public sService: SubjectService) { }

  ngOnInit() {
  }

  editSubject(subject: Subject) {
    this.selectedSubject = subject;
  }

  deleteSubject(subject: Subject) {
    if (this.selectedSubject && subject.id === this.selectedSubject.id) {
      this.selectedSubject = null;
    }
    this.sService.delete(subject.id);
  }
  newSubject() {
    this.selectedSubject = new Subject();
  }

  onSave() {
    this.selectedSubject = null;
  }

}
