import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbufferomComponent } from './chatbufferom/chatbufferom.component';
import { BufferCalculationOption1Component } from './buffer-calculation-option1/buffer-calculation-option1.component';
import { BufferCalculationOption2Component } from './buffer-calculation-option2/buffer-calculation-option2.component';  
import { SolutionTableComponent } from './solution-table/solution-table.component';
import { BufferDesignerComponent } from './buffer-designer.component';


import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { PlotlyModule } from 'angular-plotly.js';
import PlotlyJS from 'plotly.js-cartesian-dist-min';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';


import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BufferDesignerRoutingModule } from './buffer-designer-routing.module';
import { RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import { SuperCalculatorComponent } from './super-calculator/super-calculator.component'

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
ChatbufferomComponent,
BufferCalculationOption1Component,
BufferCalculationOption2Component,
SolutionTableComponent,
BufferDesignerComponent,
SuperCalculatorComponent

  ],
  imports: [
    CommonModule,


    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    MatFormFieldModule,
    MatMenuModule,
    BufferDesignerRoutingModule,
    RouterModule,
     MatExpansionModule,
     MatTooltipModule,
     MatAutocompleteModule,
      MatCheckboxModule,
    PlotlyModule



  ],
  exports: [
    BufferDesignerComponent  // <- This is important
  ]
})
export class BufferDesignerModule { }
