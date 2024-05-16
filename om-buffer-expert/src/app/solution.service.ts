import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Solution } from './shared/models/solution.model';

import { environment } from 'src/environments/environment';
import { SolutionMixtureService } from './solution-mixture.service';

@Injectable({
  providedIn: 'root',
})
export class SolutionService {
  omSolutions: Solution[] = [];

  private solutionSource = new BehaviorSubject<Solution | null>(null);
  currentSolution = this.solutionSource.asObservable();
  private solution_list_Source = new BehaviorSubject<Solution[]>([]);
  solutions_list = this.solution_list_Source.asObservable();
  example_solution: Solution;

  private apiUrl = environment.apiUrl; // Replace with your Flask API URL

  constructor(
    private http: HttpClient,
    private solutionMixtureService: SolutionMixtureService
  ) {
    this.example_solution = this.solutionMixtureService.example_solution;
    this.add_Solution(this.example_solution);
  }

  changeSolution(solution: Solution) {
    this.solutionSource.next(solution);
  }
  deleteSolution(solution: Solution) {
    const currentSolutions = this.solution_list_Source.value;
    const updatedSolutions = currentSolutions.filter((s) => s !== solution);
    this.solution_list_Source.next(updatedSolutions);
    if (this.solutionSource.value === solution) {
      const newCurrentSolution = updatedSolutions[0] || null;
      this.solutionSource.next(newCurrentSolution);
    }
  }

  add_Solution(newSolution: Solution) {
    const currentSolutions = this.solution_list_Source.value;

    const updatedSolutions = [...currentSolutions, newSolution];

    this.changeSolution(newSolution);
    this.solution_list_Source.next(updatedSolutions);
  }

  solution_calculate_pH(solution: Solution): Observable<Solution> {
    const endpoint = `${this.apiUrl}/solution_calculate_pH`;
    return this.http.post<Solution>(endpoint, solution).pipe(
      map((response) => {
        // Update the original solution object with the response data
        Object.assign(solution, response);

        this.add_Solution(solution);
        this.changeSolution(solution);

        return solution;
      })
    );
  }

  super_calculate_pH(data: any): Observable<Solution> {
    const endpoint = `${this.apiUrl}/supercalculatorpH`;
    return this.http.post<Solution>(endpoint, data).pipe(
      map((response) => {
        this.add_Solution(response);
        this.changeSolution(response);
        return response;
      })
    );
  }

  solution_calculate_total_Conc_target_pH(
    solution: Solution
  ): Observable<Solution> {
    const endpoint = `${this.apiUrl}/solution_totalconc_target_pH`;
    return this.http.post<Solution>(endpoint, solution).pipe(
      map((response) => {
        Object.assign(solution, response);
        this.add_Solution(solution);
        this.changeSolution(solution);
        return solution;
      })
    );
  }
}
