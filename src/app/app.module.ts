import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatSnackBarModule, MatButtonModule, MatIconModule, MatToolbarModule, MatCardModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule, MatSliderModule,
  MatListModule, MatFormFieldModule, MatInputModule
} from '@angular/material';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { AppComponent } from './app.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { ChartService } from './shared/chart.service';
import { HeadViewComponent } from './head-view/head-view.component';
import { HeadsetInfoComponent } from './headset-info/headset-info.component';
import { RecorderComponent } from './recorder/recorder.component';
import { MatVideoModule } from 'mat-video';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { YoutubePlayerModule } from 'ngx-youtube-player';

@NgModule({
  declarations: [
    AppComponent,
    TimeSeriesComponent,
    HeadViewComponent,
    HeadsetInfoComponent,
    RecorderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSliderModule,
    MatListModule,
    MatVideoModule,
    MatFormFieldModule,
    MatFileUploadModule,
    YoutubePlayerModule
  ],
  providers: [
    ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
