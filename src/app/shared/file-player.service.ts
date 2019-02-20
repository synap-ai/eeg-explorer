import { Injectable } from '@angular/core';
import { LoadingManager } from 'three';
import { Papa, PapaParseResult } from 'ngx-papaparse';
import { EEGSample } from 'muse-js';
import { Observable, Subject } from 'rxjs';
import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { timestamp } from 'rxjs/operators';

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

  private sampleIndex = 0;
  private startTime = -1;
  private data: EEGSample[] = [];
  private timerID: number;
  PlayBackTime = -1;
  PlayBackStart = -1;
  Data = new Subject<EEGSample>();

  constructor(private papa: Papa) { }

  async LoadFile(file: File) {
    this.loading = true;
    this.sampleIndex = 0;
    this.data = [];
    this.papa.parse(file, {
      step: (row) => this.readRecordLine(row),
      complete: () => this.loading = false,
    });
  }

  readRecordLine(row: PapaParseResult) {
    const values = row.data[0];
    if (!values[1]) {
      return;
    }
    const type = values[1].trim();
    if (type === '/muse/eeg' && values.length > 5) {
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

      if (!this.Playing) {
        return setTimeout(() => playData(index), 100);
      }

      this.PlayBackTime = this.startTime + Date.now() - this.PlayBackStart;
      let delay = this.data[index].timestamp - this.PlayBackTime;
      delay = (delay < 0) ? 0 : delay;
      const newTimeStamp = Date.now() + delay;
      return setTimeout(() => {
        const sample: EEGSample = {
          index: this.data[index].index,
          data: this.data[index].data,
          timestamp: newTimeStamp,
        };
        this.Data.next(sample);
        playData(++index);
      }, delay);
    };
    this.timerID = playData(0);
  }
}
