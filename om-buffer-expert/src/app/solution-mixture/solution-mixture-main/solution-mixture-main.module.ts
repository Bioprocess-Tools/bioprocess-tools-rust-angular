import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolutionMixtureMainRoutingModule } from './solution-mixture-main-routing.module';
import { SolutionMixtureMainComponent } from './solution-mixture-main.component';
import { SolutionsBrowseEditPrepareComponent } from './solutions-browse-edit-prepare/solutions-browse-edit-prepare.component';
import { SolutionsReviewComponent } from './solutions-review/solutions-review.component';
import { SolutionMixtureStepsComponent } from './solution-mixture-steps/solution-mixture-steps.component';
import { SolutionMixtureAnalysisComponent } from './solution-mixture-analysis/solution-mixture-analysis.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    SolutionMixtureMainComponent,
    SolutionsBrowseEditPrepareComponent,
    SolutionsReviewComponent,
    SolutionMixtureStepsComponent,
    SolutionMixtureAnalysisComponent
  ],
  imports: [
    CommonModule,
    SolutionMixtureMainRoutingModule,
    MatStepperModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
  ]
})
export class SolutionMixtureMainModule { }
