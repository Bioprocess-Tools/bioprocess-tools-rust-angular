import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  ValidatorFn,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { ApiService } from '../../api-service.service';
import { Solution } from '../../shared/models/solution.model';
import { SolutionService } from '../../solution.service';
import { SolutionMixtureService } from '../../solution-mixture.service';


import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-chatbufferom',
  templateUrl: './chatbufferom.component.html',
  styleUrls: ['./chatbufferom.component.scss'],
})
export class ChatbufferomComponent implements OnInit {
  form: FormGroup;
  ionControl: FormControl;
  response_solution: Solution;
  ion_names: string[] = [];
  ion_names_lower: string[] = [];
  // example_solution: Solution;
  buffer_species_names: string[] = [];
  filteredBufferSpecies: Observable<string[]>;
  buffer_species_pH: { [key: string]: any } = {};
  submitted = false;
  currentSolution: Solution;
  private exampleSolutionSubscription: Subscription;
 currentSolutionSubscription: Subscription;
  constructor(
    private apiService: ApiService,

    public solutionService: SolutionService,
    public solutionmixtureService: SolutionMixtureService
  ) {}

  ionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputwords = this.getWords(control.value);
      this.ion_names_lower = this.ion_names.map((word) => word.toLowerCase());
      const isValid = inputwords.some((word) =>
        this.ion_names_lower.includes(word)
      );
      return isValid ? null : { invalidIon: { value: control.value } };
    };
  }

  ngOnInit() {
    this.buffer_species_pH = this.solutionmixtureService.bufferSpeciespHMap;
    this.ion_names = Object.keys(
      this.solutionmixtureService.bufferSpeciespHMap
    );
    this.buffer_species_names = Object.keys(
      this.solutionmixtureService.bufferSpecies
    );

    this.form = new FormGroup({
      userInput: new FormControl(''),
      bufferSpeciesControl: new FormControl(''),
    });
    this.form.get('userInput').setValidators([this.ionValidator()]);
    this.form.get('userInput').updateValueAndValidity();

    this.filteredBufferSpecies = this.form.controls[
      'bufferSpeciesControl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

   this.currentSolutionSubscription = this.solutionService.currentSolution.subscribe({
     next: (solution) => {
       if (solution && solution.non_salt_compounds.length <= 2) {
         this.currentSolution = solution;
         this.response_solution = solution;

         this.populateForm(solution);

         this.form.updateValueAndValidity({
           onlySelf: false,
           emitEvent: true,
         });
       }
     },
   });
  }

  ngOnDestory() {
    if (this.exampleSolutionSubscription) {
      this.exampleSolutionSubscription.unsubscribe();
    }
  }

populateForm(solution: Solution) {
// if the solution.solution_type is 'single-species' or 'dual-species', then populate the form with the solution's name and populate the bufferspeciescontrol with buffer species name
if (solution.solution_type === 'Single-Species' || solution.solution_type === 'Dual-Species') {
  this.form.controls['userInput'].setValue(solution.name);
  this.form.controls['bufferSpeciesControl'].setValue(solution.buffer_species);}
  else {
    // if the solution.solution_type is 'mixture', then populate the form with the solution's name and populate the bufferspeciescontrol with the buffer species name
    this.form.controls['userInput'].setValue('');
    this.form.controls['bufferSpeciesControl'].setValue('');
    
  }
}


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    let results = this.buffer_species_names.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );

    if (filterValue !== '') {
      results.sort((a, b) => {
        // Move exact matches to the top
        if (a.toLowerCase() === filterValue) {
          return -1;
        }
        if (b.toLowerCase() === filterValue) {
          return 1;
        }
        // Move matches that start with the search term to the top
        if (a.toLowerCase().startsWith(filterValue)) {
          return -1;
        }
        if (b.toLowerCase().startsWith(filterValue)) {
          return 1;
        }
        // Otherwise, sort alphabetically
        return a.localeCompare(b);
      });
    }

    return results;
  }

  getWords(sentence: string): string[] {
    // The regular expression matches any word (sequence of letters) that is
    // surrounded by word boundaries. The 'g' flag means it will match all
    // occurrences, not just the first one.
    const lowerCaseSentence = sentence.toLowerCase();
    const regex = /\b[A-Za-z]+\b/g;

    // The match method returns an array of all matches.
    const matches = lowerCaseSentence.match(regex);
    return matches ? matches : [];
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.submitted = false;
    const selectedOption = event.option.value;
    let buffer_species_first = selectedOption.split('-')[0];

    if (this.buffer_species_pH.hasOwnProperty(buffer_species_first)) {
      let userInput = `50mM ${selectedOption} , 100mM Sodium Chloride, pH ${this.buffer_species_pH[buffer_species_first]}`;

      this.form.controls['userInput'].setValue(userInput);
      this.form.controls['bufferSpeciesControl'].setValue('');
    } else {
      // Handle the case where buffer_species_first is not in buffer_species_pH...
    }
  }
  onSubmit(form: FormGroup) {
    this.submitted = true;
    const userInput = this.form.value.userInput;
    const inputclean = this.getWords(userInput);
    const isValid = inputclean.some((word) =>
      this.ion_names_lower.includes(word)
    );

    if (!isValid) {
      // Handle invalid input...
    } else {
      this.apiService.sendUserInput(userInput.toLowerCase()).subscribe(
        (response) => {
          this.response_solution = new Solution('God');
          this.submitted = true;
          Object.assign(this.response_solution, response);
          this.solutionService.add_Solution(this.response_solution);
          this.solutionService.changeSolution(this.response_solution);
          this.form.controls['userInput'].setValue(this.response_solution.name);
          this.form.updateValueAndValidity({
            onlySelf: false,
            emitEvent: true,
          });
          this.form.markAsUntouched();
        },
        (error) => {
          // Handle error...
        }
      );
    }
  }
}
