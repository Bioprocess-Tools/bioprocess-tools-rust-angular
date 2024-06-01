import { NgModule,APP_INITIALIZER, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SolutionMixtureService } from './solution-mixture.service';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { PlotlyModule } from 'angular-plotly.js';
import PlotlyJS from 'plotly.js-cartesian-dist-min';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';

import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { CoreModule } from './core/core.module';
import { BufferDesignerModule } from './buffer-designer/buffer-designer.module';
import { StaticPagesModule } from './static-pages/static-pages.module';
import { SolutionMixtureMainModule } from './solution-mixture/solution-mixture-main/solution-mixture-main.module';
import { ServiceWorkerModule } from '@angular/service-worker';

PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BufferDesignerModule,
    SolutionMixtureMainModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    CoreModule,
    StaticPagesModule,
    MatStepperModule,
    MatChipsModule,
    PlotlyModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
 
    
  ],
  providers: [
    SolutionMixtureService,
    {
      provide:  APP_INITIALIZER,
      useFactory: (solution_mixture_service: SolutionMixtureService) => solution_mixture_service.initData(),
      deps: [SolutionMixtureService],
      multi: true,

    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic',  } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
