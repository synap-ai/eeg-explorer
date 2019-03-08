import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatSnackBarModule, MatButtonModule, MatIconModule, MatToolbarModule, MatCardModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule, MatSliderModule,
  MatListModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
  MatExpansionModule, MatSidenavModule, MatNativeDateModule
} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { YoutubePlayerModule } from 'ngx-youtube-player';
import { PapaParseModule } from 'ngx-papaparse';

import { AppComponent } from './app.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { ChartService } from './shared/chart.service';
import { HeadViewComponent } from './head-view/head-view.component';
import { HeadsetInfoComponent } from './headset-info/headset-info.component';
import { RecorderComponent } from './recorder/recorder.component';
import { ExperimentFormComponent } from './experiment-form/experiment-form.component';
import { MediaDescriptionFormComponent } from './media-description-form/media-description-form.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConnectionComponent } from './connection/connection.component';
import { ExperimentHubComponent } from './experiment-hub/experiment-hub.component';
import { DataCollectionComponent } from './data-collection/data-collection.component';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectHubComponent } from './subject-hub/subject-hub.component';
import { SessionsComponent } from './sessions/sessions.component';
import { SessionFormComponent } from './session-form/session-form.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'experiments', component: ExperimentHubComponent },
  { path: 'media', component: DataCollectionComponent },
  { path: 'subjects', component: SubjectHubComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    TimeSeriesComponent,
    HeadViewComponent,
    HeadsetInfoComponent,
    RecorderComponent,
    ExperimentFormComponent,
    MediaDescriptionFormComponent,
    HomeComponent,
    ConnectionComponent,
    ExperimentHubComponent,
    DataCollectionComponent,
    SubjectFormComponent,
    SubjectHubComponent,
    SessionsComponent,
    SessionFormComponent
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
    MatSidenavModule,
    PapaParseModule,
    YoutubePlayerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    ChartService,
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
