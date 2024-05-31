import { Component, OnDestroy, OnInit } from '@angular/core';
import { SolutionService } from '../../solution.service';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
  isLoading = false;
  errorMessage: string = '';
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  selectedAcidCompounds: string[] = [];
  selectedBasicCompounds: string[] = [];
  buffer_label: string = 'Total Buffer Conc. (M)';
  example_solution: Solution;
  buffer_compound_names: string[] = [];
  bufferSpecies: { [key: string]: any } = {}; // Consider providing a more specific type
  bufferSpeciesKeys: string[] = [];
  keyed_compounds: { [key: string]: any } = {}; // Consider providing a more specific type
  public userInputSolution = new Solution('User Input Solution'); // Renamed from godSolution
  public returnedSolution: Solution; //solution to hold the return from api
  formSubmitted: boolean = false;
  filteredBufferSpecies: Observable<string[]>;
  bufferSpeciespHMap: { [key: string]: number } = {}; // Consider providing a more specific type

  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public solutionMixtureService: SolutionMixtureService
  ) {}

  ngOnInit(): void {
    try {
      this.initializeForm();
      this.bufferSpecies = this.solutionMixtureService.bufferSpecies;
      this.bufferSpeciesKeys = Object.keys(this.bufferSpecies);
      this.keyed_compounds = this.solutionMixtureService.compounds;
      this.bufferSpeciespHMap = this.solutionMixtureService.bufferSpeciespHMap;
      this.acidCompounds = this.solutionMixtureService.acidic_compounds;
      this.basicCompounds = this.solutionMixtureService.basic_compounds;
      this.saltCompounds = this.solutionMixtureService.salt_compounds;
      this.buffer_compound_names = this.solutionMixtureService.buffer_compounds;
      this.selectedAcidCompounds = this.acidCompounds;
      this.selectedBasicCompounds = this.basicCompounds;

      // Monitor value changes on the autocomplete field of bufferSpeciesControl and filter the bufferSpeciesKeys accordingly
      this.filteredBufferSpecies = this.bufferForm
        .get('bufferSpeciesControl')
        .valueChanges.pipe(
          startWith(''),
          map((value: string) => this._filterBufferSpecies(value))
        );

      this.solutionSubscription =
        this.solutionService.currentSolution.subscribe({
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
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  }

  private _filterBufferSpecies(value: string): string[] {
    try {
      if (typeof value !== 'string') {
        throw new Error('Invalid input type. Expected a string.');
      }

      const filterValue = value.replace(/-/g, ' ').toLowerCase();

      const filteredOptions = this.bufferSpeciesKeys.filter((bufferSpecies) =>
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
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
      return [];
    }
  }
  bufferSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        let isValid = true;
        const selection1 = control.get('acidicCompound')?.value;
        const selection2 = control.get('basicCompound')?.value;

        // Check if the selected compounds are in the list of buffer compounds
        if (this.buffer_compound_names.length != 0) {
          isValid =
            this.buffer_compound_names.includes(selection1) ||
            this.buffer_compound_names.includes(selection2);
        }

        // Return error object or null based on validation result
        return isValid ? null : { invalidBufferSelection: true };
      } catch (error) {
        // Handle error
        console.error('An error occurred:', error);
        return { invalidBufferSelection: true };
      }
    };
  }
  //this function is called to populate the form with solution
  //object to facililate editing and "translating from" other buffer designer options
  populateForm(solution: Solution) {
    try {
      //we will not populate if it is from the super calculator, if the compounds is greater than 2
      if (
        solution &&
        typeof solution === 'object' &&
        solution.non_salt_compounds.length <= 2
      ) {
        this.bufferForm.controls['bufferSpeciesControl'].setValue(
          solution.buffer_species
        );
        //this is same as onBufferSpeciesSelected except we are not setting the default values as first -
        //we are setting the values based on the solution object
        this.onBufferSpeciesSelectedTrigger(solution.buffer_species);
        //assume the first compound is the acid and the second is the base
        //should be as we send to the api in that order and the add compounds
        // used in that order
        let acidname = solution.non_salt_compounds[0].name;
        let basename = solution.non_salt_compounds[1].name;

        this.bufferForm.controls['acidicCompound'].setValue(acidname);
        this.bufferForm.controls['basicCompound'].setValue(basename);
        this.bufferForm.controls['totalConcentration'].setValue(
          parseFloat(solution.target_buffer_concentration.toFixed(4))
        );
        this.bufferForm.controls['target_pH'].setValue(
          parseFloat(solution.pH.toFixed(3))
        );
        //deal with salt compound
        let saltname: string = 'None';
        let saltconc = 0;
        if (solution.salt_compound != null) {
          saltname = solution.salt_compound.name;
          saltconc = solution.compound_concentrations[saltname];
          this.bufferForm.controls['saltCompound'].setValue(saltname);
          this.bufferForm.controls['saltConcentration'].setValue(saltconc);
        } else {
          //if there is no salt compound, we set the salt compound to None and the concentration to 0
          this.bufferForm.controls['saltCompound'].setValue(saltname);
          this.bufferForm.controls['saltConcentration'].setValue(saltconc);
        }
      }
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  }

  onBufferSpeciesSelected($event) {
    this.formSubmitted = false; //to help with the result flag
    let bufferSpeciesSelected = $event.option.value;
    // we are trying to filter the compounds based on the buffer species selected
    let acids = new Set<string>();
    let bases = new Set<string>();

    // Iterate over each key in the object
    for (const [key, value] of Object.entries(this.bufferSpecies)) {
      // Check if the key starts with the given prefix, ignoring case
      if (key.toLowerCase().startsWith(bufferSpeciesSelected.toLowerCase())) {
        // If it matches, add its compounds to the results

        value.compounds.forEach((compound) => {
          if (this.acidCompounds.includes(compound)) {
            acids.add(compound);
          } else if (this.basicCompounds.includes(compound)) {
            bases.add(compound);
          }
        });
      }
    }
    //set options for the acid and base compounds from the above loop
    this.selectedAcidCompounds = Array.from(acids);
    this.selectedBasicCompounds = Array.from(bases);
    //set the default values for the acid and base compounds
    this.bufferForm.controls['acidicCompound'].setValue(
      this.selectedAcidCompounds[0]
    );
    this.bufferForm.controls['basicCompound'].setValue(
      this.selectedBasicCompounds[0]
    );

    this.bufferForm.controls['target_pH'].setValue(
      this.bufferSpeciespHMap[bufferSpeciesSelected.split('-')[0]]
    );
    //set the buffer label - for user to know what to input
    this.buffer_label = bufferSpeciesSelected.split('-')[0] + ' Conc. (M)';
  }
  //this function is to set the acid and base compounds based on the buffer species selected
  onBufferSpeciesSelectedTrigger(bufferSpeciesSelected: string) {
    try {
      let acids = new Set<string>();
      let bases = new Set<string>();

      // Iterate over each key in the object
      for (const [key, value] of Object.entries(this.bufferSpecies)) {
        // Check if the key starts with the given prefix, ignoring case
        if (key.toLowerCase().startsWith(bufferSpeciesSelected.toLowerCase())) {
          // If it matches, add its compounds to the results
          value.compounds.forEach((compound) => {
            if (this.acidCompounds.includes(compound)) {
              acids.add(compound);
            } else if (this.basicCompounds.includes(compound)) {
              bases.add(compound);
            }
          });
        }
      }

      this.selectedAcidCompounds = Array.from(acids);
      this.selectedBasicCompounds = Array.from(bases);

      this.buffer_label = bufferSpeciesSelected.split('-')[0] + ' Conc.';
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the solutionSubscription
    //what else do we need to unsubscribe from?

    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }

  ////Function to initialize the form
  initializeForm() {
    try {
      this.formSubmitted = false;
      this.bufferForm = this.formBuilder.group(
        {
          bufferSpeciesControl: [''],
          acidicCompound: ['Sodium Phosphate Monobasic', Validators.required],
          basicCompound: ['Sodium Phosphate Dibasic', Validators.required],
          saltCompound: 'Sodium Chloride',
          totalConcentration: [
            0.04,
            [Validators.required, Validators.min(0), Validators.max(0.5)],
          ],
          target_pH: [
            7.0,
            [Validators.required, Validators.min(3), Validators.max(10)],
          ],
          saltConcentration: [0.1, [Validators.min(0), Validators.max(0.5)]],
        },
        { validators: this.bufferSelectionValidator() }
      );
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  }
  ////Function to handle form submission
  onSubmit() {
    this.formSubmitted = true;

    if (this.bufferForm.invalid) {
      // Show error message to the user
      this.errorMessage = 'Please correct the errors in the form';
      return;
    }

    try {
      this.userInputSolution = new Solution('User Input Solution');

      const acidicCompoundName = this.bufferForm.get('acidicCompound').value;
      const basicCompoundName = this.bufferForm.get('basicCompound').value;
      const saltCompoundName = this.bufferForm.get('saltCompound').value;
      const totalConcentration =
        this.bufferForm.get('totalConcentration').value;
      const target_pH = this.bufferForm.get('target_pH').value;
      const saltCompoundConcentration =
        this.bufferForm.get('saltConcentration').value;

      // Create Solution object
      this.userInputSolution.name = 'God';
      this.userInputSolution.target_buffer_concentration = totalConcentration;
      this.userInputSolution.compound_concentrations[acidicCompoundName] = 0;
      this.userInputSolution.compound_concentrations[basicCompoundName] = 0;
      if (saltCompoundName != 'None') {
        this.userInputSolution.compound_concentrations[saltCompoundName] =
          saltCompoundConcentration;
      }

      this.userInputSolution.pH = target_pH;
      this.userInputSolution.buffer_species = this.bufferForm.get(
        'bufferSpeciesControl'
      ).value;

      this.calculatepH();
      this.bufferForm.markAsUntouched();
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  }

  ////API call to calculate pH
  calculatepH() {
    // Start loading state
    this.isLoading = true;

    this.solutionService
      .solution_calculate_total_Conc_target_pH(this.userInputSolution)
      .subscribe(
        (response: Solution) => {
          // Check if response is of type Solution
          if (response && typeof response === 'object') {
            // Update the returnedSolution property with the response
            this.returnedSolution = response;
          } else {
            // Handle unexpected response structure
            console.error('Unexpected response structure');
          }
        },
        (error) => {
          // Handle error
          console.error('An error occurred:', error);
        },
        () => {
          // End loading state
          this.isLoading = false;
        }
      );
  }
}
