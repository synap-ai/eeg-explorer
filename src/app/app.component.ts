import { Component, ChangeDetectorRef, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MuseClient, MuseControlResponse, zipSamples, EEGSample } from 'muse-js';
import { Observable, Subject } from 'rxjs';
import { map, share, tap, takeUntil, catchError, last } from 'rxjs/operators';
import { XYZ } from './head-view/head-view.component';
import { ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import reframe from 'reframe.js';

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
  player: YT.Player;
  private id: string='qDuKsiwS5xw';
  link1: string;
  /** Video source */
  @Input() link : SafeResourceUrl;
   /** Link text */
   @Input() text = 'Upload';
   /** Name used in form which will be sent in HTTP request. */
   @Input() param = 'file';
   /** Target URL for file uploading. */
   @Input() target = 'https://file.io';
   /** File extension that accepted, same as 'accept' of <input type="file" />. 
       By the default, it's set to 'image/*'. */
   @Input() accept = 'video/*';
   /** Allow you to add handler after its completion. Bubble up response text from remote. */
   @Output() complete = new EventEmitter<string>();

   private files: Array<FileUploadModel> = [];
  private muse = new MuseClient();

  constructor(private cd: ChangeDetectorRef, private snackBar: MatSnackBar, private _http: HttpClient, private elRef: ElementRef, public sanitizer: DomSanitizer) {
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
      this.link1 = "assets/complete.wav";
      this.link = this.sanitizer.bypassSecurityTrustResourceUrl(this.link1);
  }
  savePlayer(player){
    this.player = player;
  }
  onStateChange(event){
    
  }
  ngOnDestroy() {
    this.destroy.next();
  }

  load(url: string){
    url = url.replace('watch?v=','embed/');
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  onClick(){
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.onchange = () => {
                  for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        this.files.push({ data: file, state: 'in', 
                          inProgress: false, progress: 0, canRetry: false, canCancel: true });
                  }
                  this.uploadFiles();
            };
            fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
}

retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
}

private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest('POST', this.target, fd, {
          reportProgress: true
    });

    file.inProgress = true;
    file.sub = this._http.request(req).pipe(
          map(event => {
                switch (event.type) {
                      case HttpEventType.UploadProgress:
                            file.progress = Math.round(event.loaded * 100 / event.total);
                            break;
                      case HttpEventType.Response:
                            return event;
                }
          }),
          tap(message => { }),
          last(),
          catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                file.canRetry = true;
                return of(`${file.data.name} upload failed.`);
          })
    ).subscribe(
          (event: any) => {
                if (typeof (event) === 'object') {
                      this.removeFileFromArray(file);
                      this.complete.emit(event.body);
                }
          }
    );
}
private uploadFiles() {
  const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
  fileUpload.value = '';

  this.files.forEach(file => {
        this.uploadFile(file);
  });
}

private removeFileFromArray(file: FileUploadModel) {
  const index = this.files.indexOf(file);
  if (index > -1) {
        this.files.splice(index, 1);
  }
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
}
export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
