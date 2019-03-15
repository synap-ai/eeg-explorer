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

  constructor(public eService: SubjectService) { }

  ngOnInit() {
  }

  editSubject(subject: Subject) {
    this.selectedSubject = subject;
  }
  deleteSubject(subject: Subject) {
    this.eService.delete(subject);
  }
  newSubject() {
    this.selectedSubject = new Subject();
  }

}
