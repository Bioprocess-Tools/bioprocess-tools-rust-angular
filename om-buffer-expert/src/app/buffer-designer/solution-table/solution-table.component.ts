import { Component,OnInit, Input, OnChanges,SimpleChanges ,ViewChild, ElementRef , ViewChildren, QueryList, AfterViewInit,OnDestroy} from '@angular/core';
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
  styleUrls: ['./solution-table.component.scss'],
})
export class SolutionTableComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() activeTab: string;
  solutions: Solution[] = [];
  solution: Solution;
  jsonData: Solution[] = [];
  selectedSolution: Solution = null;
  imageUrl: string;
  example_solution: Solution;
  solutionSubscription?: Subscription;
  trace: any[];
  layout: any;

  annotation_font: 12;
  constructor(
    private solutionService: SolutionService,
    private omRoute: Router,
    private apiService: ApiService
  ) {}

  @ViewChildren('solutionElement') solutionElements!: QueryList<ElementRef>; // Access the elements as a QueryList

  ngAfterViewInit() {
    // Subscribe to changes in the list
    this.solutionElements.changes.subscribe((_) => {
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
      solutionElementsArray[index].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }

  ngOnDestroy(): void {
    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
   console.log('God active tab', changes['activeTab']);
    if (changes['activeTab']) {
      if (changes['activeTab'].currentValue != 'super-calculator') {
        for (let i = this.solutions.length - 1; i >= 0; i--) {
          if (this.solutions[i].non_salt_compounds.length <= 2) {
            this.selectedSolution = this.solutions[i];
            this.scrollToSolution(this.solutions[i], i);
            this.solutionService.changeSolution(this.solutions[i]);
            this.solution = this.selectedSolution;
            break; // Add a break statement to exit the loop after finding the selected solution
          }
        }
      }
    }
  }
  viewDetails(solution: Solution, index: number, event: MouseEvent) {
    //event.preventDefault();
    this.solution = solution;
    this.selectedSolution = solution;

    this.editSolution(solution);
    this.scrollToSolution(solution, index);
  }
  deleteSolution(solution: Solution, i: number) {
    this.solutionService.deleteSolution(solution);
    if (this.solutions.length > 0) {
      this.selectedSolution = this.solutions[i - 1];
      this.solution = this.selectedSolution;
    } else {
      this.solution = null;
      this.selectedSolution = null;
    }
  }

  editSolution(solution: Solution) {
    // Assuming 'solution' is the data you want to pass to the forms
    this.solutionService.changeSolution(solution);
  }

  getIonCharges(highestCharge: number): number[] {
    let charges = [];
    for (let i = highestCharge; i > highestCharge - 4; i--) {
      charges.push(i);
    }
    return charges;
  }
  getIonConcentration(compound: Compound, ionIndex: number): number {
    return (
      this.solution.compound_concentrations[compound.name] *
      compound.stoichiometry[ionIndex]
    );
  }
  getIonicConcs(Ionic_Concs: number[]): number[] {
    let truncConcs = [];
    for (let i = 0; i < Ionic_Concs.length; i++) {
      truncConcs.push(
        Ionic_Concs[i] === 0 ? 0 : parseFloat(Ionic_Concs[i].toFixed(3))
      );
    }
    return truncConcs;
  }

  ngOnInit() {
    this.solutionService.solutions_list.subscribe((solutions) => {
      this.solutions = solutions;
    });
    this.solutionSubscription = this.solutionService.currentSolution.subscribe({
      next: (solution) => {
        if (solution) {
          // Assuming you have a method to handle the form population

          this.selectedSolution = solution;
          this.solution = this.selectedSolution;
          if (Object.keys(this.solution.heat_map_data).length > 0) {
            //console.log('God heatmap', this.solution.heat_map_data);
            this.generateHeatMap();
          }
        }
      },
    });

    window.addEventListener('resize', () => {
      this.generateHeatMap();
    });
  }
  getKeys(sol: Solution): boolean{
    if (Object.keys(sol.heat_map_data).length > 0){
      return true;
    }
    return false;
  }
  generateHeatMap() {
    let fontSize;
    if (window.innerWidth <= 480) {
      fontSize = 8; // Small font size for small screens
    } else if (window.innerWidth <= 768) {
      fontSize = 10; // Medium font size for medium screens
    } else {
      fontSize = 12; // Large font size for large screens
    }
    let title_font = fontSize + 10;
    let axis_font = fontSize + 2;

    // Assuming you have a method to handle the heatmap generation
    let centerConcentrations =
      this.solution.heat_map_data['center_concentrations'];

    // Assuming centerConcentrations is an array of objects like [{name: 'compound1', value: 0.95}, {name: 'compound2', value: 1.0}]
    let compoundNames = Object.keys(centerConcentrations);
    //console.log('god center', centerConcentrations);

    let dataPoints = this.solution.heat_map_data['data_points'];
    // const dataPoints = [
    //   { x: 0.95, y: 0.95, pH: 7.0 },
    //   { x: 0.95, y: 1.0, pH: 7.1 },
    //   { x: 1.0, y: 0.95, pH: 7.2 },
    //   { x: 1.05, y: 1.05, pH: 7.3 },
    // ];

    const xValues = dataPoints.map((dp) => dp.x * 100 - 100);
    const yValues = dataPoints.map((dp) => dp.y * 100 - 100);
    const zValues = dataPoints.map((dp) => dp.deviation);
    const maxZValue = 0.3;

    const greenBreakpoint = 0.1 / maxZValue;
    const orangeBreakpoint = 0.2 / maxZValue;
    //console.log('god dev', zValues);
    this.trace = [
      {
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'heatmap',
        colorscale: [
          [0.0, '#B1C381'],
          [greenBreakpoint, '#B1C381'],
          [greenBreakpoint + 0.00001, '#EEC759'],
          [orangeBreakpoint, '#EEC759'],
          [orangeBreakpoint + 0.00001, '#FF8080'],
          [1, '#FF8080'],
        ],
        zmin: 0,
        zmax: maxZValue,
        showscale: true,
        colorbar: {
          x: 0.5,
          xpad: 10,
          y: 1,
          ypad: 10,
          len: 0.75,
          thicknessmode: 'fraction',
          thickness: 0.05,
          orientation: 'h',
        },
      },
    ];
    const xTickVals = xValues;
    const xTickText = xValues.map((val) => `${Math.round(val)}%`);

    const yTickVals = yValues;
    const yTickText = yValues.map((val) => `${Math.round(val)}%`);
    this.layout = {
      autosize: true,
      width: window.innerWidth * 0.95,
      margin: {
        l: 75, // Adjust left margin
        r: 25, // Reduce right margin
        b: 100, // Adjust bottom margin
        t: 100, // Adjust top margin
        pad: 0,
      },
      title: 'Composition variability heatmap',
      titlefont: {
        size: title_font,
        color: 'black',
        family: 'Roboto, bold',
      },

      annotations: [],
      xaxis: {
        title: {
          text: compoundNames[0] + '<br>(% change)',
          standoff: 30,
          font: {
            size: axis_font,
            color: 'black',
          },
        },
        tickvals: xTickVals,
        ticktext: xTickText,
        tickfont: {
          size: fontSize,
          color: 'black',
        },
      },
      yaxis: {
        title: {
          text: compoundNames[1] + '<br>(% change)',
          standoff: 0,
          font: {
            size: axis_font,
            color: 'black',
          },
        },

        tickvals: yTickVals,
        ticktext: yTickText,
        tickfont: {
          size: fontSize,
          color: 'black',
        },
      },
      shapes: [], // add this line to initialize the shapes array
    };

    for (let i = 1; i <= Math.max(...xTickVals, ...yTickVals); i += 2) {
      this.layout.shapes.push({
        type: 'rect',
        x0: -i,
        y0: -i,
        x1: i,
        y1: i,
        line: {
          color: 'rgb(159, 159, 159)',
          width: 1,
        },
      });
    }

    dataPoints.forEach((dp) => {
      this.layout.annotations.push({
        x: dp.x * 100 - 100,
        y: dp.y * 100 - 100,
        xref: 'x',
        yref: 'y',
        text: dp.pH.toFixed(2),
        showarrow: false,
        font: {
          family: 'Roboto, bold',
          size: fontSize,
          color: 'black',
        },
      });
    });

    console.log('God trace', this.trace);
    console.log('God layout', this.layout);
  }
}
