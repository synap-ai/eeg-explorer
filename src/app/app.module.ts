import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { ChartService } from './shared/services/chart.service';
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
import { BlinkDetectorComponent } from './blink-detector/blink-detector.component';
import { LoginComponent } from './login/login.component';
import { ViewComponent } from './view/view.component';
import { NeedAuthGuard } from 'app/need-auth.guard';
import { AnalysisHubComponent } from './analysis-hub/analysis-hub.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'experiments', component: ExperimentHubComponent, canActivate: [NeedAuthGuard] },
  { path: 'media', component: DataCollectionComponent, canActivate: [NeedAuthGuard] },
  { path: 'subjects', component: SubjectHubComponent, canActivate: [NeedAuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'analysis', component: AnalysisHubComponent },
  { path: '**', component: LoginComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    TimeSeriesComponent,
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
    BlinkDetectorComponent,
    LoginComponent,
    ViewComponent,
    AnalysisHubComponent,
  ],
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
    NeedAuthGuard,
    ChartService,
    MatDatepickerModule,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:8000/graphql'
          })
        };
      },
      deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
