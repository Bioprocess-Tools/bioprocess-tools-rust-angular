import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class SolutionsBrowseEditPrepareComponent
  implements OnInit, AfterViewInit
{
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
  message: string = '';
  isDuplicate: boolean = false;
  selectedCategory: string | null = null;
  selectedSubCategory: string | null = null; // For "withSalt" and "withoutSalt"
  categories = ['dual', 'single', 'single-strong', 'stock']; // Your main categories
  categoryDisplayNames = {
    dual: 'Dual Species',
    single: 'Single Buffer Species',
    'single-strong': 'Single w/ Base',
    stock: 'Stock Solutions',
  };
  solution_mixture_steps: Step[] = []; // Array of Step instances - we will use this to capture the solutions that the user chooses with Make Solution steps
  solution_mixture_result_object: SolutionMixture; // We will use this to capture the returned result from the API call
  solutions: Solution[] = [];
  isBufferwithSaltSolution = false;
  isBufferwithoutSaltSolution = false;
  isStockSolution = false;
  make_solutions_steps = [];
  actionType: string = 'Add Solution';
  updateIndex: number = -1;
  selectedStepIndex: number | null = null; //stores the selected step index
  filteredsteps: Step[] = [];
  constructor(
    private solutionMixtureService: SolutionMixtureService,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngAfterViewInit(): void {
    //this.scrollToLastItem(); TODO
  }

  scrollToLastItem() {
    const scrollElement = this.solutionlistcontainer.nativeElement;
    // Option 1: Instant scroll
    scrollElement.scrollLeft = scrollElement.scrollWidth;

    // Option 2: Smooth scroll (if you prefer a smooth scrolling effect)
    scrollElement.scrollTo({
      left: scrollElement.scrollWidth,
      behavior: 'smooth',
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
    this.solutionMixtureService.Steps$.subscribe((steps) => {
      this.solution_mixture_steps = steps;

      console.log("God -browse-edit-prepare", this.solution_mixture_steps);
    });

    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
      (solutionMixture) => {
        if (solutionMixture) {
          console.log("God - solutionMixture", solutionMixture)
          this.solution_mixture_result_object = solutionMixture;
          // do something with solutionMixture
          this.solutions = solutionMixture.solutions;
          for(let [index, solution] of solutionMixture.solutions.entries()){
            this.solution_mixture_steps[index].associated_solution = solution.name;
            this.solution_mixture_steps[index].category = "Make";
            console.log("God - solutionMixture - steps", this.solution_mixture_steps)
          }
        }
      }
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

  onChipSelection(category: string, selected: boolean) {
    if (category === 'Stock Solutions') {
      this.stockSolutionsSelected = true;
    } else {
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
    this.actionType = 'Add Solution';
    this.updateIndex = -1;
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
            solution.compound_concentrations[
              solution.salt_compound?.name
            ].toFixed(3),
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
    this.isDuplicate = false;
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
    const operations_method =
      'Make Solution with Buffer Species with salt to Target Concentration and pH';
    const parameters = {
      buffer_species:
        this.bufferspecieswithSaltForm.getRawValue().buffer_species,
      target_conc: parseFloat(this.bufferspecieswithSaltForm.value.target_conc),
      target_pH: parseFloat(this.bufferspecieswithSaltForm.value.target_pH),
      salt_compound_name:
        this.bufferspecieswithSaltForm.getRawValue().salt_compound_name,
      salt_conc: parseFloat(this.bufferspecieswithSaltForm.value.salt_conc),
    };

    let step_to_add = new Step(id, operations_method, parameters);
    this.isDuplicate = Step.isDuplicateStep(
      this.solution_mixture_steps,
      step_to_add
    );

    if (!this.isDuplicate) {
      if (this.updateIndex > -1) {
        this.removeSolution(this.updateIndex);
        this.updateIndex = -1;
        this.actionType = 'Add Solution';
      }
      this.solution_mixture_steps.push(step_to_add);
      this.solution_mixture_steps[this.solution_mixture_steps.length - 1].category="Make";
      this.selectedStepIndex= this.solution_mixture_steps.length - 1;
      console.log("God - ready to post", this.solution_mixture_steps)
      this.triggerStepPOST();
      this.message = '';
    } else {
      console.log("God - duplicate", this.solution_mixture_steps)
      this.message = 'You have already added this solution';
    }

  }

  triggerStepPOST() {
    this.solutionMixtureService.postStepswithTrigger([]);
  }
  onSubmitBufferwithoutSalt() {
    this.isDuplicate = false;
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
    const operations_method =
      'Make Solution with Buffer Species to Target Concentration and pH';
    const parameters = {
      buffer_species:
        this.bufferspecieswithoutSaltForm.getRawValue().buffer_species,
      target_conc: parseFloat(
        this.bufferspecieswithoutSaltForm.value.target_conc
      ),
      target_pH: parseFloat(this.bufferspecieswithoutSaltForm.value.target_pH),
    };

    let step_to_add = new Step(id, operations_method, parameters);
    this.isDuplicate = Step.isDuplicateStep(
      this.solution_mixture_steps,
      step_to_add
    );

    if (!this.isDuplicate) {
      if (this.updateIndex > -1) {
        this.removeSolution(this.updateIndex);
        this.updateIndex = -1;
        this.actionType = 'Add Solution';
      }
      this.solution_mixture_steps.push(step_to_add);
      this.solution_mixture_steps[this.solution_mixture_steps.length - 1].category="Make";
      this.selectedStepIndex= this.solution_mixture_steps.length - 1;
      console.log("God - ready to post", this.solution_mixture_steps);
      this.triggerStepPOST();
      this.message = '';
    } else {
      this.message = 'You have already added this solution';
    }
  }

  onSubmitStockSolution() {
    this.isDuplicate = false;
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
    
    let step_to_add = new Step(id, operations_method, parameters);
    this.isDuplicate = Step.isDuplicateStep(
      this.solution_mixture_steps,
      step_to_add
    );

    if (!this.isDuplicate) {
      if (this.updateIndex > -1) {

        this.removeSolution(this.updateIndex);
        this.updateIndex = -1;
        this.actionType = 'Add Solution';
      }
      
    
      this.solution_mixture_steps.push(step_to_add);
      this.solution_mixture_steps[this.solution_mixture_steps.length - 1].category="Make";
      this.selectedStepIndex= this.solution_mixture_steps.length - 1;
      this.triggerStepPOST();
      this.message = '';
    } else {
      this.message = 'You have already added this solution';
    }
}

onSelectItem(i: number) {
  this.selectedStepIndex = i;
 // this.EditSolution(i);
}

getSolutionbyName(name: string) {
  let assoc_solution: Solution= null
  this.solutions.forEach((solution) => {
    if (solution.name === name) {
      assoc_solution = solution;
    }
  });
  return assoc_solution;
}

removeSolution(i: number) {
  if (this.solution_mixture_steps !== null) {
    let isInvalidSteps = Step.evaluateEffectOfRemovingSolution(this.solution_mixture_result_object, 
      this.solution_mixture_steps[i], this.solution_mixture_steps);
    if (isInvalidSteps.length > 0) {
      console.log("God - invalid steps", isInvalidSteps)
    } else {
      console.log("God - no invalid steps")
    }
  }
    this.solution_mixture_steps.splice(i, 1);

    this.triggerStepPOST();
    if (this.solution_mixture_steps.length > 0) {
      this.selectedStepIndex = this.solution_mixture_steps.length-1;
     // this.EditSolution(this.solution_mixture_steps.length-1);
    }
  }

  EditSolution(i:number) {
    
    this.isDuplicate = false;
    this.isBufferwithSaltSolution = false;
    this.isBufferwithoutSaltSolution = false;
    this.isStockSolution = false;
    if (this.solution_mixture_steps[i].operation_method === 
      'Make Solution with Buffer Species with salt to Target Concentration and pH') {
      this.isBufferwithSaltSolution = true;
      this.bufferspecieswithSaltForm.patchValue({
        buffer_species: this.solution_mixture_steps[i].parameters['buffer_species'],
        target_conc: this.solution_mixture_steps[i].parameters['target_conc'],
        target_pH: this.solution_mixture_steps[i].parameters['target_pH'],
        salt_compound_name: this.solution_mixture_steps[i].parameters['salt_compound_name'],
        salt_conc: this.solution_mixture_steps[i].parameters['salt_conc'],
      });}
      else if (this.solution_mixture_steps[i].operation_method ===
         'Make Solution with Buffer Species to Target Concentration and pH') {
        this.isBufferwithoutSaltSolution = true;
        this.bufferspecieswithoutSaltForm.patchValue({
          buffer_species: this.solution_mixture_steps[i].parameters['buffer_species'],
          target_conc: this.solution_mixture_steps[i].parameters['target_conc'],
          target_pH: this.solution_mixture_steps[i].parameters['target_pH'],
        });
      } else if (this.solution_mixture_steps[i].operation_method === 'Make Stock Solution') { 
        this.isStockSolution = true;
        this.stockSolutionForm.patchValue({
          compound_name: this.solution_mixture_steps[i].parameters['compound_name'],
          compound_conc: this.solution_mixture_steps[i].parameters['compound_conc'],
        });
      }
      this.actionType = 'Update Solution';
      this.updateIndex = i;
}
}
