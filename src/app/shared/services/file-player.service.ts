import { Injectable } from '@angular/core';
import { Papa, PapaParseResult } from 'ngx-papaparse';
import { EEGSample } from 'muse-js';
import { Subject } from 'rxjs';
import { Session } from '../classes/session';

@Injectable({
  providedIn: 'root'
})
export class FilePlayerService {

  private playing = false;
  get Playing() {
    return this.playing;
  }

  private loading = false;
  get Loading() {
    return this.loading;
  }

  get Loaded() {
    return this.data.length > 0 && !this.Loading;
  }

  private museFile: boolean | null = null;

  private sampleIndex = 0;
  private startTime = -1;
  private data: EEGSample[] = [];
  private timerID;
  PlayBackTime = -1;
  PlayBackStart = -1;
  Data = new Subject<EEGSample>();

  constructor(private papa: Papa) { }

  async LoadFile(file: File) {
    this.loading = true;
    this.sampleIndex = 0;
    this.data = [];
    this.museFile = null;
    this.papa.parse(file, {
      step: (row) => this.readRecordLine(row),
      complete: () => this.loading = false,
    });
  }

  LoadSession(session: Session) {
    this.sampleIndex = 0;
    let i = 0;
    this.data = session.eeg_data.map(s => {
      return {
        index: i++,
        timestamp: s.timestamp,
        data: [s.tp9, s.af7, s.af8, s.tp10],
      };
    });
    this.startTime = this.data[0].timestamp;
    this.museFile = null;
  }

  readRecordLine(row: PapaParseResult) {
    const values = row.data[0];
    if (!values[1]) {
      return;
    }


    if (this.museFile === null) { // figure out what kind of file this is
      this.museFile = values[1].includes('muse');
    }
    if (this.museFile) {
      const type: string = values[1].trim();
      if (type === '/muse/eeg' && values.length > 5) { // process muse files
          const timeStamp = parseFloat(values[0].trim()) * 1000;
          const tp9 = parseFloat(values[2].trim());
          const af7 = parseFloat(values[3].trim());
          const af8 = parseFloat(values[4].trim());
          const tp10 = parseFloat(values[5].trim());
          const eegSample: EEGSample = { index: this.sampleIndex, timestamp: timeStamp, data: [tp9, af7, af8, tp10] };
          this.data.push(eegSample);
          if (this.sampleIndex === 0) {
            this.startTime = timeStamp;
          }
          this.sampleIndex++;
      }
    } else if (this.museFile === false && !values[0].includes('time')) { // process web files
        const timeStamp = parseFloat(values[0].trim());
        const tp9 = parseFloat(values[1].trim());
        const af7 = parseFloat(values[2].trim());
        const af8 = parseFloat(values[3].trim());
        const tp10 = parseFloat(values[4].trim());
        const eegSample: EEGSample = { index: this.sampleIndex, timestamp: timeStamp, data: [tp9, af7, af8, tp10] };
        this.data.push(eegSample);
        if (this.sampleIndex === 0) {
          this.startTime = timeStamp;
        }
        this.sampleIndex++;
    }
  }

  Play() {
    if (this.PlayBackStart !== -1) {
      return;
    }
    this.PlayBackTime = this.startTime;
    this.PlayBackStart = Date.now();
    this.playing = true;
    this.playback();
  }

  Stop() {
    clearTimeout(this.timerID);
    this.playing = false;
    this.PlayBackTime = -1;
    this.PlayBackStart = -1;
    this.data = [];
  }

  private async playback() {
    const playData = (index: number) => {
      if (index === this.data.length) {
        return;
      }
      const now = Date.now();
      this.PlayBackTime = this.startTime + now - this.PlayBackStart;
      const delay = this.data[index].timestamp - this.PlayBackTime;
      const newTimeStamp = now + delay;
      const sample: EEGSample = {
        index: this.data[index].index,
        data: this.data[index].data,
        timestamp: newTimeStamp,
      };
      if (delay <= 0) {
         this.Data.next(sample);
         return playData(++index);
      } else {
        return setTimeout(() => {
          this.Data.next(sample);
          playData(++index);
        }, delay);
      }
    };
    this.timerID = playData(0);
  }
}
