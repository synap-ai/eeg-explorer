import { Injectable } from '@angular/core';
import { Session } from './session';
const exampleData: Session[] = [
  {id: 'session 1', subject_id: 'subject 1', experiment_id: '123', date: new Date(), video_id: 'GTcM7ydgAwo', eeg_data: 'data 1'},
  {id: 'session 2', subject_id: 'subject 1', experiment_id: '213', date: new Date(), video_id: 'GTcM7ydgAwo', eeg_data: 'data 2'},
  {id: 'session 3', subject_id: 'subject 1', experiment_id: '321', date: new Date(), video_id: 'GTcM7ydgAwo', eeg_data: 'data 3'},
];
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessions: Session[];

  constructor() {
    this.sessions = exampleData;
  }

  save(session: Session) {
    const i = this.sessions.findIndex(e => e.id === session.id);
    if (i >= 0) {
      this.sessions[i] = session;
    } else {
      this.sessions.push(session);
    }
  }

  delete(session: Session) {
    const i = this.sessions.indexOf(session);
    if (i >= 0) {
      this.sessions.splice(i, 1);
    }
  }
}
