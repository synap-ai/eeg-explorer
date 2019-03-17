import { Injectable} from '@angular/core';
import { EEGSample, zipSamples } from 'muse-js/dist/lib/zip-samples';
import { Observable, Subject } from 'rxjs';
import { MuseControlResponse, XYZ, MuseClient } from 'muse-js';
import { FilePlayerService } from './file-player.service';
import { takeUntil, tap, share, map, filter } from 'rxjs/operators';
import { createEEG } from '@neurosity/pipes';
import { Session } from '../classes/session';

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

  private stop = new Subject<void>();

  get fileLoaded() {
    return this.filePlayer.Loaded;
  }

  get fileLoading() {
    return this.filePlayer.Loading;
  }

  private muse: MuseClient;

  constructor(
    private filePlayer: FilePlayerService
  ) {}

  async connect() {
    try {
      this.connecting = true;
      this.muse = new MuseClient();
      this.muse.connectionStatus.subscribe(status => {
        this.connected = status;
        this.data = null;
        this.batteryLevel = null;
      });
      await this.muse.connect();
      this.controlResponses = this.muse.controlResponses;
      await this.muse.start();
      this.data = this.muse.eegReadings.pipe(
        zipSamples,
        takeUntil(this.stop),
        tap(x => console.log(x.data.toString())),
        filter(x => !(isNaN(x.data[0]) || isNaN(x.data[1]) || isNaN(x.data[2]) || isNaN(x.data[3]))),
        share(),
      );
      this.batteryLevel = this.muse.telemetryData.pipe(
        map(t => t.batteryLevel)
      );
      // await this.muse.deviceInfo();
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
    this.stop.next();
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
      takeUntil(this.stop),
      share()
    );
    this.playingMock = true;
  }

  stopWave() {
    this.data = null;
    this.playingMock = false;
  }

  playSession(session: Session) {
    this.filePlayer.LoadSession(session);
    this.data = this.filePlayer.Data.asObservable().pipe(
      takeUntil(this.stop),
      share()
    );
    this.filePlayer.Play();
    this.playingFile = true;
  }
}
