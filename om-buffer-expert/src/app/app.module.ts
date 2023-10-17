import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BufferCalculationOption1Component } from './buffer-calculation-option1/buffer-calculation-option1.component';
import { HeaderComponent } from './header/header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SolutionTableComponent } from './solution-table/solution-table.component';
import { ChatbufferomComponent } from './chatbufferom/chatbufferom.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {BufferCalculationOption2Component} from './buffer-calculation-option2/buffer-calculation-option2.component';
import { NavComponent } from './nav/nav.component';
import { SideComponent } from './side/side.component';
import { FooterComponent } from './footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSliderModule} from '@angular/material/slider';



@NgModule({
  declarations: [
    AppComponent,
    BufferCalculationOption1Component,
    HeaderComponent,
    SolutionTableComponent,
    ChatbufferomComponent,
    BufferCalculationOption2Component,
    NavComponent,
    SideComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
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
    MatTableModule,
    MatSliderModule,
    MatTooltipModule

 
    
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',  // This means space for hints/errors will only be reserved when needed.
        // ... you can set other default options here
      }
    }


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
