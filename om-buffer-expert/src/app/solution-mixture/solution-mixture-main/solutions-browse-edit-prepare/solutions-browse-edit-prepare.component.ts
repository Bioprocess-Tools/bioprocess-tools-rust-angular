import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { SolutionMixtureService } from '../../../solution-mixture.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Solution } from 'src/app/shared/models/solution.model';
import { Step } from 'src/app/shared/models/step.model';
import { SolutionMixture } from 'src/app/shared/models/solution_mixture.model';

@Component({
  selector: 'app-solutions-browse-edit-prepare',
  templateUrl: './solutions-browse-edit-prepare.component.html',
  styleUrls: ['./solutions-browse-edit-prepare.component.scss'],
})

//get the solutionslibrary from the service, and then process it.
//we need to get the names from the objects in the library and use the names to generate the autocomplete list.
export class SolutionsBrowseEditPrepareComponent implements OnInit,AfterViewInit {
  //get solutionmixture service
  @ViewChild('scrollRef') private solutionlistcontainer: ElementRef;
  
  solutions_selection_Control = new FormControl();
  bufferspecieswithSaltForm: FormGroup;
  bufferspecieswithoutSaltForm: FormGroup;
  stockSolutionForm: FormGroup;
  stockSolutionsSelected = false;
  filteredSolutions: Observable<Solution[]>;
  solutionsLibrary: {
    [category: string]: { [subCategory: string]: Solution[] };
  };
  selectedCategory: string | null = null;
  selectedSubCategory: string | null = null; // For "withSalt" and "withoutSalt"
  categories = ['dual', 'single', 'single-strong', 'stock']; // Your main categories
  categoryDisplayNames = {
    'dual': 'Dual Species',
    'single': 'Single Buffer Species',
    'single-strong': 'Single w/ Base',
    'stock': 'Stock Solutions',
  };
  solution_mixture_steps: Step[] = []; // Array of Step instances - we will use this to capture the solutions that the user chooses with Make Solution steps
  solution_mixture_result_object: SolutionMixture; // We will use this to capture the returned result from the API call
  isBufferwithSaltSolution = false;
  isBufferwithoutSaltSolution = false;
  isStockSolution = false;
  make_solutions_steps = [];

  constructor(
    private solutionMixtureService: SolutionMixtureService,
    private fb: FormBuilder
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

    this.initForms();
  }



ngAfterViewInit(): void {
    //this.scrollToLastItem();
}

scrollToLastItem() {
  const scrollElement = this.solutionlistcontainer.nativeElement;
  // Option 1: Instant scroll
  scrollElement.scrollLeft = scrollElement.scrollWidth;

  // Option 2: Smooth scroll (if you prefer a smooth scrolling effect)
  scrollElement.scrollTo({
    left: scrollElement.scrollWidth,
    behavior: 'smooth'
  });
}




  ngOnInit() {
    this.solutions_selection_Control = new FormControl();
    this.solutionsLibrary = this.solutionMixtureService.solutionsLibrary;
    this.filteredSolutions = this.solutions_selection_Control.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value.toLowerCase() : '')),
      map((value) => this.filterSolutions(value)) // Fixed the method name
    );
  }

  initForms() {
    this.bufferspecieswithSaltForm = this.fb.group({
      buffer_species: ['', Validators.required],
      target_conc: ['', Validators.required],
      target_pH: ['', Validators.required],
      salt_compound_name: ['', Validators.required],
      salt_conc: ['', Validators.required],
    });

    this.bufferspecieswithoutSaltForm = this.fb.group({
      buffer_species: ['', Validators.required],
      target_conc: ['', Validators.required],
      target_pH: ['', Validators.required],
    });

    this.stockSolutionForm = this.fb.group({
      compound_name: ['', Validators.required],
      compound_conc: ['', Validators.required],
    });
  }

  //solutionsNames = Object.keys(this.solutionsLibrary);
  //console.log(this.solutionsNames);
  //console.log(this

  onChipSelection(category: string, selected: boolean) {
    if (category === 'Stock Solutions') {
      this.stockSolutionsSelected = true;

    }
    else {
      this.stockSolutionsSelected = false;
    }
    // Rest of your method here
  }
  filterSolutions(value: string): Solution[] {
    let valueString = typeof value === 'string' ? value : '';

    let filteredSolutions: Solution[] = [];

    if (this.selectedCategory && this.selectedSubCategory) {
      filteredSolutions =
        this.solutionsLibrary[this.selectedCategory][this.selectedSubCategory];
    } else if (this.selectedCategory) {
      // Combine both subcategories if only a main category is selected
      const withSalt =
        this.solutionsLibrary[this.selectedCategory]['withSalt'] || [];
      const withoutSalt =
        this.solutionsLibrary[this.selectedCategory]['withoutSalt'] || [];
      filteredSolutions = [...withSalt, ...withoutSalt];
    } else {
      // If no category is selected, consider all solutions (optional based on UI logic)
      for (const category in this.solutionsLibrary) {
        for (const subCategory in this.solutionsLibrary[category]) {
          filteredSolutions = [
            ...filteredSolutions,
            ...this.solutionsLibrary[category][subCategory],
          ];
        }
      }
    }

    // Now filter based on the input value
    return filteredSolutions.filter(
      (solution) =>
        solution.name &&
        solution.name
          .toLowerCase()
          .includes(valueString ? valueString.toLowerCase() : '')
    );
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.selectedSubCategory = null; // Reset subCategory selection
    this.solutions_selection_Control.setValue('');
  }

  selectSubCategory(subCategory: string | null) {
    this.selectedSubCategory = subCategory;
    this.solutions_selection_Control.setValue('');
  }

  onSolutionSelected(solution: Solution) {
    // Populate the form based on the type of solution
    this.isBufferwithSaltSolution = false;
    this.isBufferwithoutSaltSolution = false;
    this.isStockSolution = false;
    
    if (solution.solution_type === 'stock') {
      this.isStockSolution = true;
      this.stockSolutionForm.patchValue({
        compound_name: solution.getFirstCompoundName(),
        compound_conc: solution.getFirstCompoundConcentration().toFixed(3), // Assuming structure; adjust as needed
      });
      this.stockSolutionForm.get('compound_name').disable(); // Disable the compound name field
    } else {
      // Assuming 'single' or 'dual' types for buffer solutions
      if (solution.salt_compound == null) {
        this.isBufferwithoutSaltSolution = true;
        this.bufferspecieswithoutSaltForm.patchValue({
          buffer_species: solution.buffer_species,
          target_conc: solution.target_buffer_concentration.toFixed(3),
          target_pH: solution.pH.toFixed(3),
        });
        this.bufferspecieswithoutSaltForm.get('buffer_species').disable(); // Disable the buffer_species field
      } else {
        // Adjust condition as needed based on your data structure
        this.isBufferwithSaltSolution = true;
        this.bufferspecieswithSaltForm.patchValue({
          buffer_species: solution.buffer_species,
          target_conc: solution.target_buffer_concentration.toFixed(3),
          target_pH: solution.pH.toFixed(3),
          salt_compound_name: solution.salt_compound?.name,
          salt_conc:
            solution.compound_concentrations[solution.salt_compound?.name].toFixed(3),
        });
        this.bufferspecieswithSaltForm.get('buffer_species').disable(); // Disable the buffer_species field
        this.bufferspecieswithSaltForm.get('salt_compound_name').disable(); // Disable the salt_compound_name field
      }
    }
    this.solutions_selection_Control.setValue('');
  } // Clear the autocomplete input

  displayFn(solution: Solution): string {
    return solution && solution.name ? solution.name : '';
  }

  onSubmitBufferwithSalt() {
    console.log(this.bufferspecieswithSaltForm.value);
    this.isBufferwithSaltSolution = false;
    this.isBufferwithoutSaltSolution = false;
    this.isStockSolution = false;
    // first we need to form it into a step object
    // in the step object, there is the operations_method and parameters
    // the operations method is different for solution with salt and without salt and stock solution
    // the parameters are the values in the form
    // we will make a
    let id;
    if (this.solution_mixture_steps === null) {
      id = 1;
    } else {
      id = this.solution_mixture_steps.length + 1;
    }
    const operations_method = 'Make Solution with Buffer Species with salt to Target Concentration and pH';
    const parameters = {
      buffer_species: this.bufferspecieswithSaltForm.getRawValue().buffer_species,
      target_conc: parseFloat(this.bufferspecieswithSaltForm.value.target_conc),
      target_pH: parseFloat(this.bufferspecieswithSaltForm.value.target_pH),
      salt_compound_name:
        this.bufferspecieswithSaltForm.getRawValue().salt_compound_name,
      salt_conc: parseFloat(this.bufferspecieswithSaltForm.value.salt_conc),
    };

    this.solution_mixture_steps.push(
      new Step(id, operations_method, parameters)
    );

    console.log(this.solution_mixture_steps);
    this.submitSteps(this.solution_mixture_steps);
  }

   onSubmitBufferwithoutSalt() {
    this.isBufferwithSaltSolution = false;
    this.isBufferwithoutSaltSolution = false;
    this.isStockSolution = false;
  //   console.log(this.bufferspecieswithoutSaltForm.value);
    let id;
    if (this.solution_mixture_steps === null) {
      id = 1;
    } else {
      id = this.solution_mixture_steps.length + 1;
    }
    const operations_method = 'Make Solution with Buffer Species to Target Concentration and pH';
    const parameters = {
      buffer_species: this.bufferspecieswithoutSaltForm.getRawValue().buffer_species,
      target_conc: parseFloat(this.bufferspecieswithoutSaltForm.value.target_conc),
      target_pH: parseFloat(this.bufferspecieswithoutSaltForm.value.target_pH),
    };

    this.solution_mixture_steps.push(
      new Step(id, operations_method, parameters)
    );

    console.log(this.solution_mixture_steps);
    this.submitSteps(this.solution_mixture_steps);

}

 onSubmitStockSolution() {
  this.isBufferwithSaltSolution = false;
  this.isBufferwithoutSaltSolution = false;
  this.isStockSolution = false;
    console.log(this.stockSolutionForm.value);
    let id;
    if (this.solution_mixture_steps === null) {
      id = 1;
    } else {
      id = this.solution_mixture_steps.length + 1;
    }
    const operations_method = 'Make Stock Solution';
    const parameters = {
      compound_name: this.stockSolutionForm.getRawValue().compound_name,
      compound_conc: parseFloat(this.stockSolutionForm.value.compound_conc),
    };
    this.solution_mixture_steps.push(
      new Step(id, operations_method, parameters)
    );
    console.log(this.solution_mixture_steps);
    this.submitSteps(this.solution_mixture_steps);
  }


  submitSteps(steps: any[]) {
    this.solutionMixtureService.postStepsAndGetSolutionMixture(steps);
    //this.scrollToLastItem();
  }

}
