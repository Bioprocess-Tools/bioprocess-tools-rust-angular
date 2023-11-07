import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion'


import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';


import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent,
    AboutUsComponent,
    FeedbackComponent,
    UserGuideComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
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

    RouterModule,
    MatExpansionModule
  ],
  exports: [
    HomeComponent,
    AboutUsComponent,
    FeedbackComponent,
    UserGuideComponent,
    ContactUsComponent
    // other components you want to use in other modules...
  ]
})
export class StaticPagesModule { }
