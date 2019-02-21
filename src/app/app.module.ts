import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatSnackBarModule, MatButtonModule, MatIconModule, MatToolbarModule, MatCardModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule, MatSliderModule,
  MatListModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
  MatExpansionModule,
} from '@angular/material';

import { YoutubePlayerModule } from 'ngx-youtube-player';
import { PapaParseModule } from 'ngx-papaparse';

import { AppComponent } from './app.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { ChartService } from './shared/chart.service';
import { HeadViewComponent } from './head-view/head-view.component';
import { HeadsetInfoComponent } from './headset-info/headset-info.component';
import { RecorderComponent } from './recorder/recorder.component';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { ExperimentFormComponent } from './experiment-form/experiment-form.component';
import { MediaDescriptionFormComponent } from './media-description-form/media-description-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeSeriesComponent,
    HeadViewComponent,
    HeadsetInfoComponent,
    RecorderComponent,
    MediaPlayerComponent,
    ExperimentFormComponent,
    MediaDescriptionFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSliderModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatExpansionModule,
    PapaParseModule,
    YoutubePlayerModule,
  ],
  providers: [
    ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
