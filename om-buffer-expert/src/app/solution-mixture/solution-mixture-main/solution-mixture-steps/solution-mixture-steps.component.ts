import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { Solution } from 'src/app/shared/models/solution.model';
import { SolutionMixture } from 'src/app/shared/models/solution_mixture.model';
import { Step } from 'src/app/shared/models/step.model';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';

@Component({
  selector: 'app-solution-mixture-steps',
  templateUrl: './solution-mixture-steps.component.html',
  styleUrls: ['./solution-mixture-steps.component.scss'],
})
export class SolutionMixtureStepsComponent implements OnInit {
  // specify the template to be used for each action
  @ViewChild('TitrateSpecifiedVolumeofSolution')
  TitrateSpecifiedVolumeofSolution: TemplateRef<any>;
  @ViewChild('AddSpecifiedVolumeofSolution')
  AddSpecifiedVolumeofSolution: TemplateRef<any>;
  @ViewChild('AddSpecifiedVolumeofWater')
  AddSpecifiedVolumeofWater: TemplateRef<any>;
  @ViewChild('DilutetoRatioWater') DilutetoRatioWater: TemplateRef<any>;
  @ViewChild('AddWaterToTargetCompoundConcentration')
  AddWaterToTargetCompoundConcentration: TemplateRef<any>;
  @ViewChild('AddWaterToTargetIonConcentration')
  AddWaterToTargetIonConcentration: TemplateRef<any>;
  @ViewChild('AddSolutionToTargetIonConcentration')
  AddSolutionToTargetIonConcentration: TemplateRef<any>;
  @ViewChild('AddSolutionToTargetpH') AddSolutionToTargetpH: TemplateRef<any>;
  @ViewChild('ModifySolutionToTargetConcpH')
  ModifySolutionToTargetConcpH: TemplateRef<any>;

  // track which operation group is selected
  volumeAdditions = false;
  targetConc_pH = false;
  solutionModification = false;
  allPlotsData: any[] = [];
  allMeasurements: string[] = [];
  solution_mixture_steps_edit: SolutionMixture; //stores the solution mixture steps to be edited
  solution_names: string[] = []; //stores the solution names
  compound_names: string[] = []; //stores the compound names
  ion_names: string[] = []; //stores the ion names
  compound_allZero: boolean; //stores if all the compound concentrations are zero
  ion_allZero: boolean; //stores if all the ion concentrations are zero
  isSolutionMixtureEmpty: boolean; //stores if the solution mixture is empty
  selectedStepIndex: number | null = null; //stores the selected step index
  selectedTemplate: TemplateRef<any>; //stores the selected template
  isSelectedOperationGroup: boolean = false; //stores if the operation group is selected
  isSelectedActionVolume: boolean = false; //stores if the action is selected
  isSelectedActionTargetConc_pH: boolean = false; //stores if the action is selected
  isSelectedActionSolutionModification: boolean = false; //stores if the action is selected
  selectedOperationGroup = new FormControl() ; //stores the selected operation group
  selectedActionItem = new FormControl(); //stores the selected action item
  steps_list: Step[] = []; //stores the steps list
  solutions: Solution[] = []; //stores the solutions
  steps_list_unfiltered: Step[] = []; //stores the unfiltered steps list
  selected_operations_method = '';
  selected_parameters = {};
  volumeAdditionsActionsSelected = false; //stores if the volume additions actions are selected
  targetConc_pHActionsSelected = false; //stores if the target concentration and pH actions are selected
  solutionModificationActionsSelected = false; //stores if the solution modification actions are selected
  edit_step_index: number | null = null; //stores the edit step index
  add_edit_label = 'Add'; //stores the add edit label
  // form to be used for the current step
  currentStepForm = this.fb.group({});
  xMin: number = 0;
    xMax: number = 0;
    yMin: number = 0;
    yMax: number = 0;
  selectedMeasurement: string = '';
  solution_colors= ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
  phase_colors: string[] = [
    'rgba(216, 240, 229)',
    'rgba(253, 229, 212)',
    'rgba(229, 234, 243)',
    'rgba(249, 228, 240)',
    'rgba(242, 249, 228)',
    'rgba(255, 248, 214)',
    'rgba(248, 240, 229)',
    'rgba(229, 229, 229)'
  ];
  phase_colors_dark  = ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'];

  // stores the operations groups
  selectPlotData: any[] = [];
  operationGroups = [
    { id: 'volumeAdditions', displayName: 'Volume Adjustments' },
    {
      id: 'targetConc_pH',
      displayName: 'Target Compound, Ion Concentrations or pH',
    },
    {
      id: 'solutionModification',
      displayName: 'Target Ion Concentrations and pH',
    },
  ];
  // store the make solution operations
  operations_parameters = {
    'Get Buffer Solution': ['buffer_species'],
    'Get Buffer Solution with Salt': ['buffer_species', 'salt_compound_name'],
    'Get Stock Solution': ['compound_name'],
    'Make Stock Solution': ['compound_name', 'compound_conc'],
    'Make Water': [],
    'Make Solution with Buffer Species with salt to Target Concentration and pH':
      [
        'buffer_species',
        'target_conc',
        'target_pH',
        'salt_compound_name',
        'salt_conc',
      ],
    'Make Solution with Buffer Species to Target Concentration and pH': [
      'buffer_species',
      'target_conc',
      'target_pH',
    ],
    'Make Solution with Buffer Species and Salt and add acid or base to get to target pH':
      [
        'buffer_species',
        'target_conc',
        'target_pH',
        'salt_compound_name',
        'salt_conc',
        'acid_for_adjust',
        'base_for_adjust',
      ],
    'Add Solution': ['solution_name'],
    'Add Solution to Target Concentration of Compound Auto Pick Solution': [
      'compound_name',
      'target_conc',
    ],
  };

//build a combined structure that holds the following
// 1. the display name of the action
// 2. the id of the action
// 3. the parameters of the action
// 4. the template reference of the action
// 5. the form controls of the action
// 6. parameters of the action
// 7. operation method 
//8. main category of the action (volume, targetConc_pH, solutionModification )


action_structure = {
  'Titrate with Solution Name to Volume': {
    displayName: 'Titrate specified volume of solution',
    id: 'Titrate with Solution Name to Volume',
    parameters: ['solution_name', 'volume'],
    templateRef: 'TitrateSpecifiedVolumeofSolution',
    formControls: {
      solution_name: [''],
      volume: [0, Validators.required],
    },
    operationMethod: 'Titrate with Solution Name to Volume',
    mainCategory: 'volumeAdditions',
  },
  'Increase Volume of Solution Name': {
    displayName: 'Add specified volume of solution',
    id: 'Increase Volume of Solution Name',
    parameters: ['solution_name', 'volume_to_add'],
    templateRef: 'AddSpecifiedVolumeofSolution',
    formControls: {
      solution_name: [''],
      volume_to_add: [0, Validators.required],
    },
    operationMethod: 'Increase Volume of Solution Name',
    mainCategory: 'volumeAdditions',
  },
  'Dilute with Specified Volume of Water': {
    displayName: 'Add specified volume of water',
    id: 'Dilute with Specified Volume of Water',
    parameters: ['volume_to_add'],
    templateRef: 'AddSpecifiedVolumeofWater',
    formControls: {
      volume_to_add: [0, Validators.required],
    },
    operationMethod: 'Dilute with Specified Volume of Water',
    mainCategory: 'volumeAdditions',
  },
  'Dilute Solution Mixture with Water': {
    displayName: 'Dilute by a ratio with Water',
    id: 'Dilute Solution Mixture with Water',
    parameters: ['dilution_ratio'],
    templateRef: 'DilutetoRatioWater',
    formControls: {
      dilution_ratio: [0, Validators.required],
    },
    operationMethod: 'Dilute Solution Mixture with Water',
    mainCategory: 'volumeAdditions',
  },
  'Dilute Solution Mixture with Water to Target Compound Concentration': {
    displayName: 'Add water to target [compound]',
    id: 'Dilute Solution Mixture with Water to Target Compound Concentration',
    parameters: ['compound_name', 'target_conc'],
    templateRef: 'AddWaterToTargetCompoundConcentration',
    formControls: {
      compound_name: [''],
      target_conc: [0, Validators.required],
    },
    operationMethod: 'Dilute Solution Mixture with Water to Target Compound Concentration',
    mainCategory: 'targetConc_pH',
  },
  'Dilute Solution Mixture with Water to Target Ion Concentration': {
    displayName: 'Add water to target [ion]',
    id: 'Dilute Solution Mixture with Water to Target Ion Concentration',
    parameters: ['ion_name', 'target_conc'],
    templateRef: 'AddWaterToTargetIonConcentration',
    formControls: {
      ion_name: [''],
      target_conc: [0, Validators.required],
    },
    operationMethod: 'Dilute Solution Mixture with Water to Target Ion Concentration',
    mainCategory: 'targetConc_pH',
  },
  'Add Solution to Solution Mixture to Target Ion Concentration': {
    displayName: 'Add solution to target [ion]',
    id: 'Add Solution to Solution Mixture to Target Ion Concentration',
    parameters: ['solution_name', 'ion_name', 'target_conc'],
    templateRef: 'AddSolutionToTargetIonConcentration',
    formControls: {
      solution_name: [''],
      ion_name: [''],
      target_conc: [0, Validators.required],
    },
    operationMethod: 'Add Solution to Solution Mixture to Target Ion Concentration',
    mainCategory: 'targetConc_pH',
  },
  'Titrate with Specified Solution Name to pH': {
    displayName: 'Add solution to target pH',
    id: 'Titrate with Specified Solution Name to pH',
    parameters: ['solution_name', 'target_pH'],
    templateRef: 'AddSolutionToTargetpH',
    formControls: {
      solution_name: [''],
      target_pH: [0, Validators.required],
    },
    operationMethod: 'Titrate with Specified Solution Name to pH',
    mainCategory: 'targetConc_pH',
  },
  'Modify and Add Solution to achieve Target buffer species concentration, pH and dilution ratio': {
    displayName: 'Modify and add solution to target [ion] and pH',
    id: 'Modify and Add Solution to achieve Target buffer species concentration, pH and dilution ratio',
    parameters: ['solution_name', 'target_conc', 'target_pH', 'dilution_ratio'],
    templateRef: 'ModifySolutionToTargetConcpH',
    formControls: {
      solution_name: [''],
      target_conc: [0, Validators.required],
      target_pH: [0, Validators.required],
      dilution_ratio: [0, Validators.required],
    },
    operationMethod: 'Modify and Add Solution to achieve Target buffer species concentration, pH and dilution ratio',
    mainCategory: 'solutionModification',
  },
};



  volume_actions = [
    {
      id: 'Titrate with Solution Name to Volume',
      displayName: 'Titrate specified volume of solution',
      parameters: ['solution_name', 'volume'],
    },
    {
      id: 'Increase Volume of Solution Name',
      displayName: 'Add specified volume of solution',
      parameters: ['solution_name', 'volume_to_add'],
    },
    {
      id: 'Dilute with Specified Volume of Water',
      displayName: 'Add specified volume of water',
      parameters: ['volume_to_add'],
    },
    {
      id: 'Dilute Solution Mixture with Water',
      displayName: 'Dilute by a ratio with Water',
      parameters: ['dilution_ratio'],
    },
  ];

  target_conc_pH_actions = [
    {
      id: 'Dilute Solution Mixture with Water to Target Compound Concentration',
      displayName: 'Add water to target [compound]',
      parameters: ['compound_name', 'target_conc'],
    },
    {
      id: 'Dilute Solution Mixture with Water to Target Ion Concentration',
      displayName: 'Add water to target [ion]',
      parameters: ['ion_name', 'target_conc'],
    },
    {
      id: 'Add Solution to Solution Mixture to Target Ion Concentration',
      displayName: 'Add solution to target [ion]',
      parameters: ['solution_name', 'ion_name', 'target_conc'],
    },
    {
      id: 'Titrate with Specified Solution Name to pH',
      displayName: 'Add solution to target pH',
      parameters: ['solution_name', 'target_pH'],
    },
  ];

  solution_modification_actions = [
    {
      id: 'Modify and Add Solution to achieve Target buffer species concentration, pH and dilution ratio',
      displayName: 'Modify and add solution to target [ion] and pH',
      parameters: [
        'solution_name',
        'target_conc',
        'target_pH',
        'dilution_ratio',
      ],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private solutionMixtureService: SolutionMixtureService
  ) {}

  ngOnInit() {
    this.solutionMixtureService.Steps$.subscribe((steps) => {
      this.steps_list = steps;
      this.steps_list_unfiltered = steps;
    });

    this.getSolutionCompoundIonNames();
  }

  generateAllMeasurements(data) {
    // Assuming 'volume' and 'pH' are keys you want to exclude
    const excludedKeys = ['volume', 'pH'];
    
    this.allMeasurements = data.map(d => d.name);
  }

  formatKey(key: string): string {
    // Replace underscores with spaces
    let newKey = key.replace(/_/g, ' ');
  
    // Capitalize the first letter of each word
    newKey = newKey.replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
  
    return newKey;
  }
 
  


  onSelectionChange(event: MatChipSelectionChange) {
    let temp =[];
    this.selectedMeasurement = event.source.value;
    console.log('God selected measurement', this.selectedMeasurement);
    this.selectPlotData = [this.allPlotsData.find(plot => plot.name === this.selectedMeasurement)];
   // this.selectPlotData = [temp]
   //console.log('God selected plot data', this.selectPlotData);
   


console.log('God selected plot data', this.selectPlotData);
this.computeScale();
  }
  computeScale() {
    let xValues = [];
    let yValues = [];

    this.selectPlotData.forEach(series => {
      series.series.forEach(point => {
        xValues.push(point.x);
      yValues.push(point.y);
    });
});
  
  this.xMin = Math.min(...xValues);
  this.xMax = Math.max(...xValues);
  this.yMin = Math.min(...yValues);
   this.yMax = Math.max(...yValues);
  
    
  }



  getSolutionCompoundIonNames() {
    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
      (solutionMixture) => {
        if (solutionMixture) {
          // do something with solutionMixture
          this.solution_mixture_steps_edit = solutionMixture;
          this.prepareAllData(solutionMixture.data_dictionary);
          console.log(this.allPlotsData);
          //this.generateAllMeasurements(this.allPlotsData);
          const rValue = 1;
          this.allPlotsData.forEach(series => {
            // Add the rValue to each point in the series
            series.series.forEach(point => {
              point.r = rValue;
            });
          });
          this.solution_names = Object.keys(
            this.solution_mixture_steps_edit.solution_indices
          );
          this.solutions = this.solution_mixture_steps_edit.solutions;
          this.compound_names = Object.keys(
            this.solution_mixture_steps_edit.compound_concentrations
          );
          this.ion_names = Object.keys(
            this.solution_mixture_steps_edit.ion_concentrations
          );
          this.compound_allZero = this.compound_names.every(
            (key) =>
              this.solution_mixture_steps_edit.compound_concentrations[key] ===
              0
          );
          this.ion_allZero = this.ion_names.every(
            (key) =>
              this.solution_mixture_steps_edit.ion_concentrations[key] === 0
          );
          this.isSolutionMixtureEmpty =
            this.solution_mixture_steps_edit.volume === 0 &&
            this.compound_allZero &&
            this.ion_allZero;
        }
      }
    );
  }

  getParametersById(actions: any[], id: string) {
    const action = actions.find((action) => action.id === id);
    return action ? action.parameters : null;
  }

  getDisplayNameById(actions: any[], id: string) {
    const action = actions.find((action) => action.id === id);
    return action ? action.displayName : null;
  }

  getTemplateById(actions: any[], id: string) {
    const action = actions.find((action) => action.id === id);
    return action ? action.templateRef : null;
  }

  onOperationGroupSelect(event: MatChipSelectionChange) {
    this.selectedStepIndex = null;
    console.log("god event", event);
    const id = event.source.value;
    if (event.source.selected) {
      //this.selectedOperationGroup.setValue(id);
      this.volumeAdditionsActionsSelected = false;
      this.targetConc_pHActionsSelected = false;
      this.solutionModificationActionsSelected = false;


    if (id === 'volumeAdditions') {
      this.volumeAdditions = true;
      this.targetConc_pH = false;
      this.solutionModification = false;
      console.log('God volume additions chosen', this.volumeAdditions);
    }
    if (id === 'targetConc_pH') {
      this.targetConc_pH = true;
      this.volumeAdditions = false;
      this.solutionModification = false;
      console.log('God targetConc_pH chosen', this.targetConc_pH);
    }
    if (id === 'solutionModification') {
      this.solutionModification = true;
      this.volumeAdditions = false;
      this.targetConc_pH = false;
      console.log('God solutionModification chosen', this.solutionModification);
    }}
    else {
      this.selectedOperationGroup.setValue(null);
      this.volumeAdditions = false;
      this.targetConc_pH = false;
      this.solutionModification = false;
    }
  }

  form_config_volume_actions = {
    'Titrate specified volume of solution': {
      formControls: {
        solution_name: [''],
        volume: [100, [Validators.required, Validators.min(1)]],
      },
      templateRef: 'TitrateSpecifiedVolumeofSolution',
    },

    'Add specified volume of solution': {
      formControls: {
        solution_name: [''],
        volume_to_add:  [100, [Validators.required, Validators.min(1)]],
      },
      templateRef: 'AddSpecifiedVolumeofSolution',
    },
    'Add specified volume of water': {
      formControls: {
        volume_to_add:  [100, [Validators.required, Validators.min(1)]],
      },
      templateRef: 'AddSpecifiedVolumeofWater',
    },
    'Dilute by a ratio with Water': {
      formControls: {
        dilution_ratio:  [1, [Validators.required, Validators.min(.001)]],
      },
      templateRef: 'DilutetoRatioWater',
    },
  };

  form_config_target_conc_pH_actions = {
    'Add water to target [compound]': {
      formControls: {
        compound_name: [''],
        target_conc: [0.05, [Validators.required, Validators.min(.001)]],
      },
      templateRef: 'AddWaterToTargetCompoundConcentration',
    },
    'Add water to target [ion]': {
      formControls: {
        ion_name: [''],
        target_conc: [0.05, [[Validators.required, Validators.min(.001)]]],
      },
      templateRef: 'AddWaterToTargetIonConcentration',
    },
    'Add solution to target [ion]': {
      formControls: {
        solution_name: [''],
        ion_name: [''],
        target_conc: [0.05, [Validators.required, Validators.min(.001)]],
      },
      templateRef: 'AddSolutionToTargetIonConcentration',
    },
    'Add solution to target pH': {
      formControls: {
        solution_name: [''],
        target_pH: [2, [Validators.required, Validators.min(2),Validators.max(12)]],
      },
      templateRef: 'AddSolutionToTargetpH',
    },
  };

  form_config_solution_modification_actions = {
    'Modify and add solution to target [ion] and pH': {
      formControls: {
        solution_name: [''],
        target_conc: [0.05, [Validators.required, Validators.min(.001)]],
        target_pH: [2, [Validators.required, Validators.min(2),Validators.max(12)]],
        dilution_ratio: [.05, [Validators.required, , Validators.min(.002),Validators.max(1)]],
      },
      templateRef: 'ModifySolutionToTargetConcpH',
    },
  };



  onVolumeActionSelect(event: MatChipSelectionChange) {
    this.selectedStepIndex = null;
    const id = event.source.value;
    console.log(
      'God-parameters',
      this.getParametersById(this.volume_actions, id)
    );
    // console.log("God-id",this.volume_actions[id].id);
    // console.log("God-parameters",this.volume_actions[id].parameters);
    if(event.source.selected){
     // this.selectedActionItem.setValue(id);
    this.volumeAdditionsActionsSelected = true;
    this.targetConc_pHActionsSelected = false;
    this.solutionModificationActionsSelected = false;

    const config =
      this.form_config_volume_actions[
        this.getDisplayNameById(this.volume_actions, id)
      ];
    this.currentStepForm = this.fb.group(config.formControls);
    this.selected_operations_method = id;
    this.selected_parameters = this.getParametersById(this.volume_actions, id);
    console.log('God', config.templateRef);
    this.selectedTemplate = this[config.templateRef];
    console.log(this.currentStepForm);
  }
  else{
    //this.selectedActionItem.setValue(null);
    this.volumeAdditionsActionsSelected = false;
    this.targetConc_pHActionsSelected = false;
    this.solutionModificationActionsSelected = false;

  }
}

  onTargetConc_pHActionSelect(event: MatChipSelectionChange) {
    this.selectedStepIndex = null;
    const id = event.source.value;
    if(event.source.selected){
      //this.selectedActionItem.setValue(id);
    this.volumeAdditionsActionsSelected = false;
    this.targetConc_pHActionsSelected = true;
    this.solutionModificationActionsSelected = false;

    const config =
      this.form_config_target_conc_pH_actions[
        this.getDisplayNameById(this.target_conc_pH_actions, id)
      ];
    this.currentStepForm = this.fb.group(config.formControls);
    this.selected_operations_method = id;
    this.selected_parameters = this.getParametersById(
      this.target_conc_pH_actions,
      id
    );
    this.selectedTemplate = this[config.templateRef];
    }
    else{
      //this.selectedActionItem.setValue(null);
      this.volumeAdditionsActionsSelected = false;
      this.targetConc_pHActionsSelected = false;
      this.solutionModificationActionsSelected = false;
 
    }
  }

  onSolutionModificationActionSelect(event: MatChipSelectionChange) {
    this.selectedStepIndex = null;
    const id = event.source.value;
    if(event.source.selected){
     // this.selectedActionItem.setValue(id);
    this.solutionModificationActionsSelected = true;
    this.volumeAdditionsActionsSelected = false;
    this.targetConc_pHActionsSelected = false;
    const config =
      this.form_config_solution_modification_actions[
        this.getDisplayNameById(this.solution_modification_actions, id)
      ];
    this.currentStepForm = this.fb.group(config.formControls);
    this.selected_operations_method = id;
    this.selected_parameters = this.getParametersById(
      this.solution_modification_actions,
      id
    );
    this.selectedTemplate = this[config.templateRef];

    console.log(id);
    }
    else{
     // this.selectedActionItem.setValue(null);
      this.volumeAdditionsActionsSelected = false;
      this.targetConc_pHActionsSelected = false;
      this.solutionModificationActionsSelected = false;
      
    }
  }

  getFormControls(): string[] {
    return this.currentStepForm
      ? Object.keys(this.currentStepForm.controls)
      : [];
  }

  onSubmit() {
    console.log(this.currentStepForm.value);
    this.selected_parameters = this.currentStepForm.value;
    console.log('God param', this.selected_parameters);
    if (this.edit_step_index == null) {

      this.steps_list.push(
        new Step(
          this.steps_list.length + 1,
          this.selected_operations_method,
          this.selected_parameters,
        )
      );
      this.steps_list[this.steps_list.length - 1].category= this.action_structure[this.selected_operations_method].mainCategory;
      Step.evaluateEffectOfOperationStep(this.solution_mixture_steps_edit, this.steps_list[this.steps_list.length - 1], this.steps_list);
      console.log('God - add step:', this.steps_list);
      this.selectedStepIndex= this.steps_list.length - 1;
  
      // this.steps_list.push(this.currentStepForm.value);
      console.log('God - add step:', this.steps_list);
        }
    else {
      console.log("God - edit step index", this.edit_step_index);
      this.steps_list[this.edit_step_index].operation_method = this.selected_operations_method;
      this.steps_list[this.edit_step_index].parameters = this.selected_parameters;
      Step.evaluateEffectOfOperationStep(this.solution_mixture_steps_edit, this.steps_list[this.edit_step_index], this.steps_list);
      this.selectedStepIndex= this.steps_list.length - 1;
      console.log('God - edit step:', this.steps_list);
      this.edit_step_index = null;
      this.add_edit_label = 'Add';
      this.volumeAdditionsActionsSelected = false;
      this.targetConc_pHActionsSelected = false;
      this.solutionModificationActionsSelected = false;
      this.volumeAdditions = false;
      this.targetConc_pH = false;
      this.solutionModification = false;
      this.selectedOperationGroup.setValue(null);
    }

  }

  onExecute() {
    console.log('God subscribed list', this.steps_list);
    this.solutionMixtureService.postStepswithTrigger();
  }

  getSolutionbyName(name: string) {
    let assoc_solution: Solution= null
    this.solutions.forEach((solution) => {
      if (solution.name === name) {
        assoc_solution = solution;
      }
    });
    return assoc_solution;
  }

  removeStep(i: number) {
    this.steps_list = this.steps_list.filter(s => s !== this.steps_list[i]);
    console.log("God this is the slist now", this.steps_list)
    this.solutionMixtureService.StepsSubject.next(this.steps_list)
    console.log("God this is the slist after", this.steps_list)
    this.selectedActionItem.setValue(null);
    this.selectedOperationGroup.setValue(null);
    if (this.steps_list.length > 0) {
      this.selectedStepIndex = this.steps_list.length-1;
      //this.editStep(this.steps_list.length-1);
    }

  }

  onSelectItem(i: number) {
    this.selectedStepIndex = i;
    //this.edit_step_index = i;
   // this.add_edit_label = 'Update';
    this.selected_operations_method = this.steps_list[i].operation_method;
    console.log('God edit step:', this.steps_list[i].operation_method);
    console.log('God edit step:', this.steps_list[i].parameters);
    this.selectedOperationGroup.setValue(this.action_structure[this.steps_list[i].operation_method].mainCategory);
    this.selectedActionItem.setValue(this.action_structure[this.steps_list[i].operation_method].id);
    this.selectedTemplate = this[this.action_structure[this.steps_list[i].operation_method].templateRef];
    console.log('God edit step after template:', this.steps_list[i].parameters);
    this.volumeAdditionsActionsSelected=true;
    this.selectedStepIndex=i;
    this.currentStepForm = this.fb.group(this.action_structure[this.steps_list[i].operation_method].formControls);
    this.currentStepForm.patchValue(this.steps_list[i].parameters);
    console.log('God edit step:', this.currentStepForm);
    
  }

  onCancelEdit(i:number) {
    this.selectedStepIndex=i
    console.log('God selected step index:', this.selectedStepIndex);
    this.edit_step_index = null;
    this.add_edit_label = 'Add';
    this.currentStepForm= this.fb.group(this.action_structure[this.steps_list[i].operation_method].formControls);
/*     this.volumeAdditionsActionsSelected = false;
    this.targetConc_pHActionsSelected = false;
    this.solutionModificationActionsSelected = false;
    this.volumeAdditions = false;
    this.targetConc_pH = false;
    this.solutionModification = false;
    this.selectedOperationGroup.setValue(null); */
  }

  editStep(i: number) {
    this.edit_step_index = i;
    this.add_edit_label = 'Update';
    this.selected_operations_method = this.steps_list[i].operation_method;
    console.log('God edit step:', this.steps_list[i].operation_method);
    console.log('God edit step:', this.steps_list[i].parameters);
    this.selectedOperationGroup.setValue(this.action_structure[this.steps_list[i].operation_method].mainCategory);
    this.selectedActionItem.setValue(this.action_structure[this.steps_list[i].operation_method].id);
    this.selectedTemplate = this[this.action_structure[this.steps_list[i].operation_method].templateRef];
    console.log('God edit step after template:', this.steps_list[i].parameters);
    this.volumeAdditionsActionsSelected=true;
    this.currentStepForm = this.fb.group(this.action_structure[this.steps_list[i].operation_method].formControls);
    this.currentStepForm.patchValue(this.steps_list[i].parameters);
    console.log('God edit step:', this.currentStepForm);
    //this.currentStepForm = this.fb.group(this.steps_list[i].parameters);
  }

  prepareScatterPlotData(data, measurementName: string) {
    return {
      name: measurementName,
      series: data.volume.map((volume, index) => ({
        name: `${volume}`,
        x: volume,
        y: data[measurementName][index]
      }))
    };
  }

  prepareAllData(data) {
    this.allPlotsData = [];
    const keys = Object.keys(data);
    const volumeIndex = keys.indexOf('volume');
    const pHIndex = keys.indexOf('pH');
    // Assuming 'volume' and 'pH' are not part of compounds/ions
    keys.splice(volumeIndex, 1);
    
  
    keys.forEach(key => {
      const plotData = this.prepareScatterPlotData(data, key);
      this.allPlotsData.push(plotData);
    });
  }


}
