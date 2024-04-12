import { Component,OnInit, Input, ViewChild, ElementRef , ViewChildren, QueryList, AfterViewInit,OnDestroy} from '@angular/core';
import { SolutionService } from '../../solution.service';
import { Solution } from '../../shared/models/solution.model';
import { Compound } from '../../shared/models/compound.model';
import { ApiService } from '../../api-service.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Ion } from 'src/app/shared/models/ion.model';

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
  trace:any[];
  layout:any;

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
deleteSolution(solution: Solution) {
  this.solutionService.deleteSolution(solution);
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
         if (Object.keys(this.solution.heat_map_data).length > 0) {
         console.log("God heatmap", this.solution.heat_map_data);
        this.generateHeatMap();
         }
      }
    }
  }
    );

    
   
  }

  generateHeatMap() {
    // Assuming you have a method to handle the heatmap generation


    let dataPoints = this.solution.heat_map_data['data_points'];
    // const dataPoints = [
    //   { x: 0.95, y: 0.95, pH: 7.0 },
    //   { x: 0.95, y: 1.0, pH: 7.1 },
    //   { x: 1.0, y: 0.95, pH: 7.2 },
    //   { x: 1.05, y: 1.05, pH: 7.3 },
    // ];


const xValues = dataPoints.map((dp) => dp.x * 100-100);
const yValues = dataPoints.map((dp) => dp.y * 100-100);
const zValues = dataPoints.map((dp) => dp.deviation);
this.trace = [
  {
    x: xValues,
    y: yValues,
    z: zValues,
    type: 'heatmap',
    colorscale: [
      [0, '#4daf4a'],

      [0.099, '#4daf4a'],
      [0.1, 'orange'],
      [0.299, 'orange'],
      [0.3, '#e41a1b'],
      [1, '#e41a1b'],
    ],
    showscale: true,
  },
];

this.layout = {
  title: 'pH Deviations Heatmap',
  annotations: [],
};

dataPoints.forEach((dp) => {
  this.layout.annotations.push({
    x: dp.x * 100-100,
    y: dp.y * 100-100,
    xref: 'x',
    yref: 'y',
    text: dp.pH.toFixed(2),
    showarrow: false,
    font: {
      family: 'Arial',
      size: 12,
      color: 'black',
    },
  });
});

console.log("God trace", this.trace);
console.log("God layout", this.layout);
 
  }
}
