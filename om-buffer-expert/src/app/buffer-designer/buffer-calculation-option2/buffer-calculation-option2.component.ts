import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SolutionService } from '../../solution.service';
import { Compound } from '../../shared/models/compound.model';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, buffer } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from '../../shared/models/solution.model';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';


@Component({
  selector: 'app-buffer-calculation-option2',
  templateUrl: './buffer-calculation-option2.component.html',
  styleUrls: ['./buffer-calculation-option2.component.scss'],
})
export class BufferCalculationOption2Component implements OnInit, OnDestroy {
  solutionSubscription?: Subscription;
  bufferForm: FormGroup | undefined;
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  selectedAcidCompounds: string[] = [];
  selectedBasicCompounds: string[] = [];
  buffer_label: string = 'Total Buffer Conc. (M)';
  example_solution: Solution;
  buffer_compound_names: string[] = [];
  bufferSpecies: { [key: string]: any } = {};
  bufferSpeciesKeys: string[] = [];
  keyed_compounds: { [key: string]: any } = {};
  public godSolution = new Solution('God solution'); //solution to hold the user input
  public returnedSolution: Solution; //solution to hold the return from api

  filteredBufferSpecies: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public solutionMixtureService: SolutionMixtureService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.bufferSpecies = this.solutionMixtureService.bufferSpecies;
    this.bufferSpeciesKeys = Object.keys(this.bufferSpecies);
    this.keyed_compounds = this.solutionMixtureService.compounds;
    //we will monitor value changes on the autocomplete field of bufferSpeciesControl and filter the bufferSpeciesKeys accordingly
    this.filteredBufferSpecies = this.bufferForm.get('bufferSpeciesControl').valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterBufferSpecies(value))
    );
    this.solutionSubscription = this.solutionService.currentSolution.subscribe({
      next: (solution) => {
        if (solution) {
          //this.initializeForm();
          this.acidCompounds = this.solutionService.getAppAcidCompounds();
          // console.log("God acid option 2",this.acidCompounds)
          this.basicCompounds = this.solutionService.getAppBasicCompounds();
          this.saltCompounds = this.solutionService.getAppSaltCompounds();
          this.buffer_compound_names =
            this.solutionService.getAppBufferCompounds();
          this.selectedAcidCompounds = this.acidCompounds;
          this.selectedBasicCompounds = this.basicCompounds;

          //  console.log("God: got buffer compounds", this.buffer_compound_names);
          //  console.log("God: current solution",solution )
          // Assuming you have a method to handle the form population
          this.returnedSolution = solution;
          this.populateForm(solution);
          //  this.cdRef.detectChanges();
          //   console.log("God: done populating", this.bufferForm.value);

          this.bufferForm.updateValueAndValidity({
            onlySelf: false,
            emitEvent: true,
          });
        }
      },
    });

    // console.log("God: done populating after subscribe", this.bufferForm.value);
  }

  private _filterBufferSpecies(value: string): string[] {
    const filterValue = value.replace(/-/g, ' ').toLowerCase();
    const filteredOptions =  this.bufferSpeciesKeys.filter((bufferSpecies) =>
      bufferSpecies.replace(/-/g, ' ').toLowerCase().includes(filterValue)
    );

      const sortedFilteredOptions = filteredOptions.sort((a, b) => {
        // Check if either option starts with the filter value
        const startsWithA = a.toLowerCase().startsWith(filterValue) ? -1 : 1;
        const startsWithB = b.toLowerCase().startsWith(filterValue) ? -1 : 1;

        // If both or neither start with the filter value, preserve original order
        if (startsWithA === startsWithB) {
          return 0;
        }

        // Otherwise, sort by whether an option starts with the filter value
        return startsWithA < startsWithB ? -1 : 1;
      });

      return sortedFilteredOptions;
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
        //console.log("God: validator ", this.buffer_compound_names,isValid)
      }
      // console.log("God: validator true ", this.buffer_compound_names,isValid,selection1,selection2)

      // Return error object or null based on validation result
      return isValid ? null : { invalidBufferSelection: true };
    };
  }

  populateForm(solution: Solution) {
    if (solution) {
      let acidname = solution.non_salt_compounds[0].name;
      let basename = solution.non_salt_compounds[1].name;
      // console.log("God in populate form option 2 ", solution)
      let saltname: string = 'None';
      let saltconc = 0;

      this.bufferForm.controls['acidicCompound'].setValue(acidname);
      //  console.log("God: getvalue", this.bufferForm.controls['acidicCompound'].getRawValue());
      if (acidname in this.acidCompounds) {
        // console.log("God: the acid compound is here");
      }

      this.bufferForm.controls['basicCompound'].setValue(basename);
      this.bufferForm.controls['totalConcentration'].setValue(
        parseFloat(solution.target_buffer_concentration.toFixed(4))
      );
      this.bufferForm.controls['target_pH'].setValue(parseFloat(solution.pH.toFixed(3)));
      //console.log("God here in salt", solution.non_salt_compounds[0].name);
      if (solution.compounds.length == 3) {
        //console.log("God: came here because there is salt",solution.salt_compound.name );
        saltname = solution.salt_compound.name;
        saltconc = solution.compound_concentrations[saltname];
        this.bufferForm.controls['saltCompound'].setValue(saltname);
        this.bufferForm.controls['saltConcentration'].setValue(saltconc);
        //console.log("God: loggin in salt option", this.bufferForm.value);
      } else {
        this.bufferForm.controls['saltCompound'].setValue(saltname);
        this.bufferForm.controls['saltConcentration'].setValue(saltconc);
      }

      this.bufferForm.controls['bufferSpeciesControl'].setValue(
        ''
      );
      //console.log("God: populating", this.bufferForm.value);

      this.bufferForm.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    }
    //this.bufferForm.markAsUntouched();
  }

  onBufferSpeciesSelected($event) {
    
    
    let bufferSpeciesSelected = $event.option.value;
    console.log('God: buffer species selected', bufferSpeciesSelected);

    console.log('God; acidic compounds', this.acidCompounds);
    console.log('God: basic compounds', this.basicCompounds);

    const results: string[][] = [];
   let acids = new Set<string>();
   let bases = new Set<string>();

    // Iterate over each key in the object
    for (const [key, value] of Object.entries(this.bufferSpecies)) {
      // Check if the key starts with the given prefix, ignoring case
      if (key.toLowerCase().startsWith(bufferSpeciesSelected.toLowerCase())) {
        // If it matches, add its compounds to the results
        console.log('God: value', value.compounds);
        value.compounds.forEach(compound => {
          if(this.acidCompounds.includes(compound)){
            acids.add(compound);
          }
          else if(this.basicCompounds.includes(compound)){
            bases.add(compound);
          }
      });

    }
  }

  console.log('God: acids', acids);
  console.log('God: bases', bases);
this.selectedAcidCompounds = Array.from(acids);
this.selectedBasicCompounds = Array.from(bases);
this.bufferForm.controls['acidicCompound'].setValue(
  this.selectedAcidCompounds[0]
);
this.bufferForm.controls['basicCompound'].setValue(
  this.selectedBasicCompounds[0]
);

this.buffer_label = bufferSpeciesSelected.split('-')[0] +' Conc. (M)';

    console.log('God: results', results);
    let compoundobj = this.bufferSpecies[bufferSpeciesSelected];
    let compounds = compoundobj.compounds;
    console.log('God: buffer species selected', compoundobj.compounds, compounds  );
    // //write code to check which list compounds belong to
    // if (this.acidCompounds.includes(compounds[0])) {
    //   console.log('God: acid compound selected', compounds[0]);
    //   this.bufferForm.controls['acidicCompound'].setValue(compounds[0]);
    // } else if (this.basicCompounds.includes(compounds[0])) {
    //   console.log('God: basic compound selected', compounds[0]);
    //   this.bufferForm.controls['basicCompound'].setValue(compounds[0]);
    // }
    // if (this.acidCompounds.includes(compounds[1])) {
    //   console.log('God: acid compound selected', compounds[1]);
    //   this.bufferForm.controls['acidicCompound'].setValue(compounds[1]);
    // } else if (this.basicCompounds.includes(compounds[1])) {
    //   console.log('God: basic compound selected', compounds[1]);
    //   this.bufferForm.controls['basicCompound'].setValue(compounds[1]);
    // }

  //console.log("God: buffer species selected", this.bufferForm.value);

 


    //console.log("God: buffer species selected", this.bufferForm.value);
  }

  ngOnDestroy() {
    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }
  initializeForm() {
    this.bufferForm = this.formBuilder.group(
      {
        bufferSpeciesControl: [''],
        acidicCompound: ['Sodium Phosphate Monobasic', Validators.required],
        basicCompound: ['Sodium Phosphate Dibasic', Validators.required],
        saltCompound: 'Sodium Chloride',
        totalConcentration: [
          0.04,
          [Validators.required, Validators.min(0), Validators.max(0.4)],
        ],
        target_pH: [
          7.0,
          [Validators.required, Validators.min(3), Validators.max(10)],
        ],
        saltConcentration: [0.1, [Validators.min(0), Validators.max(1)]],
      },
      { validators: this.bufferSelectionValidator() }
    );
  }
  onSubmit() {
    this.godSolution = new Solution('God solution');
    if (this.bufferForm.invalid) {
      return;
    }

    const acidicCompoundName = this.bufferForm.get('acidicCompound').value;
    const basicCompoundName = this.bufferForm.get('basicCompound').value;
    const saltCompoundName = this.bufferForm.get('saltCompound').value;
    const totalConcentration = this.bufferForm.get('totalConcentration').value;
    const target_pH = this.bufferForm.get('target_pH').value;
    const saltCompoundConcentration =
      this.bufferForm.get('saltConcentration').value;

    // Create Solution object
    this.godSolution.name = 'God';
    this.godSolution.target_buffer_concentration = totalConcentration;
    this.godSolution.compound_concentrations[acidicCompoundName] = 0;
    this.godSolution.compound_concentrations[basicCompoundName] = 0;
    if (saltCompoundName != 'None') {
      this.godSolution.compound_concentrations[saltCompoundName] =
        saltCompoundConcentration;
    }

    this.godSolution.pH = target_pH;
    this.godSolution.buffer_species=this.bufferForm.get('bufferSpeciesControl').value;
    console.log("God: god buffer species", this.bufferForm.get('bufferSpeciesControl').value);
    this.calculatepH();
    this.bufferForm.markAsUntouched();
  }

  user = {
    name: 'Phosphate',
  };

  // We can get the first letter of the name like this


  calculatepH() {
    this.solutionService
      .solution_calculate_total_Conc_target_pH(this.godSolution)
      .subscribe((response: Solution) => {
        //  Update the returnedSolution property with the response
        this.returnedSolution = response;
     
      });
  }
}