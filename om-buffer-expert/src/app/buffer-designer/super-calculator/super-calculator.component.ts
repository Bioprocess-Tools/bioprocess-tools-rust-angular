import { Component,OnDestroy,OnInit } from '@angular/core';
import { SolutionService } from 'src/app/solution.service';
import { Form, FormBuilder,FormControl,FormGroup,ValidationErrors,ValidatorFn , Validators} from '@angular/forms';
import { Observable,Subscription } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { Solution } from 'src/app/shared/models/solution.model';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';


@Component({
  selector: 'app-super-calculator',
  templateUrl: './super-calculator.component.html',
  styleUrls: ['./super-calculator.component.scss'],
})
export class SuperCalculatorComponent implements OnInit, OnDestroy {
  bufferForm: FormGroup | undefined;
  solutionSubscription?: Subscription;

  saltCompounds: string[] = [];
  compounds: { [key: string]: any } = {};
  acid_compound_names: string[] = [];
  basic_compound_names: string[] = [];
  salt_compound_names: string[] = [];
  all_buffer_compound_names: string[] = [];

  first_compound_options: string[] = [];
  second_compound_options: string[] = [];
  third_compound_options: string[] = [];
  pH_adjusting_compound_options: string[] = ["Auto", "Sodium Hydroxide", "Potassium Hydroxide", "Hydrochloric Acid", "Sulfuric Acid"];

  example_solution: Solution;
  submitted: boolean = false;
  solution: Solution;
  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public solutionMixtureService: SolutionMixtureService
  ) {}

  ngOnInit(): void {






    this.acid_compound_names = this.solutionMixtureService.acidic_compounds;
    this.basic_compound_names = this.solutionMixtureService.basic_compounds;
    this.salt_compound_names = this.solutionMixtureService.salt_compounds;
    this.all_buffer_compound_names = this.solutionMixtureService.buffer_compounds



    this.compounds = this.solutionMixtureService.compounds;
    this.acid_compound_names = this.acid_compound_names.filter(
      (compound) =>
        compound !== 'Hydrochloric Acid' && compound != 'Sulfuric Acid'
    );
    this.basic_compound_names = this.basic_compound_names.filter(
      (compound) =>
        compound !== 'Sodium Hydroxide' && compound != 'Potassium Hydroxide'
    );
    this.salt_compound_names = this.salt_compound_names.filter(
      (compound) => compound !== 'Water'
    );



    this.first_compound_options = this.all_buffer_compound_names;
    this.second_compound_options = this.all_buffer_compound_names;
    this.third_compound_options = this.all_buffer_compound_names;
    this.initializeForm();
        this.solutionSubscription =
          this.solutionService.currentSolution.subscribe({
            next: (solution) => {
              if (solution) {
                this.example_solution = solution;
                this.solution = solution;
                 this.populateForm(this.solution);
              }
            },
          });
         
    this.bufferForm.get('buffer_compound1')?.valueChanges.subscribe({ 
      next: (value) => {
        this.second_compound_options = this.all_buffer_compound_names.filter(
          (compound) => compound !== value
        ).sort();
                              

        this.third_compound_options = this.all_buffer_compound_names
          .filter((compound) => compound !== value)
          .sort();
                        

      },
    });


        this.bufferForm.get('buffer_compound2')?.valueChanges.subscribe({
          next: (value) => {
            this.first_compound_options = this.all_buffer_compound_names
              .filter((compound) => compound !== value)
              .sort();




            this.third_compound_options = this.all_buffer_compound_names
              .filter((compound) => compound !== value)
              .sort();

          },
        });

                this.bufferForm
                  .get('buffer_compound3')
                  ?.valueChanges.subscribe({
                    next: (value) => {
                      this.second_compound_options =
                        this.all_buffer_compound_names
                          .filter((compound) => compound !== value)
                          .sort();



                      this.first_compound_options =
                        this.all_buffer_compound_names
                          .filter((compound) => compound !== value)
                          .sort();

                    },
                  });


      this.bufferForm.get('adjust_pH').valueChanges.subscribe((checked) => {
    const target_pH = this.bufferForm.get('target_pH');

    if (checked) {
      // If the checkbox is checked, enable the field and add the required validator
      target_pH.enable();
      target_pH.setValidators([Validators.required, Validators.min(2), Validators.max(10)]);
    } else {
      // If the checkbox is not checked, disable the field and remove the required validator
      target_pH.disable();
      target_pH.clearValidators();
    }

    // Update the validity state of the pH_adjust_compound field
    target_pH.updateValueAndValidity();
  });
}

  ngOnDestroy(): void {}

  initializeForm(): void {
    this.bufferForm = this.formBuilder.group({
      //need three buffer compounds, one salt compound and one pH_adjusting compound, and their concentrations, except for pH_adjusting compound
      buffer_compound1: new FormControl(this.acid_compound_names[0], [
        Validators.required,
      ]),

      concentration1: new FormControl(0.019, [
        Validators.required,
        Validators.min(0),
        Validators.max(0.4),
      ]),
      buffer_compound2: new FormControl(this.basic_compound_names[0], [
        Validators.required,
      ]),
      concentration2: new FormControl(0.019, [
        Validators.required,
        Validators.min(0),
        Validators.max(0.4),
      ]),
      buffer_compound3: new FormControl("None"),
      concentration3: new FormControl(0.0, [
        Validators.required,
        Validators.min(0),
        Validators.max(0.4),
      ]),
      salt_compound: new FormControl("None"),
      salt_concentration: new FormControl(0, [
        Validators.min(0),
        Validators.max(1),
      ]),

      //need target pH input from user
      target_pH: new FormControl(7),
      //check box for user to select if they want to adjust the pH
      adjust_pH: new FormControl(false),
      //if the user wants to adjust the pH, they need to input the pH_adjusting compound and its concentration
    });
    this.bufferForm.get('target_pH')?.disable();
  }

 populateForm(solution: Solution): void {
if(solution)
{
this.bufferForm.get('buffer_compound1')?.setValue(solution.non_salt_compounds[0].name);
this.bufferForm.get('buffer_compound2')?.setValue(solution.non_salt_compounds[1].name);
this.bufferForm.get('concentration1')?.setValue(solution.compound_concentrations[solution.non_salt_compounds[0].name].toPrecision(3));
this.bufferForm
  .get('concentration2')
  ?.setValue(
    solution.compound_concentrations[
      solution.non_salt_compounds[1].name
    ].toPrecision(3)
  );
if(solution.non_salt_compounds.length==3)
{
this.bufferForm.get('buffer_compound3')?.setValue(solution.non_salt_compounds[2].name);
this.bufferForm
  .get('concentration3')
  ?.setValue(
    solution.compound_concentrations[
      solution.non_salt_compounds[1].name
    ].toPrecision(3)
  );
}

if (solution.salt_compound ! = null) {
this.bufferForm.get('salt_compound')?.setValue(solution.salt_compound.name);
this.bufferForm
  .get('salt_concentration')
  ?.setValue(
    solution.compound_concentrations[solution.salt_compound.name].toPrecision(3)
  );
 }

 this.bufferForm.get('adjust_pH')?.setValue(true);
this.bufferForm.get('target_pH')?.setValue(solution.pH.toPrecision(3));
      this.bufferForm.get('target_pH').enable();
   this.bufferForm.get('target_pH').setValidators([
        Validators.required,
        Validators.min(2),
        Validators.max(10),
      ]);
this.bufferForm.updateValueAndValidity({onlySelf:false, emitEvent:true});
}
 }

  onSubmit(): void {
  let data = {
    compound_names: [],
    compound_concs: [],
    target_pH: null,
    salt_name: null,
    salt_conc: null,
    
  };

  // Add the compounds and their concentrations to the compound_names and compound_concs arrays
  ['buffer_compound1', 'buffer_compound2', 'buffer_compound3'].forEach((compound, i) => {
    if (this.bufferForm.get(compound).value !== 'None') {
      data.compound_names.push(this.bufferForm.get(compound).value);
      data.compound_concs.push(parseFloat(this.bufferForm.get(`concentration${i + 1}`).value));
    }
  });

  // Add the salt name and concentration
  if (this.bufferForm.get('salt_compound').value !== 'None') {
    data.salt_name = this.bufferForm.get('salt_compound').value;
    data.salt_conc = parseFloat(this.bufferForm.get('salt_concentration').value);
  }

  // Add the target pH
  if (this.bufferForm.get('adjust_pH').value) {
    data.target_pH = parseFloat(this.bufferForm.get('target_pH').value);

  }


  this.solutionService.super_calculate_pH(data).subscribe({
  next: (response) => {

  },
  error: (error) => {
    console.error('Error:', error);
  }
});
  }
}
