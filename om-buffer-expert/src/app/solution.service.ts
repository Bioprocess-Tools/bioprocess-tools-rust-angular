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
  compounds_acidic: string[] = [];
  compounds_basic: string[] = [];
  compounds_salt: string[] = [];


  compoundFunDict2: { [name: string]: string } = {};

  solutionAdded: EventEmitter<void> = new EventEmitter<void>();
  solutionEdited: EventEmitter<void> = new EventEmitter<void>();

 //private apiUrl = 'https://buffer-designer-service-zuynyusrbq-uc.a.run.app/api'; // Replace with your Flask API URL
  
  private apiUrl = 'http://127.0.0.1:5000/api'; // Replace with your Flask API URL

  constructor(private http: HttpClient) {

    console.log("God: in construction", this.acidCompounds);
    this.get_ion_names();
    this.get_example_solution();
    this.populate_compounds();
  }

  api_get_compounds(): Observable<{ [name: string]: string }> {
    return this.http.get<{ [name: string]: string }>(this.apiUrl+ '/compound-fun-dict')
  }
  
  populate_compounds(): void {

      this.api_get_compounds().subscribe(
        data => {
          this.compoundFunDict2 = data;
          this.group_compounds_type(this.compoundFunDict2);
          console.log("God got dictionary", this.compoundFunDict2);
          console.log("God got types", this.compounds_acidic, this.compounds_basic, this.compounds_salt);

        },
        error => {
          console.error('Failed to fetch compounds', error);
        }
      );
    
  }

// Assuming you have a dictionary of compounds like this:
// let compounds_dict = {'compound1': 'A', 'compound2': 'B', 'compound3': 'S', ...};
private group_compounds_type (compounds_dict) {


for (let [compound, type] of Object.entries(compounds_dict)) {
    switch (type) {
        case 'A':
            this.compounds_acidic.push(compound);
            break;
        case 'B':
            this.compounds_basic.push(compound);
            break;
        case 'S':
           this.compounds_salt.push(compound)
            break;
        default:
            // Handle any other case or unexpected value here, if needed.
            console.log(`Unexpected type: ${type} for compound: ${compound}`);
            break;
    }
}
this.compounds_salt.push("None")
this.compounds_acidic.sort();
this.compounds_salt.sort();
this.compounds_basic.sort();
}

  // Implement the necessary methods to interact with the solution object
  // For example:


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

getAppAcidCompounds(): string[] {
  return this.compounds_acidic;
}

getAppBasicCompounds(): string[] {
  return this.compounds_basic;
}

getAppSaltCompounds(): string[] {
  return this.compounds_salt;
}

  // Add other methods as needed
}
