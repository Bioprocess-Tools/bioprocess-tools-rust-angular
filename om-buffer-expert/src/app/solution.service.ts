import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { Solution } from './shared/models/solution.model';
import { Compound } from './shared/models/compound.model';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  omSolutions: Solution[] = [];

  compoundFunDict$: BehaviorSubject<{ [name: string]: string }> = new BehaviorSubject<{ [name: string]: string }>({});
  acidCompounds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  basicCompounds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  saltCompounds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  ion_names$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  example_solution$: BehaviorSubject<Solution> = new BehaviorSubject<Solution>(null);
  edit_solution$: BehaviorSubject<Solution> = new BehaviorSubject<Solution>(null);




  compoundNames: string[] = [];
  ion_names:string[]=[];
  compoundFunDict: { [name: string]: string } = {};
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;
  edit_solution:Solution;

  solutionAdded: EventEmitter<void> = new EventEmitter<void>();
  solutionEdited: EventEmitter<void> = new EventEmitter<void>();

 //private apiUrl = 'https://buffer-designer-service-zuynyusrbq-uc.a.run.app/api'; // Replace with your Flask API URL
  
  private apiUrl = 'http://127.0.0.1:5000/api'; // Replace with your Flask API URL

  constructor(private http: HttpClient) {
    this.fetchCompoundFunDict();
    console.log("God: in construction", this.acidCompounds);
    this.get_ion_names();
    this.get_example_solution();
  }
  // Implement the necessary methods to interact with the solution object
  // For example:
  get_compound_names(): Observable<string[]> {
    const endpoint = `${this.apiUrl}/get_compound_names`; 
    return this.http.get<string[]>(endpoint).pipe(

      map((response: string[])=> {
        this.compoundNames = response;
        console.log("God in service", this.compoundNames);
        return response;

      }),
  
    );

  }

  get_ion_names(): void {
    const endpoint = `${this.apiUrl}/get_ion_names`; 
    this.http.get<string[]>(endpoint).pipe(

      map((response: string[])=> {
        this.ion_names = response;
        this.ion_names$.next(this.ion_names);
        console.log("God in service", this.ion_names);
        

      }),
  
    ).subscribe();

  }

  get_example_solution(): void {
    const endpoint = `${this.apiUrl}/get_example_solution`; 
    this.http.get<Solution>(endpoint).subscribe(
      (response) => {
        this.example_solution = response;
        this.example_solution$.next(this.example_solution);
        console.log("God : example", this.example_solution);
        this.addSolution(this.example_solution);
      },

      (error) => {
        console.error('Error fetching solution', error)
      }

    );
     
    }

  




  public fetchCompoundFunDict(): void {
    this.http.get<{ [name: string]: string }>(this.apiUrl + '/compound-fun-dict').pipe(
      tap((compoundFunDict: { [name: string]: string }) => {
        this.compoundFunDict$.next(compoundFunDict);
        this.groupCompoundsByType(compoundFunDict);
      })
    ).subscribe();
  }

  private groupCompoundsByType(compoundFunDict: { [name: string]: string }): void {
    const acidCompounds: string[] = [];
    const basicCompounds: string[] = [];
    const saltCompounds: string[] = [];

    for (const compound in compoundFunDict) {
      const type = compoundFunDict[compound];

      switch (type) {
        case 'A':
          this.acidCompounds.push(compound);
          break;
        case 'B':
          this.basicCompounds.push(compound);
          break;
        case 'S':
          this.saltCompounds.push(compound);
          break;
        default:
          // Handle unrecognized compound types, if needed
          break;
      }
    }
    this.acidCompounds$.next(acidCompounds);
    this.basicCompounds$.next(basicCompounds);
    this.saltCompounds$.next(saltCompounds);
  }
  getAcidCompounds(): Observable<string[]> {
    console.log("God: calling observable",this.acidCompounds);
    return this.acidCompounds$.asObservable();
  }

  getBasicCompounds(): Observable<string[]> {
    return this.basicCompounds$.asObservable();
  }

  getSaltCompounds(): Observable<string[]> {
    return this.saltCompounds$.asObservable();
  }

  solution_calculate_pH(solution: Solution): Observable<Solution> {
    const endpoint = `${this.apiUrl}/solution_calculate_pH`; 
    return this.http.post<Solution>(endpoint, solution).pipe(
      map(response => {
        // Update the original solution object with the response data
        Object.assign(solution, response);
        console.log("God returned", response)
        return solution;
      })
    );
  }
  solution_calculate_total_Conc_target_pH(solution: Solution): Observable<Solution> {
    console.log("God got here");
    const endpoint = `${this.apiUrl}/solution_totalconc_target_pH`; 
    return this.http.post<Solution>(endpoint, solution).pipe(
      map(response => {
        // Update the original solution object with the response data
        Object.assign(solution, response);
        console.log("God returned", response)
        return solution;
      })
    );
  }

 addSolution(solution: Solution) {
    this.omSolutions.push(solution);
    console.log("God", this.omSolutions)
    this.solutionAdded.emit(); 
  }

  get_emitted() {
    return this.edit_solution;
  }

edit_solutionf(solution:Solution){
  this.edit_solution = solution;
  console.log("God in solution service 1", this.edit_solution);
  this.edit_solution$.next(this.edit_solution);
    this.solutionEdited.emit();
    //console.log("God in solution service 2", this.edit_solution);
  }
getAllSolutions(): Solution[] {
    return this.omSolutions;
  }

  // Add other methods as needed
}
