import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Solution } from './shared/models/solution.model';
import { Compound } from './shared/models/compound.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolutionService {
  omSolutions: Solution[] = [];

  compoundFunDict$: BehaviorSubject<{ [name: string]: string }> =
    new BehaviorSubject<{ [name: string]: string }>({});
  acidCompounds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  basicCompounds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );
  saltCompounds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  ion_names$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  example_solution$: BehaviorSubject<Solution> = new BehaviorSubject<Solution>(
    null
  );

  private solutionSource = new BehaviorSubject<Solution | null>(null);
  currentSolution = this.solutionSource.asObservable();

  private solution_list_Source = new BehaviorSubject<Solution[]>([]);
  solutions_list = this.solution_list_Source.asObservable();

  ion_names: string[] = [];

  buffer_species_names$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  buffer_species_names: string[] = [];

  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;

  compounds_acidic: string[] = [];
  compounds_basic: string[] = [];
  compounds_salt: string[] = [];

  buffer_compound_names: string[] = [];
  compoundFunDict2: { [name: string]: string } = {};

  private apiUrl = environment.apiUrl; // Replace with your Flask API URL

  constructor(private http: HttpClient) {
    //console.log("God: in construction", this.acidCompounds);
    this.get_ion_names();
    this.get_buffer_compound_names();
    this.populate_compounds();
    this.get_example_solution();
    this.get_buffer_species_names();
  }

  changeSolution(solution: Solution) {
    this.solutionSource.next(solution);
    //console.log("God: changing solution", solution);
  }
  deleteSolution(solution: Solution) {
    // Get the current list of solutions
    const currentSolutions = this.solution_list_Source.value;
    // Remove the selected solution from the list
    const updatedSolutions = currentSolutions.filter(
      (s) => s !== solution
    );
    // Update the BehaviorSubject with the new list
    this.solution_list_Source.next(updatedSolutions);
    //console.log("God: deleting solution", solution);
  }

  api_get_buffer_compound_names(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + '/get_buffer_compound_names');
  }

  get_buffer_compound_names() {
    this.api_get_buffer_compound_names().subscribe(
      (data) => {
        this.buffer_compound_names = data;

        //console.log('God buffer names', this.buffer_compound_names);
      },
      (error) => {
        console.error('Failed to fetch buffer compounds', error);
      }
    );
  }

  api_get_compounds(): Observable<{ [name: string]: string }> {
    return this.http.get<{ [name: string]: string }>(
      this.apiUrl + '/compound-fun-dict'
    );
  }

  populate_compounds(): void {
    this.api_get_compounds().subscribe(
      (data) => {
        this.compoundFunDict2 = data;
        this.group_compounds_type(this.compoundFunDict2);
        //console.log("God got dictionary", this.compoundFunDict2);
        // console.log(
        //   'God got types',
        //   this.compounds_acidic,
        //   this.compounds_basic,
        //   this.compounds_salt
        // );
      },
      (error) => {
        console.error('Failed to fetch compounds', error);
      }
    );
  }

  // Assuming you have a dictionary of compounds like this:
  // let compounds_dict = {'compound1': 'A', 'compound2': 'B', 'compound3': 'S', ...};
  private group_compounds_type(compounds_dict) {
    for (let [compound, type] of Object.entries(compounds_dict)) {
      switch (type) {
        case 'A':
          this.compounds_acidic.push(compound);
          break;
        case 'B':
          this.compounds_basic.push(compound);
          break;
        case 'S':
          this.compounds_salt.push(compound);
          break;
        default:
          // Handle any other case or unexpected value here, if needed.
          //console.log(`Unexpected type: ${type} for compound: ${compound}`);
          break;
      }
    }
    this.compounds_salt.push('None');
    this.compounds_acidic.sort();
    this.compounds_salt.sort();
    this.compounds_basic.sort();
  }

  // Implement the necessary methods to interact with the solution object
  // For example:

  get_ion_names(): void {
    const endpoint = `${this.apiUrl}/get_ion_names`;
    this.http
      .get<string[]>(endpoint)
      .pipe(
        map((response: string[]) => {
          this.ion_names = response;
          this.ion_names$.next(this.ion_names);
          //console.log("God in service", this.ion_names);
        })
      )
      .subscribe();
  }

  get_buffer_species_names(): void {
    const endpoint = `${this.apiUrl}/get_buffer_species_list`;
    this.http
      .get<string[]>(endpoint)
      .pipe(
        map((response: string[]) => {
          this.buffer_species_names = response;
          this.buffer_species_names$.next(this.buffer_species_names);
          //console.log("God in service", this.ion_names);
        })
      )
      .subscribe();
  }

  get_example_solution(): void {
    const endpoint = `${this.apiUrl}/get_example_solution`;
    this.http.get<Solution>(endpoint).subscribe(
      (response) => {
        this.example_solution = response;
        this.example_solution$.next(this.example_solution);
        //console.log("God : example", this.example_solution);
        this.add_Solution(this.example_solution);
        console.log('God added example solution', this.example_solution);
        this.changeSolution(this.example_solution);
      },

      (error) => {
        console.error('Error fetching solution', error);
      }
    );
  }

  add_Solution(newSolution: Solution) {
    // Get the current list of solutions
    const currentSolutions = this.solution_list_Source.value;
    // Add the new solution to the list
    const updatedSolutions = [...currentSolutions, newSolution];
    // Update the BehaviorSubject with the new list
    this.solution_list_Source.next(updatedSolutions);
    //console.log("God added solution", newSolution);
  }

  solution_calculate_pH(solution: Solution): Observable<Solution> {
    const endpoint = `${this.apiUrl}/solution_calculate_pH`;
    return this.http.post<Solution>(endpoint, solution).pipe(
      map((response) => {
        // Update the original solution object with the response data
        Object.assign(solution, response);
        //console.log("God returned", response)
        this.add_Solution(solution);
        this.changeSolution(solution);

        return solution;
      })
    );
  }

  sendUserInput(userInput: string): void {
    const requestBody = { text: userInput };

    const endpoint = `${this.apiUrl}/chat`;
    this.http
      .post<Solution>(endpoint, userInput)
      .subscribe((response: Solution) => {
        const solution = Object.assign(new Solution('God'), response);

        //console.log("God returned", response)
        this.add_Solution(solution);
        this.changeSolution(solution);
      });
  }

  solution_calculate_total_Conc_target_pH(
    solution: Solution
  ): Observable<Solution> {
    //console.log("God got here");
    const endpoint = `${this.apiUrl}/solution_totalconc_target_pH`;
    return this.http.post<Solution>(endpoint, solution).pipe(
      map((response) => {
        // Update the original solution object with the response data
        Object.assign(solution, response);
        console.log('God returned', response);
        this.add_Solution(solution);
        this.changeSolution(solution);

        return solution;
      })
    );
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

  getAppBufferCompounds(): string[] {
    //console.log('God buffer names getApp', this.buffer_compound_names);
    return this.buffer_compound_names;
  }

  // Add other methods as needed
}
