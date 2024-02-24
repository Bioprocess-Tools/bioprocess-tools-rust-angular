import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';
import { SolutionMixture } from '../../../shared/models/solution_mixture.model';
import { Solution } from 'src/app/shared/models/solution.model';
import { Compound } from 'src/app/shared/models/compound.model';
import { Observable, Subscription } from 'rxjs';

import { Router } from '@angular/router';

@Component({
  selector: 'app-solutions-review',
  templateUrl: './solutions-review.component.html',
  styleUrls: ['./solutions-review.component.scss'],
})
export class SolutionsReviewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  solutions: Solution[] = [];
  solution: Solution;
  solutionMixture: SolutionMixture;
  jsonData: Solution[] = [];
  selectedSolution: Solution = null;
  imageUrl: string;
  example_solution: Solution;
  solutionSubscription?: Subscription;

  constructor(
    private solutionMixtureService: SolutionMixtureService,
    private omRoute: Router
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

  viewDetails(solution: Solution, index: number, event: MouseEvent) {
    //event.preventDefault();
    this.solution = solution;
    this.selectedSolution = solution;

    //this.editSolution(solution);
    this.scrollToSolution(solution, index);
  }

  editSolution(solution: Solution) {
    // Assuming 'solution' is the data you want to pass to the forms
    // this.solutionMixtureService.changeSolution(solution);
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
    let numb = 0;
    for (let i = 0; i < Ionic_Concs.length; i++) {
      truncConcs.push(Ionic_Concs[i].toFixed(2));
    }
    return truncConcs;
  }
  ngOnInit() {
    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
      (solutionMixture) => {
        if (solutionMixture) {
          // do something with solutionMixture
          this.solutionMixture = solutionMixture;
          this.solutions = this.solutionMixture.solutions;
          this.selectedSolution = this.solutions[this.solutions.length - 1];
          this.solution = this.solutions[this.solutions.length - 1];
        }
      }
    );
  }
}
