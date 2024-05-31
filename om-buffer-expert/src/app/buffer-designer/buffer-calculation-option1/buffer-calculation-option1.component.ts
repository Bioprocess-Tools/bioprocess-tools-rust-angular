import { Component, OnDestroy, OnInit } from '@angular/core';
import { SolutionService } from '../../solution.service';
import { SolutionMixtureService } from '../../solution-mixture.service';

import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from '../../shared/models/solution.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buffer-calculation-option1',
  templateUrl: './buffer-calculation-option1.component.html',
  styleUrls: ['./buffer-calculation-option1.component.scss'],
})
export class BufferCalculationOption1Component implements OnInit, OnDestroy {
  solutionSubscription?: Subscription;
  bufferForm: FormGroup | undefined;
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;
  //solutionedit:Solution;
  formSubmitted: boolean = false;
  public godSolution = new Solution('God solution');
  public returnedSolution: Solution;
  buffer_compound_names: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public solutionMixtureService: SolutionMixtureService
  ) // public omroute:Router

  {}

  ngOnInit(): void {
    //this.bufferForm.reset;
    this.initializeForm();
    this.acidCompounds = this.solutionMixtureService.acidic_compounds;
    this.basicCompounds = this.solutionMixtureService.basic_compounds;
    this.saltCompounds = this.solutionMixtureService.salt_compounds;
    this.solutionSubscription = this.solutionService.currentSolution.subscribe({
      next: (solution) => {
        if (solution && solution.non_salt_compounds.length <= 2) {
          this.returnedSolution = solution;
          this.populateForm(solution);
          this.bufferForm.updateValueAndValidity({
            onlySelf: false,
            emitEvent: true,
          });
        }
      },
    });
  }

  bufferSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let isValid = true;
      const selection1 = control.get('acidicCompound')?.value;
      const selection2 = control.get('basicCompound')?.value;
      if (this.buffer_compound_names.length != 0) {
        isValid =
          this.buffer_compound_names.includes(selection1) ||
          this.buffer_compound_names.includes(selection2);
      }

      // Return error object or null based on validation result
      return isValid ? null : { invalidBufferSelection: true };
    };
  }

  populateForm(solution: Solution) {
    if (solution && solution.non_salt_compounds.length <= 2) {
      let acidname = solution.non_salt_compounds[0].name;
      let basename = solution.non_salt_compounds[1].name;

      let saltname: string = 'None';
      let saltconc = 0;
      let acidconc = 0;
      let baseconc = 0;

      acidconc = parseFloat(
        solution.compound_concentrations[acidname].toPrecision(4)
      );
      baseconc = parseFloat(
        solution.compound_concentrations[basename].toPrecision(4)
      );
      this.bufferForm.controls['acidicCompound'].setValue(acidname);
      this.bufferForm.controls['basicCompound'].setValue(basename);
      this.bufferForm.controls['acidicConcentration'].setValue(acidconc);
      this.bufferForm.controls['basicConcentration'].setValue(baseconc);

      if (solution.salt_compound != null) {
        saltname = solution.salt_compound.name;
        saltconc = solution.compound_concentrations[saltname];
        this.bufferForm.controls['saltCompound'].setValue(saltname);
        this.bufferForm.controls['saltConcentration'].setValue(saltconc);
      } else {
        this.bufferForm.controls['saltCompound'].setValue(saltname);
        this.bufferForm.controls['saltConcentration'].setValue(saltconc);
      }

      this.bufferForm.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    }
    // this.bufferForm.markAsUntouched();
  }

  ngOnDestroy(): void {
    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }

  initializeForm() {
    this.formSubmitted = false;
    this.bufferForm = this.formBuilder.group(
      {
        acidicCompound: ['Sodium Phosphate Monobasic', Validators.required],
        basicCompound: ['Sodium Phosphate Dibasic', Validators.required],
        saltCompound: 'Sodium Chloride',
        acidicConcentration: [
          0.019,
          [Validators.required, Validators.min(0), Validators.max(0.4)],
        ],
        basicConcentration: [
          0.021,
          [Validators.required, Validators.min(0), Validators.max(0.4)],
        ],
        saltConcentration: [0.1, [Validators.min(0), Validators.max(1)]],
      },
      { validators: this.bufferSelectionValidator() }
    );
  }

  onSubmit() {
    this.formSubmitted = true;

    this.godSolution = new Solution('God solution');
    if (this.bufferForm.invalid) {
      return;
    }

    const acidicCompoundName = this.bufferForm.get('acidicCompound').value;
    const basicCompoundName = this.bufferForm.get('basicCompound').value;
    const saltCompoundName = this.bufferForm.get('saltCompound').value;

    const acidicCompoundConcentration = parseFloat(
      this.bufferForm.get('acidicConcentration').value
    );
    const basicCompoundConcentration = parseFloat(
      this.bufferForm.get('basicConcentration').value
    );
    const saltCompoundConcentration = parseFloat(
      this.bufferForm.get('saltConcentration').value
    );

    // Create Solution object
    this.godSolution.name = 'God';
    this.godSolution.compound_concentrations[acidicCompoundName] =
      acidicCompoundConcentration;
    this.godSolution.compound_concentrations[basicCompoundName] =
      basicCompoundConcentration;
    if (saltCompoundName != 'None') {
      this.godSolution.compound_concentrations[saltCompoundName] =
        saltCompoundConcentration;
    }

    this.calculatepH();
    this.bufferForm.markAsUntouched();
  }

  calculatepH() {
    // Make the API call to calculate pH
    this.solutionService
      .solution_calculate_pH(this.godSolution)
      .subscribe((response: Solution) => {
        // Update the returnedSolution property with the response
        this.returnedSolution = response;
      });
  }
}
