import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/shared/session.service';
import { Session } from 'app/shared/session';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  selectedSession: Session;

  constructor(public eService: SessionService) { }

  ngOnInit() {
  }

  editSession(session: Session) {
    this.selectedSession = session;
  }
  deleteSession(session: Session) {
    this.eService.delete(session);
  }
  newSession() {
    this.selectedSession = new Session();
  }
}
