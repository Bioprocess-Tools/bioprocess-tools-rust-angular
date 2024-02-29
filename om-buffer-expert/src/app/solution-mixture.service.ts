import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, tap,shareReplay, share } from 'rxjs/operators';
import { Solution } from './shared/models/solution.model';
import { Compound } from './shared/models/compound.model';
import { environment } from 'src/environments/environment';
import { SolutionMixture } from './shared/models/solution_mixture.model';
import { Step } from './shared/models/step.model';


//1. solutions_library a dictionary which contains a solution name and the solution object, 
//which contains all the solutions with solution_type "single, single-strong, dual, stock.  
//these are of the type "Solution" (already created ts model for it).  
//dictionary of buffer_species (both single and dual, and single-strong) 
//and the compounds associated with it, a dictionary of compounds and its type (A, B, S).  
// We need to process each of these by category after we get it.
@Injectable({
  providedIn: 'root'
})
export class SolutionMixtureService {
  private apiUrl = environment.apiUrl;
  solutionsLibrary: {[category: string]: {[subCategory: string]: Solution[]}} = {};
  bufferSpecies: {[key: string]: any} = {};
  compounds: {[key: string]: any} = {};
  solutionMixtureSolutionsReviewSubject = new BehaviorSubject<SolutionMixture>(null);  
  solutionMixtureSolutionsReview$ = this.solutionMixtureSolutionsReviewSubject.asObservable();  
  StepsSubject = new BehaviorSubject<Step[]>([]);
  Steps$ = this.StepsSubject.asObservable();

  constructor(private http: HttpClient) {
    
    
   }



   getSolutionsLibraryProcessed(): Observable<any> {
    return this.http.get<{[key: string]: any}>(`${this.apiUrl}/get_all_solutions`).pipe(
      map(data => {
        const solutions: {[key: string]: Solution} = {};
        for (const key in data) {
          solutions[key] = Object.assign(new Solution(""), data[key]);
        }
        return this.processSolutions(solutions);
      }),
      
    );
  }

  private processSolutions(solutions: {[key: string]: Solution}): any {
    const categorized = {
      'single': { withSalt: [], withoutSalt: [] },
      'single-strong': { withSalt: [], withoutSalt: [] },
      'dual': { withSalt: [], withoutSalt: [] },
      'stock': { withSalt: [], withoutSalt: [] }
    };
     //console.log(solutions);
     for (let key in solutions) {
      let solution = solutions[key];
      if (solution.solution_type in categorized) {
        if ('withSalt' in categorized[solution.solution_type] && solution.salt_compound !== null) {
          categorized[solution.solution_type].withSalt.push(solution);
        } else if ('withoutSalt' in categorized[solution.solution_type] && solution.salt_compound === null) {
          categorized[solution.solution_type].withoutSalt.push(solution);
        } else if (solution.solution_type === 'stock') {
          categorized['stock'].withoutSalt.push(solution);
          console.log(categorized);
        }
      }
    }
    console.log(categorized);
    return categorized;
  }

  getBufferSpeciesProcessed(): Observable<any> {
    return this.http.get<{[key: string]: any}>(`${this.apiUrl}/get_buffer_species_compound_list_map`).pipe(
      map(data => this.processBufferSpecies(data))
    );
  }

getCompoundsProcessed(): Observable<any> {
  return this.http.get<{[key: string]: any}>(`${this.apiUrl}/compound-fun-dict`).pipe(


    map(data => this.processCompounds(data))
  ); // replace with your actual endpoint
}

  processBufferSpecies(bufferSpecies: {[key: string]: any}): any {
    const processed = {};

    for (let name in bufferSpecies) {
      let compounds = bufferSpecies[name];
      let nameParts = name.split('-');

      if (nameParts.length === 1) {
        processed[name] = { type: 'single', compounds: compounds };
      } else if (nameParts.length > 1) {
        if (nameParts[1] === 'NaOH') {
          processed[name] = { type: 'single-strong', compounds: compounds };
        } else {
          processed[name] = { type: 'dual', compounds: compounds };
        }
      }
    }

    console.log(processed);
    return processed;
  }



  processCompounds(compounds: {[key: string]: any}): any {
    //console.log(compounds);
    const processed = { A: [], B: [], S: [] };

    for (let name in compounds) {
      let compoundType = compounds[name];
  
      if (['A', 'B', 'S', 'N'].includes(compoundType)) {
        processed[compoundType].push(name);
      }
    }

    console.log(processed);
    return processed;
  }

// create a http request to post the steps to the backend and receive a solution-mixture object. this object will be used by the browse-edit component
// to display the solutions in the mixture
// solution_mixture object will be a single object
// postStepsAndGetSolutionMixture(steps: any[]) {
 


//   this.http.post<SolutionMixture>(`${this.apiUrl}/execute_steps_solution_mixture`, { steps })
//   .subscribe({
//   next: (solutionMixture) => {
//   this.solutionMixtureSolutionsReviewSubject.next(solutionMixture);
// },
// error: (error) => console.error(error)
// });
// }

postStepswithTrigger(addedSteps: Step[]) {
  let steps = this.StepsSubject.value;
  steps.push(...addedSteps);
  this.StepsSubject.next(steps);
  
  this.http.post<SolutionMixture>(`${this.apiUrl}/execute_steps_solution_mixture`, { steps: this.StepsSubject.value })
  .subscribe({
    next: (solutionMixture) => {
    this.solutionMixtureSolutionsReviewSubject.next(solutionMixture);
  },
  error: (error) => console.error(error)
  });
  
}

postSingle() {
  let steps = this.StepsSubject.value;
  this.StepsSubject.next(steps);
  
  this.http.post<SolutionMixture>(`${this.apiUrl}/execute_steps_solution_mixture`, { steps: this.StepsSubject.value })
  .subscribe({
    next: (solutionMixture) => {
    this.solutionMixtureSolutionsReviewSubject.next(solutionMixture);
  },
  error: (error) => console.error(error)
  });
  
}





      initData() {
        return (): Promise<any> => {
      return new Promise((resolve, reject) => {
        forkJoin({
          solutionsLibrary: this.getSolutionsLibraryProcessed(),
          compounds: this.getCompoundsProcessed(),
          bufferSpecies: this.getBufferSpeciesProcessed()
        }).subscribe({
          next: (data) => {
            this.solutionsLibrary = data.solutionsLibrary;
            this.compounds = data.compounds; // Assuming data.compounds is already processed
            this.bufferSpecies = data.bufferSpecies; // Assuming data.bufferS
            resolve(data);
          },
          error: (error) => reject(error)
        });
      });
    };
  }

}