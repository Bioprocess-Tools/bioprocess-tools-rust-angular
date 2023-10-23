import { Component,OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SolutionService } from '../../solution.service';
import { Solution } from '../../shared/models/solution.model';
import { Compound } from '../../shared/models/compound.model';
import { ApiService } from '../../api-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-solution-table',
  templateUrl: './solution-table.component.html',
  styleUrls: ['./solution-table.component.scss']
})
export class SolutionTableComponent implements OnInit {
  solutions: Solution[] = [];
  solution: Solution;
  jsonData: Solution[] = [];
  selectedSolution:Solution=null;
  imageUrl:string;
  displayedColumns: string[] = [];
  example_solution:Solution;
constructor(
  private solutionService: SolutionService, 
  private omRoute:Router,
  private apiService:ApiService) {
    this.solutions = this.solutionService.getAllSolutions();
    this.solution = this.solutions[this.solutions.length-1];

  }

viewDetails(solution:Solution) {
  this.solution = solution;
  this.selectedSolution = solution;
}

editNewForm (solution:Solution){
  this.omRoute.navigate(['./pH-Calculator']);
  this.solutionService.edit_solutionf(solution);
  //console.log("God edit" , solution);
}

editSolution(solution: Solution) {
  // Assuming 'solution' is the data you want to pass to the forms
  this.solutionService.changeSolution(solution);
}


getIonCharges(highestCharge:number):number[] {
  let charges = [];
  for (let i = highestCharge; i>highestCharge-4;i--) {charges.push(i);}
  return charges;
}
getIonConcentration(compound:Compound, ionIndex:number): number {
  return this.solution.compound_concentrations[compound.name] * compound.stoichiometry[ionIndex];
}
getIonicConcs(Ionic_Concs:number[]):number[] {
  let truncConcs = [];
  let numb = 0;
  for (let i = 0; i<Ionic_Concs.length;i++) {
    
    truncConcs.push (Ionic_Concs[i].toFixed(2));
  }
  return truncConcs;
}
  ngOnInit() {
    this.solutions = this.solutionService.getAllSolutions();
    // Subscribe to changes in the solution service
    this.solutionService.solutionAdded.subscribe(() => {
      this.solutions = this.solutionService.getAllSolutions();
      this.jsonData = this.solutions;
    
      this.solution = this.solutions[this.solutions.length-1];
      this.selectedSolution=this.solution;
      this.example_solution = this.solutionService.example_solution;
    });
    this.apiService.getSafetyImageUrl(2244).subscribe(url => {
        this.imageUrl = url;
      });
  }
 
  }
