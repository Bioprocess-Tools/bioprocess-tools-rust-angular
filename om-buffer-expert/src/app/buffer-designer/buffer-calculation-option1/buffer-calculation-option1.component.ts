import { Component, OnDestroy, OnInit } from '@angular/core';
import { SolutionService } from '../../solution.service';
import { Compound } from '../../shared/models/compound.model';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from '../../shared/models/solution.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-buffer-calculation-option1',
  templateUrl: './buffer-calculation-option1.component.html',
  styleUrls: ['./buffer-calculation-option1.component.scss']
})
export class BufferCalculationOption1Component implements OnInit, OnDestroy {
  solutionSubscription?: Subscription;
  bufferForm: FormGroup | undefined;
  acidCompounds: string[] = [];
  basicCompounds: string[] = [];
  saltCompounds: string[] = [];
  example_solution: Solution;
  //solutionedit:Solution;
  submitted: boolean = false;


  public godSolution = new Solution("God solution");
  public returnedSolution: Solution;
  buffer_compound_names: string[] = [];


  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
   // public omroute:Router

  ) { 

//this.loadCompoundNames();

// this.acidCompounds = this.solutionService.getAppAcidCompounds();
// this.basicCompounds = this.solutionService.getAppBasicCompounds();
// this.saltCompounds = this.solutionService.getAppSaltCompounds();
// this.buffer_compound_names = this.solutionService.getAppBufferCompounds();
//console.log("God:cmpds", this.acidCompounds, this.buffer_compound_names)

// this.solutionSubscription = this.solutionService.example_solution$.subscribe(
//   example_solution => {
//     this.example_solution = example_solution;
//     this.returnedSolution = example_solution;
//     this.populateForm(this.returnedSolution);
 
//     //console.log("God example solution in buffer calc 1", this.example_solution);
//   }
  
// );
//this.initializeForm()
  }

  // changeForm(solution:Solution) {
  //   //this.omroute.navigate(['./pH-Calculator']);
  //   let acidname = solution.compounds[0].name;
  //   let basename = solution.compounds[1].name;


  //   //console.log("God in change", solution)
  //   let saltname:string=null;
  //   let saltconc =0;
    
  //   if(solution.compounds.length=3) {
  //     //console.log("God here in salt", solution.compounds[2].name);
  //     saltname = solution.compounds[2].name;
  //     saltconc = solution.compound_concentrations[saltname];
  //     this.bufferForm.controls['saltCompound'].setValue(saltname);
  //     this.bufferForm.controls['saltConcentration'].setValue( saltconc);
  //   }
  //   let acidconc = solution.compound_concentrations[acidname];
  //   let baseconc = solution.compound_concentrations[basename];
  //   this.bufferForm.controls['acidicCompound'].setValue(acidname);
  //   this.bufferForm.controls['basicCompound'].setValue(basename);
  //   this.bufferForm.controls['acidicConcentration'].setValue( acidconc);
  //   this.bufferForm.controls['basicConcentration'].setValue (baseconc);
  //   //console.log("God came to change",this.bufferForm);
    
  //   }

  ngOnInit(): void {

    //this.bufferForm.reset;
    this.initializeForm();
    // this.solutionService.example_solution$.subscribe(
    //   example_solution => {
    //     this.example_solution = example_solution;
    //     this.returnedSolution = example_solution;
    //     this.initializeForm();
    //     this.populateForm(this.returnedSolution);
    //     this.bufferForm.updateValueAndValidity({onlySelf:false, emitEvent:true})
    //     this.buffer_compound_names = this.solutionService.getAppBufferCompounds();
    //     //console.log("God example solution in buffer calc 2", this.example_solution);
    //   }
    // );


    this.solutionSubscription = this.solutionService.currentSolution.subscribe({
      next:(solution) => {
      if (solution) {

        this.acidCompounds = this.solutionService.getAppAcidCompounds();
        //console.log("God acid",this.acidCompounds)
        this.basicCompounds = this.solutionService.getAppBasicCompounds();
        this.saltCompounds = this.solutionService.getAppSaltCompounds();
        this.buffer_compound_names = this.solutionService.getAppBufferCompounds();


        // Assuming you have a method to handle the form population
        this.populateForm(solution);
         this.returnedSolution = solution;
         this.bufferForm.updateValueAndValidity({onlySelf:false, emitEvent:true})
  
      }
    }
  }
    );






   // this.initializeForm();
  }

bufferSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
       let isValid = true;
      const selection1 = control.get('acidicCompound')?.value;
      const selection2 = control.get('basicCompound')?.value;
      if (this.buffer_compound_names.length!=0) {
       isValid = this.buffer_compound_names.includes(selection1) || this.buffer_compound_names.includes(selection2);
      //console.log("God: validator ", this.buffer_compound_names,isValid)
      }
      //console.log("God: validator true ", this.buffer_compound_names,isValid)
  
      // Return error object or null based on validation result
      return isValid ? null : { 'invalidBufferSelection': true };
    };
  }


  

  

  populateForm(solution: Solution) {

    if(solution) {
    let acidname = solution.non_salt_compounds[0].name;
    let basename = solution.non_salt_compounds[1].name;
    //console.log("God in change", solution)
    let saltname:string=null;
    let saltconc =0;
    let acidconc = 0;
    let baseconc = 0;
    
    if(solution.compounds.length==3) {
      //console.log("God here in salt", solution.compounds[2].name);
      saltname = solution.compounds[2].name;
      saltconc = solution.compound_concentrations[saltname];
      this.bufferForm.controls['saltCompound'].setValue(saltname);
      this.bufferForm.controls['saltConcentration'].setValue( saltconc);
    }
    acidconc = parseFloat(solution.compound_concentrations[acidname].toPrecision(4));
    baseconc =  parseFloat(solution.compound_concentrations[basename].toPrecision(4));
    this.bufferForm.controls['acidicCompound'].setValue(acidname);
    this.bufferForm.controls['basicCompound'].setValue(basename);
    this.bufferForm.controls['acidicConcentration'].setValue( acidconc);
    this.bufferForm.controls['basicConcentration'].setValue (baseconc);
    this.bufferForm.updateValueAndValidity({onlySelf:false, emitEvent:true})
  }
 // this.bufferForm.markAsUntouched();
  }

  ngOnDestroy(): void {
    if (this.solutionSubscription) {
      this.solutionSubscription.unsubscribe();
    }
  }

  initializeForm() {
    this.bufferForm = this.formBuilder.group({
      acidicCompound: ['Sodium Phosphate Monobasic', Validators.required],
      basicCompound: ['Sodium Phosphate Dibasic', Validators.required],
      saltCompound: 'Sodium Chloride',
      acidicConcentration: [.019, [Validators.required, Validators.min(0), Validators.max(.4)]],
      basicConcentration: [.021, [Validators.required, Validators.min(0), Validators.max(.4)]],
      saltConcentration: [0.1, [Validators.min(0), Validators.max(1)]],
    },{validators: this.bufferSelectionValidator()});

 
}



  

  onSubmit() {
    //console.log("god here", this.bufferForm);
    this.godSolution = new Solution("God solution");
    if (this.bufferForm.invalid) {
      return;
    }
    //console.log("god here 2");
    //console.log(this.bufferForm)
    const acidicCompoundName = this.bufferForm.get('acidicCompound').value;
    const basicCompoundName = this.bufferForm.get('basicCompound').value;
    const saltCompoundName = this.bufferForm.get('saltCompound').value;

 

    const acidicCompoundConcentration = this.bufferForm.get('acidicConcentration').value;
    const basicCompoundConcentration = this.bufferForm.get('basicConcentration').value;
    const saltCompoundConcentration = this.bufferForm.get('saltConcentration').value;



    // Create Solution object
    this.godSolution.name = "God";
    this.godSolution.compound_concentrations[acidicCompoundName] = acidicCompoundConcentration;
    this.godSolution.compound_concentrations[basicCompoundName] = basicCompoundConcentration;
    if (saltCompoundName != "None") {
      this.godSolution.compound_concentrations[saltCompoundName] = saltCompoundConcentration;
    }

    this.submitted=true;

    this.calculatepH();
    this.bufferForm.markAsUntouched();
  
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

    });
  }

}


