import { Component, OnDestroy, OnInit } from '@angular/core';
import { SolutionService } from '../solution.service';
import { Compound } from '../shared/models/compound.model';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from '../shared/models/solution.model';


@Component({
  selector: 'app-buffer-calculation-option2',
  templateUrl: './buffer-calculation-option2.component.html',
  styleUrls: ['./buffer-calculation-option2.component.scss']
})
export class BufferCalculationOption2Component implements OnInit, OnDestroy {
  solutionSubscription?:Subscription;
  bufferForm: FormGroup | undefined;
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;
  //compoundNames: string[] = [];
  public godSolution = new Solution("God solution"); //solution to hold the user input
  public returnedSolution: Solution; //solution to hold the return from api


  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService
  ) { 
    this.acidCompounds = this.solutionService.getAppAcidCompounds();
    console.log("God acid",this.acidCompounds)
    this.basicCompounds = this.solutionService.getAppBasicCompounds();
    this.saltCompounds = this.solutionService.getAppSaltCompounds();
    this.initializeForm()
  }

  ngOnInit(): void {

    this.initializeForm();

    //this.solutionService.get_example_solution();
    this.solutionService.example_solution$.subscribe(
      example_solution => {
        this.example_solution = example_solution;
        this.returnedSolution = example_solution;
        console.log("God example solution in buffer calc 2", this.example_solution);
      }
    );
    this.solutionSubscription = this.solutionService.currentSolution.subscribe(solution => {
      if (solution) {
        // Assuming you have a method to handle the form population
        this.populateForm(solution);
      }
    });
  
  }

  populateForm(solution: Solution) {
    let acidname = solution.non_salt_compounds[0].name;
    let basename = solution.non_salt_compounds[1].name;
    console.log("God in change", solution)
    let saltname:string=null;
    let saltconc =0;
    console.log("God here in salt", solution.non_salt_compounds[0].name);
    if(solution.compounds.length=3) {
      
      saltname = solution.salt_compound.name;
      saltconc = solution.compound_concentrations[saltname];
      this.bufferForm.controls['saltCompound'].setValue(saltname);
      this.bufferForm.controls['saltConcentration'].setValue( saltconc);
    }
 
    this.bufferForm.controls['acidicCompound'].setValue(acidname);
    this.bufferForm.controls['basicCompound'].setValue(basename);
    this.bufferForm.controls['totalConcentration'].setValue(solution.target_buffer_concentration);
    this.bufferForm.controls['target_pH'].setValue( solution.pH);
 
  }

  ngOnDestroy() {
    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }
  initializeForm() {
    this.bufferForm = this.formBuilder.group({
      acidicCompound: [this.acidCompounds[12], Validators.required],
      basicCompound: [this.basicCompounds[12], Validators.required],
      saltCompound: this.saltCompounds[2],
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

    // Create Solution object
    this.godSolution.name = "God";
    this.godSolution.target_buffer_concentration = totalConcentration;
    this.godSolution.compound_concentrations[acidicCompoundName] = 0;
    this.godSolution.compound_concentrations[basicCompoundName] = 0;
    if (saltCompoundName != "None") {
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
    //this.bufferForm.reset();
  

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