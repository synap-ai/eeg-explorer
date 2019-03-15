import { Injectable} from '@angular/core';
import { EEGSample, zipSamples } from 'muse-js/dist/lib/zip-samples';
import { Observable, Subject } from 'rxjs';
import { MuseControlResponse, XYZ, MuseClient } from 'muse-js';
import { FilePlayerService } from './file-player.service';
import { takeUntil, tap, share, map } from 'rxjs/operators';
import { createEEG } from '@neurosity/pipes';

@Injectable({
  providedIn: 'root',
})
export class EegStreamService {
  connecting = false;
  connected = false;
  playingFile = false;
  playingMock = false;
  data: Observable<EEGSample> | null;
  batteryLevel: Observable<number> | null;
  controlResponses: Observable<MuseControlResponse>;

  get fileLoaded() {
    return this.filePlayer.Loaded;
  }

  get fileLoading() {
    return this.filePlayer.Loading;
  }

  private muse = new MuseClient();

  constructor(
    private filePlayer: FilePlayerService
  ) {
    this.muse.connectionStatus.subscribe(status => {
      this.connected = status;
      this.data = null;
      this.batteryLevel = null;
    });
  }

  async connect() {
    try {
      this.connecting = true;
      await this.muse.connect();
      this.controlResponses = this.muse.controlResponses;
      await this.muse.start();
      this.data = this.muse.eegReadings.pipe(
        zipSamples,
        share()
      );
      this.batteryLevel = this.muse.telemetryData.pipe(
        map(t => t.batteryLevel)
      );
      await this.muse.deviceInfo();
      return null;
    } catch (err) {
      return err;
    } finally {
      this.connecting = false;
    }
  }

  disconnect() {
    if (this.connected) {
      this.muse.disconnect();
    }
    if (this.playingFile) {
      this.stopFile();
    }
    if (this.playingMock) {
      this.stopWave();
    }
  }

  loadFile(file: File) {
    this.filePlayer.LoadFile(file);
  }

  playFile() {
    this.data = this.filePlayer.Data.asObservable().pipe(
      share()
    );
    this.filePlayer.Play();
    this.playingFile = true;
  }

  stopFile() {
    this.filePlayer.Stop();
    this.data = null;
    this.playingFile = false;
  }

  playWave() {
    this.data = createEEG({channles: 4, samlpingRate: 256, sine: 1 }).pipe(
      share()
    );
    this.playingMock = true;
  }

  stopWave() {
    this.data = null;
    this.playingMock = false;
  }
}