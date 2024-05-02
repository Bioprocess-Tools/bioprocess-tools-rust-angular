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

  constructor(
    private formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public solutionMixtureService: SolutionMixtureService
  ) {}

  ngOnInit(): void {


    this.solutionSubscription = this.solutionService.currentSolution.subscribe({
      next: (solution) => {
        if (solution) {
          this.example_solution = solution;
        }
      },
    });

    // console.log("God acid option 1",this.acidCompounds)

    this.compounds = this.solutionMixtureService.compounds;
    this.acid_compound_names = this.compounds['A'].filter(
      (compound) =>
        compound !== 'Hydrochloric Acid' && compound != 'Sulfuric Acid'
    );
    this.basic_compound_names = this.compounds['B'].filter(
      (compound) =>
        compound !== 'Sodium Hydroxide' && compound != 'Potassium Hydroxide'
    );
    this.salt_compound_names = this.compounds['S'].filter(
      (compound) => compound !== 'Water'
    );
    this.all_buffer_compound_names = this.acid_compound_names.concat(
      this.basic_compound_names
    );


    this.first_compound_options = this.all_buffer_compound_names;
    this.second_compound_options = this.all_buffer_compound_names;
    this.third_compound_options = this.all_buffer_compound_names;
    this.initializeForm();
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




    console.log('God acids', this.acid_compound_names);
    console.log('God bases', this.basic_compound_names);
    console.log('God salts', this.salt_compound_names);
    console.log('God buffers', this.all_buffer_compound_names);
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
      concentration3: new FormControl(0.019, [
        Validators.required,
        Validators.min(0),
        Validators.max(0.4),
      ]),
      salt_compound: new FormControl("None"),
      salt_concentration: new FormControl(0, [
        Validators.min(0),
        Validators.max(1),
      ]),
      pH_adjusting_compound: new FormControl('None' ),
      //need target pH input from user
      target_pH: new FormControl(7, [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
      //check box for user to select if they want to adjust the pH
      adjust_pH: new FormControl(false),
      //if the user wants to adjust the pH, they need to input the pH_adjusting compound and its concentration
    });
  }

  onSubmit(): void {
  let data = {
    compound_names: [],
    compound_concs: [],
    target_pH: null,
    salt_name: null,
    salt_conc: null,
    pH_adjust_compound: null
  };

  // Add the compounds and their concentrations to the compound_names and compound_concs arrays
  ['buffer_compound1', 'buffer_compound2', 'buffer_compound3'].forEach((compound, i) => {
    if (this.bufferForm.get(compound).value !== 'None') {
      data.compound_names.push(this.bufferForm.get(compound).value);
      data.compound_concs.push(this.bufferForm.get(`concentration${i + 1}`).value);
    }
  });

  // Add the salt name and concentration
  if (this.bufferForm.get('salt_compound').value !== 'None') {
    data.salt_name = this.bufferForm.get('salt_compound').value;
    data.salt_conc = this.bufferForm.get('salt_concentration').value;
  }

  // Add the target pH
  if (this.bufferForm.get('adjust_pH').value) {
    data.target_pH = this.bufferForm.get('target_pH').value;
    data.pH_adjust_compound = this.bufferForm.get('pH_adjusting_compound').value;
  }

  console.log('Got here 2', data);
  this.solutionService.super_calculate_pH(data).subscribe({
  next: (response) => {
    console.log('Response received:', response);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
  }
}
