import { Component, OnInit } from '@angular/core';
import { SolutionService } from '../solution.service';
import { Compound } from '../shared/models/compound.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from '../shared/models/solution.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-buffer-calculation-option1',
  templateUrl: './buffer-calculation-option1.component.html',
  styleUrls: ['./buffer-calculation-option1.component.scss']
})
export class BufferCalculationOption1Component implements OnInit {
  bufferForm: FormGroup | undefined;

  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;
  compoundNames: string[] = [];
  solutionedit:Solution;
  acidconc:number;
  baseconc:number;
  saltconc:number;

  public godSolution = new Solution("God solution");
  public returnedSolution: Solution;
  public acidicCompound;
  public basicCompound;
  public saltCompound;

  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public omroute:Router

  ) { 

this.loadCompoundNames();
this.acidCompounds = this.solutionService.acidCompounds;
this.basicCompounds = this.solutionService.basicCompounds;
this.saltCompounds = this.solutionService.saltCompounds;

this.initializeForm()
this.solutionService.example_solution$.subscribe(
  example_solution => {
    this.example_solution = example_solution;
    this.returnedSolution = example_solution;
    console.log("God example solution in buffer calc 1", this.example_solution);
  }
);
    
  }

  changeForm(solution:Solution) {
    //this.omroute.navigate(['./pH-Calculator']);
    let acidname = solution.compounds[0].name;
    let basename = solution.compounds[1].name;
    console.log("God in change", solution)
    let saltname:string=null;
    let saltconc =0;
    
    if(solution.compounds.length=3) {
      console.log("God here in salt", solution.compounds[2].name);
      saltname = solution.compounds[2].name;
      saltconc = solution.compound_concentrations[saltname];
      this.bufferForm.controls['saltCompound'].setValue(saltname);
      this.bufferForm.controls['saltConcentration'].setValue( saltconc);
    }
    let acidconc = solution.compound_concentrations[acidname];
    let baseconc = solution.compound_concentrations[basename];
    this.bufferForm.controls['acidicCompound'].setValue(acidname);
    this.bufferForm.controls['basicCompound'].setValue(basename);
    this.bufferForm.controls['acidicConcentration'].setValue( acidconc);
    this.bufferForm.controls['basicConcentration'].setValue (baseconc);
    //console.log("God came to change",this.bufferForm);
    
    }

  ngOnInit() {
/*     this.loadCompoundNames();

    //this.solutionService.get_example_solution();
    this.solutionService.example_solution$.subscribe(
      example_solution => {
        this.example_solution = example_solution;
        this.returnedSolution = example_solution;
        console.log("God example solution in buffer calc 1", this.example_solution);
      }
    );
    console.log(this.compoundNames)
    this.initializeForm();
    this.acidCompounds = this.solutionService.acidCompounds
    this.basicCompounds = this.solutionService.basicCompounds
    this.saltCompounds = this.solutionService.saltCompounds
    console.log("God: in init", this.acidCompounds)
    console.log("God: in init", this.basicCompounds)
    console.log("God: in init", this.saltCompounds) */
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
      acidicConcentration: [.019, [Validators.required, Validators.min(0), Validators.max(.4)]],
      basicConcentration: [.021, [Validators.required, Validators.min(0), Validators.max(.4)]],
      saltConcentration: [0.1, [Validators.min(0), Validators.max(1)]],
    });

    this.solutionService.solutionEdited.subscribe(() => {
      this.solutionedit = this.solutionService.get_emitted();
      console.log("God in buffer calc", this.solutionedit);
      this.changeForm(this.solutionedit);
    
    
    }); 
 
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

    const acidicCompoundConcentration = this.bufferForm.get('acidicConcentration').value;
    const basicCompoundConcentration = this.bufferForm.get('basicConcentration').value;
    const saltCompoundConcentration = this.bufferForm.get('saltConcentration').value;

    // Create Compound objects for the three compounds
    this.acidicCompound = {
      name: acidicCompoundName,
      type: 'Acidic Compound',
      concentration: acidicCompoundConcentration
    };

    this.basicCompound = {
      name: basicCompoundName,
      type: 'Basic Compound',
      concentration: basicCompoundConcentration
    };

    this.saltCompound = {
      name: saltCompoundName,
      type: 'Salt Compound',
      concentration: saltCompoundConcentration
    };

    // Create Solution object
    this.godSolution.name = "God";
    this.godSolution.compound_concentrations[acidicCompoundName] = acidicCompoundConcentration;
    this.godSolution.compound_concentrations[basicCompoundName] = basicCompoundConcentration;
    if (saltCompoundName != "") {
      this.godSolution.compound_concentrations[saltCompoundName] = saltCompoundConcentration;
    }


    console.log(this.godSolution)
    // Add Solution object to the SolutionService
    //this.solutionService.addSolution(solution);

    // Add the solution to the solution service
    this.solutionService.addSolution(this.godSolution);
    console.log(this.solutionService.getAllSolutions());
    this.calculatepH();
    // Reset the form
    this.bufferForm.reset();
    //changeForm(this.godSolution);
    //this.bufferForm.controls['acidicCompound'].setValue('Sodium Phosphate Monobasic');
    //console.log("God form", this.bufferForm.controls['acidicCompound'].value);
  }

  user = {
    name: 'Buffer'
  };

  // We can get the first letter of the name like this
  avatarLetter = this.user.name.charAt(0).toUpperCase();

  calculatepH() {
    // Make the API call to calculate pH
    this.solutionService.solution_calculate_pH(this.godSolution).subscribe((response: Solution) => {
      // Update the returnedSolution property with the response
      this.returnedSolution = response;
      console.log(this.returnedSolution)
    });
  }

}


