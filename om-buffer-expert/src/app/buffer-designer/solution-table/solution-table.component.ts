import { Component,OnInit, Input, ViewChild, ElementRef , ViewChildren, QueryList, AfterViewInit,OnDestroy} from '@angular/core';
import { SolutionService } from '../../solution.service';
import { Solution } from '../../shared/models/solution.model';
import { Compound } from '../../shared/models/compound.model';
import { ApiService } from '../../api-service.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-solution-table',
  templateUrl: './solution-table.component.html',
  styleUrls: ['./solution-table.component.scss']
})
export class SolutionTableComponent implements OnInit, AfterViewInit,OnDestroy {
  solutions: Solution[] = [];
  solution: Solution;
  jsonData: Solution[] = [];
  selectedSolution:Solution=null;
  imageUrl:string;
  example_solution:Solution;
  solutionSubscription?:Subscription;
constructor(
  private solutionService: SolutionService, 
  private omRoute:Router,
  private apiService:ApiService) {
   

  }

  @ViewChildren('solutionElement') solutionElements!: QueryList<ElementRef>; // Access the elements as a QueryList

  ngAfterViewInit() {
    // Subscribe to changes in the list
    this.solutionElements.changes.subscribe(_ => {
      this.scrollToSolution(this.solution);
    });
  }
  scrollToSolution(solution: any, index?: number) {
    // If the index is not provided, find the index
    if (index === undefined) {
      index = this.solutions.indexOf(solution);
    }

    // Scroll to the specific solution
    const solutionElementsArray = this.solutionElements.toArray();
    if (solutionElementsArray[index]) {
      solutionElementsArray[index].nativeElement.scrollIntoView({ behavior: 'smooth', block:'nearest', inline:'start' });
    }
  }


  ngOnDestroy(): void {
    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }

viewDetails(solution:Solution, index:number,event: MouseEvent) {
  //event.preventDefault();
  this.solution = solution;
  this.selectedSolution = solution;

  this.editSolution(solution);
  this.scrollToSolution(solution, index)

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

    this.solutionService.solutions_list.subscribe(solutions => {
      this.solutions = solutions;
    });
    this.solutionSubscription = this.solutionService.currentSolution.subscribe({
      next:(solution) => {
      if (solution) {
        // Assuming you have a method to handle the form population
       
         this.selectedSolution = solution;
         this.solution = this.selectedSolution;
        
      }
    }
  }
    );

   
  }
 
  }
