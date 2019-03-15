import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'app/shared/subject.service';
import { Subject } from 'app/shared/subject';

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
  deleteSubject(id: number) {
    this.sService.delete(id);
  }
  newSubject() {
    this.selectedSubject = new Subject();
  }

}
