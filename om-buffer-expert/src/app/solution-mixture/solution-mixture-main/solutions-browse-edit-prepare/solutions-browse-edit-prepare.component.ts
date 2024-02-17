import { Component } from '@angular/core';
import { SolutionMixtureService } from '../../../solution-mixture.service';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Solution } from 'src/app/shared/models/solution.model';




@Component({
  selector: 'app-solutions-browse-edit-prepare',
  templateUrl: './solutions-browse-edit-prepare.component.html',
  styleUrls: ['./solutions-browse-edit-prepare.component.scss']
})


//get the solutionslibrary from the service, and then process it.
//we need to get the names from the objects in the library and use the names to generate the autocomplete list.
export class SolutionsBrowseEditPrepareComponent {
 //get solutionmixture service
  solutionsControl = new FormControl();

  
  solutionForm: FormGroup;
  filteredSolutions: Observable<Solution[]>;
  solutionsLibrary: {[category: string]: {[subCategory: string]: Solution[]}}; 
  selectedCategory: string | null = null;
  selectedSubCategory: string | null = null; // For "withSalt" and "withoutSalt"
  categories = ['dual', 'single', 'single-strong', 'stock']; // Your main categories
  isBufferSolution = false;
  isStockSolution = false;
  make_solutions_steps = [];

  constructor(
    private solutionMixtureService: SolutionMixtureService, private fb: FormBuilder
  ) { 
  //   this.solutionForm = this.fb.group({
  //   buffer_species: ['', Validators.required], // Makes the buffer_species field required
  //   target_conc: ['', [Validators.required, Validators.min(0.005), Validators.max(.7)]], // Example: Requires target_conc, must be between 0.01 and 10
  //   target_pH: ['', [Validators.required, Validators.min(0), Validators.max(14)]], // pH must be between 0 and 14
  //   salt_compound_name: [''], // No validators for optional fields
  //   salt_conc: ['', Validators.min(0),Validators.max(0.7)], // Must be non-negative, but optional
  //   compound_name: ['', Validators.required], // Required for stock solutions
  //   compound_conc: ['', [Validators.required, Validators.min(0.005),Validators.max(0.7)]], // Required, must be positive
  // });

  this.solutionForm = this.fb.group({
    buffer_species: [''], // Makes the buffer_species field required
    target_conc: [''], // Example: Requires target_conc, must be between 0.01 and 10
    target_pH: [''], // pH must be between 0 and 14
    salt_compound_name: [''], // No validators for optional fields
    salt_conc: [''], // Must be non-negative, but optional
    compound_name: [''], // Required for stock solutions
    compound_conc: [''], // Required, must be positive
  });






}
  ngOnInit() {
    this.solutionsControl = new FormControl('', {updateOn: 'blur'});
    this.solutionsLibrary = this.solutionMixtureService.solutionsLibrary;
    this.filteredSolutions = this.solutionsControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.filterSolutions(value)) // Fixed the method name
    );

  }




  //solutionsNames = Object.keys(this.solutionsLibrary);
  //console.log(this.solutionsNames);
  //console.log(this

  filterSolutions(value: Solution): Solution[] {
    
    let filteredSolutions: Solution[] = [];

    if (this.selectedCategory && this.selectedSubCategory) {
      filteredSolutions = this.solutionsLibrary[this.selectedCategory][this.selectedSubCategory];
    } else if (this.selectedCategory) {
      // Combine both subcategories if only a main category is selected
      const withSalt = this.solutionsLibrary[this.selectedCategory]['withSalt'] || [];
      const withoutSalt = this.solutionsLibrary[this.selectedCategory]['withoutSalt'] || [];
      filteredSolutions = [...withSalt, ...withoutSalt];
    } else {
      // If no category is selected, consider all solutions (optional based on UI logic)
    }

    // Now filter based on the input value
    return filteredSolutions.filter(solution => solution.name && solution.name.toLowerCase().includes(value ? value.name.toLowerCase():''));
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.selectedSubCategory = null; // Reset subCategory selection
    this.solutionsControl.setValue('');
  }

  selectSubCategory(subCategory: string | null) {
    this.selectedSubCategory = subCategory;
    this.solutionsControl.setValue('');
  }

  onSolutionSelected(solution: Solution) {

    this.solutionForm.reset();
    this.isBufferSolution = false;
    this.isStockSolution = false;

    // Populate the form based on the type of solution
    if (solution.solution_type === 'stock') {
      this.isStockSolution = true;
      this.solutionForm.patchValue({
        compound_name: solution.name,
        compound_conc: solution.compound_concentrations[solution.name] // Assuming structure; adjust as needed
      });
    } else { // Assuming 'single' or 'dual' types for buffer solutions
      this.isBufferSolution = true;
      this.solutionForm.patchValue({
        buffer_species: solution.buffer_species,
        target_conc: solution.target_buffer_concentration,
        target_pH: solution.pH,
      });

      if (solution.solution_type.includes('withSalt')) { // Adjust condition as needed based on your data structure
        this.solutionForm.patchValue({
          salt_compound_name: solution.salt_compound?.name,
          salt_conc: solution.compound_concentrations[solution.salt_compound?.name]
        });
      }
    }
  // Assume this method sets up form based on the selected solution as before
  // After setting up, apply conditional validators
  // if (solution.solution_type.includes('withSalt')) {
  //   this.solutionForm.get('salt_compound_name').setValidators([Validators.required]);
  //   this.solutionForm.get('salt_conc').setValidators([Validators.required, Validators.min(0)]);
  // } else {
  //   // For solutions without salt, clear validators or set as appropriate
  //   this.solutionForm.get('salt_compound_name').clearValidators();
  //   this.solutionForm.get('salt_conc').clearValidators();
  // }

  // // Important: After changing validators, you must call updateValueAndValidity()
  // this.solutionForm.get('salt_compound_name').updateValueAndValidity();
  // this.solutionForm.get('salt_conc').updateValueAndValidity();
  }
  displayFn(solution: Solution): string {
    return solution && solution.name ? solution.name : '';
  }

  determineOperationMethod(): string {
    if (this.isStockSolution) {
      return "Make Stock Solution";
    } else if (this.solutionForm.value.salt_compound_name) {
      return "Make Solution with Buffer Species with salt to Target Concentration and pH";
    } else {
      return "Make Solution with Buffer Species to Target Concentration and pH";
    }
  }

  onSubmit() {
    const step = {
      operation_method: this.determineOperationMethod(),
      parameters: this.solutionForm.getRawValue() // Use getRawValue() to include all controls, even disabled ones
    };
    this.make_solutions_steps.push(step);
    console.log(this.make_solutions_steps); // For demonstration
    //this.solutionForm.reset();
    // Reset flags
    this.isBufferSolution = false;
    this.isStockSolution = false;
    const formValue = this.solutionForm.value;
    let submissionObject = {
      operation_method: formValue.operation_method, // This would be set somewhere in your form, perhaps as a hidden field or determined by another part of your UI.
      parameters: {}
    };
  console.log(this.solutionForm.value);
    // Dynamically add relevant parameters based on operation method and form values
    if (submissionObject.operation_method.includes("Stock")) {
      submissionObject.parameters = {
        compound_name: formValue.compound_name,
        compound_conc: formValue.compound_conc
      };
    } else { // Handle buffer species cases
      submissionObject.parameters = {
        buffer_species: formValue.buffer_species,
        target_conc: formValue.target_conc,
        target_pH: formValue.target_pH,
        // Conditionally add salt parameters if present
        ...(formValue.salt_compound_name && { salt_compound_name: formValue.salt_compound_name }),
        ...(formValue.salt_conc && { salt_conc: formValue.salt_conc })
      };
    }
  
    // Proceed with submission logic (e.g., API call)
    console.log(submissionObject);
  }
  

}
