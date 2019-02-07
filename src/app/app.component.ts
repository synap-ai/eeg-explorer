import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { MuseClient, MuseControlResponse, zipSamples, EEGSample } from 'muse-js';
import { Observable, Subject } from 'rxjs';
import { map, share, tap, takeUntil } from 'rxjs/operators';

import { XYZ } from './head-view/head-view.component';

import { Papa, PapaParseResult } from 'ngx-papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  connecting = false;
  connected = false;
  data: Observable<EEGSample> | null;
  batteryLevel: Observable<number> | null;
  controlResponses: Observable<MuseControlResponse>;
  accelerometer: Observable<XYZ>;
  destroy = new Subject<void>();
  replayFile: File = null;
  playBackEEG: Subject<EEGSample>;
  fileTimeStart = -1;
  playBackStart = -1;
  lastTimeStamp: Observable<number> = null;
  playBackIndex: number;

  private muse = new MuseClient();

  constructor(private cd: ChangeDetectorRef, private snackBar: MatSnackBar, private papa: Papa) {
  }

  ngOnInit() {
    this.muse.connectionStatus.pipe(
      takeUntil(this.destroy)
    )
      .subscribe(status => {
        this.connected = status;
        this.data = null;
        this.batteryLevel = null;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  async connect() {
    this.connecting = true;
    this.snackBar.dismiss();
    try {
      await this.muse.connect();
      this.controlResponses = this.muse.controlResponses;
      await this.muse.start();
      this.data = this.muse.eegReadings.pipe(
        zipSamples,
        takeUntil(this.destroy),
        tap(() => this.cd.detectChanges()),
        share()
      );
      this.batteryLevel = this.muse.telemetryData.pipe(
        takeUntil(this.destroy),
        map(t => t.batteryLevel)
      );
      this.accelerometer = this.muse.accelerometerData.pipe(
        takeUntil(this.destroy),
        map(reading => reading.samples[reading.samples.length - 1])
      );
      await this.muse.deviceInfo();
    } catch (err) {
      this.snackBar.open('Connection failed: ' + err.toString(), 'Dismiss');
    } finally {
      this.connecting = false;
    }
  }

  disconnect() {
    this.muse.disconnect();
  }

  get enableAux() {
    return this.muse.enableAux;
  }

  set enableAux(value: boolean) {
    this.muse.enableAux = value;
  }

  handleFileInput(files: FileList) {
    this.replayFile = files.item(0);
  }

  async playFile() {
    this.connecting = true;
    this.snackBar.dismiss();
    try {
      // Pump file data into data
      this.playBackEEG = new Subject<EEGSample>();
      this.data = this.playBackEEG.asObservable().pipe(
        takeUntil(this.destroy),
        tap(() => this.cd.detectChanges()),
        share()
      );
      this.lastTimeStamp = this.data.pipe(
        map(sample => sample.timestamp / 1000),
      );
      this.playBackIndex = 0;

      this.playBackStart = Date.now() / 1000;

      this.papa.parse(this.replayFile, {
        /*worker: true,*/
        step: (row) => this.readRecordLine(row),
        complete: () => console.log('File complete')
      });
    } catch (err) {
      this.snackBar.open('File play failed: ' + err.toString(), 'Dismiss');
    } finally {
      this.connecting = false;
    }

  }

  async readRecordLine(row: PapaParseResult) {
    const values = row.data[0];
    if (!values[1]) {
      return;
    }
    const type = values[1].trim();
    if (type === '/muse/eeg' && values.length > 5) {
        const timeStamp = parseFloat(values[0].trim());
        if (this.fileTimeStart === -1) {
          this.fileTimeStart = timeStamp;
        }
        const relativeTime = this.playBackStart + (timeStamp - this.fileTimeStart);

        const tp9 = parseFloat(values[2].trim());
        const af7 = parseFloat(values[3].trim());
        const af8 = parseFloat(values[4].trim());
        const tp10 = parseFloat(values[5].trim());
        const eegSample: EEGSample = { index: this.playBackIndex, timestamp: relativeTime * 1000, data: [tp9, af7, af8, tp10] };
        this.playBackIndex++;
        const toWait =  relativeTime - (Date.now() / 1000);
        console.log(toWait);
        if (toWait <= 0) {
          this.playBackEEG.next(eegSample);
        } else {
          setTimeout( () => this.playBackEEG.next(eegSample), toWait);
        }
    }
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}


