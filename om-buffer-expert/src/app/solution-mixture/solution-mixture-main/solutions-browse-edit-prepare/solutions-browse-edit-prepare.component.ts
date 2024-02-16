import { Component } from '@angular/core';
import { SolutionMixtureService } from '../../../solution-mixture.service';
import { FormControl } from '@angular/forms';
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
  filteredSolutions: Observable<Solution[]>;
  solutionsLibrary: {[category: string]: {[subCategory: string]: Solution[]}}; 
  selectedCategory: string | null = null;
  selectedSubCategory: string | null = null; // For "withSalt" and "withoutSalt"
  categories = ['dual', 'single', 'single-strong', 'stock']; // Your main categories

  constructor(
    private solutionMixtureService: SolutionMixtureService
  ) { }
  ngOnInit() {
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

  filterSolutions(value: string): Solution[] {
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
    return filteredSolutions.filter(solution => solution.name.toLowerCase().includes(value.toLowerCase()));
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




}
