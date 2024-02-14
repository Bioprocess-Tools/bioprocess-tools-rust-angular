import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap,shareReplay, share } from 'rxjs/operators';
import { Solution } from './shared/models/solution.model';
import { Compound } from './shared/models/compound.model';
import { environment } from 'src/environments/environment';


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

  constructor(private http: HttpClient) {this.getBufferSpeciesProcessed().subscribe(); this.getCompoundsProcessed().subscribe(); this.getSolutionsLibraryProcessed().subscribe();}
  getSolutionsLibraryProcessed(): Observable<any> {
    return this.http.get<{[key: string]: Solution}>(`${this.apiUrl}/get_all_solutions`).pipe(
      
      map(data => this.processSolutions(data))
    );
  }

  private processSolutions(solutions: {[key: string]: Solution}): any {
    const categorized = {
      'single': { withSalt: [], withoutSalt: [] },
      'single-strong': { withSalt: [], withoutSalt: [] },
      'dual': { withSalt: [], withoutSalt: [] },
      'stock': []
    };
     console.log(solutions);
     for (let key in solutions) {
      let solution = solutions[key];
      if (solution.solution_type in categorized) {
        if ('withSalt' in categorized[solution.solution_type] && solution.salt_compound !== null) {
          categorized[solution.solution_type].withSalt.push(solution);
        } else if ('withoutSalt' in categorized[solution.solution_type] && solution.salt_compound === null) {
          categorized[solution.solution_type].withoutSalt.push(solution);
        } else if (solution.solution_type === 'stock') {
          categorized['stock'].push(solution);
        }
      }
    }
    console.log(categorized);
    return categorized;
  }

  getBufferSpeciesProcessed(): Observable<any> {
    return this.http.get<{[key: string]: any}>(`${this.apiUrl}/get_buffer_species_compound_list_map`).pipe(
      map(data => this.processBufferSpecies(data)),shareReplay(1)
    );
  }

getCompoundsProcessed(): Observable<any> {
  return this.http.get<{[key: string]: any}>(`${this.apiUrl}/compound-fun-dict`).pipe(


    map(data => this.processCompounds(data)),shareReplay(1)
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
    console.log(compounds);
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

  initData() {
    return (): Promise<any> => {
      return new Promise((resolve, reject) => {
        this.getSolutionsLibraryProcessed().subscribe({
          next: (data) => resolve(data),
          error: (error) => reject(error)
        });
      });
    };


}
}