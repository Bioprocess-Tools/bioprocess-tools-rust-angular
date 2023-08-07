import { Component, OnInit } from '@angular/core';
import { SolutionService } from '../solution.service';
import { Compound } from '../shared/models/compound.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from '../shared/models/solution.model';


@Component({
  selector: 'app-buffer-calculation-option2',
  templateUrl: './buffer-calculation-option2.component.html',
  styleUrls: ['./buffer-calculation-option2.component.scss']
})
export class BufferCalculationOption2Component implements OnInit {
  bufferForm: FormGroup | undefined;
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;
  compoundNames: string[] = [];
  public godSolution = new Solution("God solution");
  public returnedSolution: Solution;
  public acidicCompound;
  public basicCompound;
  public saltCompound;

  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService


  ) { }

  ngOnInit(): void {

    this.loadCompoundNames()

    //this.solutionService.get_example_solution();
    this.solutionService.example_solution$.subscribe(
      example_solution => {
        this.example_solution = example_solution;
        this.returnedSolution = example_solution;
        console.log("God example solution in buffer calc 2", this.example_solution);
      }
    );
    this.acidCompounds = this.solutionService.acidCompounds
    this.basicCompounds = this.solutionService.basicCompounds
    this.saltCompounds = this.solutionService.saltCompounds
    console.log("God: in acid", this.acidCompounds)
    console.log("God: in base", this.basicCompounds)
    console.log("God: in salt", this.saltCompounds)
    this.initializeForm()
  }

  loadCompoundNames() {
    // Implement the logic to fetch compound names from the server
    // and populate the compoundNames array
    // For example:
    this.solutionService.get_compound_names().subscribe(
      (compoundNames: string[]) => {
        this.compoundNames = compoundNames;
      },
      (error: any) => {
        console.error('Error fetching compounds:', error);
      }
    );
  }

  initializeForm() {
    this.bufferForm = this.formBuilder.group({
      acidicCompound: ['Sodium Phosphate Monobasic', Validators.required],
      basicCompound: ['Sodium Phosphate Dibasic', Validators.required],
      saltCompound: ['Sodium Chloride'],
      totalConcentration: [.04, [Validators.required, Validators.min(0), Validators.max(.4)]],
      target_pH: [7.00, [Validators.required, Validators.min(3), Validators.max(10)]],
      saltConcentration: [0.1, [Validators.min(0), Validators.max(2)]],
    });
    //this.example_solution = this.solutionService.example_solution;
    //console.log("God : example solution", this.example_solution)
  }
  onSubmit() {
    console.log("god here", this.bufferForm);
    this.godSolution = new Solution("God solution");
    if (this.bufferForm.invalid) {
      return;
    }
    console.log("god here 2");
    console.log(this.bufferForm)
    const acidicCompoundName = this.bufferForm.get('acidicCompound').value;
    const basicCompoundName = this.bufferForm.get('basicCompound').value;
    const saltCompoundName = this.bufferForm.get('saltCompound').value;

    const totalConcentration = this.bufferForm.get('totalConcentration').value;
    const target_pH = this.bufferForm.get('target_pH').value;
    const saltCompoundConcentration = this.bufferForm.get('saltConcentration').value;

    // Create Compound objects for the three compounds
    this.acidicCompound = {
      name: acidicCompoundName,
      type: 'Acidic Compound',
      concentration: 0
    };

    this.basicCompound = {
      name: basicCompoundName,
      type: 'Basic Compound',
      concentration: 0
    };

    this.saltCompound = {
      name: saltCompoundName,
      type: 'Salt Compound',
      concentration: saltCompoundConcentration
    };

    // Create Solution object
    this.godSolution.name = "God";
    this.godSolution.target_buffer_concentration = totalConcentration;
    this.godSolution.compound_concentrations[acidicCompoundName] = 0;
    this.godSolution.compound_concentrations[basicCompoundName] = 0;
    if (saltCompoundName != "") {
      this.godSolution.compound_concentrations[saltCompoundName] = saltCompoundConcentration;
    }


    this.godSolution.pH = target_pH;

    console.log(this.godSolution)
    // Add Solution object to the SolutionService
    //this.solutionService.addSolution(solution);

    // Add the solution to the solution service
    this.solutionService.addSolution(this.godSolution);
    console.log(this.solutionService.getAllSolutions())

    // Reset the form
    this.calculatepH()
    this.bufferForm.reset();

  }

  user = {
    name: "Phosphate"
  };

  // We can get the first letter of the name like this
  avatarLetter = this.user.name.charAt(0).toUpperCase();

  calculatepH() {
    // Make the API call to calculate pH
    console.log("God got to calc")
    this.solutionService.solution_calculate_total_Conc_target_pH(this.godSolution).subscribe((response: Solution) => {
      //  Update the returnedSolution property with the response
      this.returnedSolution = response;
      console.log("God: this is god solution", this.godSolution)
      console.log("God: this is returned solution", this.returnedSolution)
    });
    //console.log(this.godSolution)
  }

}