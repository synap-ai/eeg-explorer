import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { MuseClient, MuseControlResponse, zipSamples, EEGSample } from 'muse-js';
import { Observable, Subject } from 'rxjs';
import { map, share, tap, takeUntil } from 'rxjs/operators';

import { XYZ } from './head-view/head-view.component';

import { FilePlayerService } from './shared/file-player.service';

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

  constructor(private cd: ChangeDetectorRef, private snackBar: MatSnackBar, public FilePlayer: FilePlayerService) {
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
    this.FilePlayer.LoadFile(this.replayFile);
  }

  playFile() {
    this.data = this.FilePlayer.Data.asObservable().pipe(
      takeUntil(this.destroy),
      tap(() => this.cd.detectChanges()),
      share()
    );
    this.FilePlayer.Play();
  }

  stopFile() {
    this.FilePlayer.Stop();
    this.data = null;
    this.replayFile = null;
  }
}


