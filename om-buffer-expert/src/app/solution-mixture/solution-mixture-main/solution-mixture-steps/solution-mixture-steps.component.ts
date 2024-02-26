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
  selected_operations_method = '';
  selected_parameters = {};
  volumeAdditionsActionsSelected = false; //stores if the volume additions actions are selected
  targetConc_pHActionsSelected = false; //stores if the target concentration and pH actions are selected
  solutionModificationActionsSelected = false; //stores if the solution modification actions are selected
  // form to be used for the current step
  currentStepForm = this.fb.group({});
  // stores the operations groups
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
      this.steps_list = steps.filter(step => step.category !== 'Make');
    });

    this.getSolutionCompoundIonNames();
  }

  getSolutionCompoundIonNames() {
    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
      (solutionMixture) => {
        if (solutionMixture) {
          // do something with solutionMixture
          this.solution_mixture_steps_edit = solutionMixture;
          this.solution_names = Object.keys(
            this.solution_mixture_steps_edit.solution_indices
          );
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
        volume: [0, Validators.required],
      },
      templateRef: 'TitrateSpecifiedVolumeofSolution',
    },

    'Add specified volume of solution': {
      formControls: {
        solution_name: [''],
        volume_to_add: [0, Validators.required],
      },
      templateRef: 'AddSpecifiedVolumeofSolution',
    },
    'Add specified volume of water': {
      formControls: {
        volume_to_add: [0, Validators.required],
      },
      templateRef: 'AddSpecifiedVolumeofWater',
    },
    'Dilute by a ratio with Water': {
      formControls: {
        dilution_ratio: [0, Validators.required],
      },
      templateRef: 'DilutetoRatioWater',
    },
  };

  form_config_target_conc_pH_actions = {
    'Add water to target [compound]': {
      formControls: {
        compound_name: [''],
        target_conc: [0, Validators.required],
      },
      templateRef: 'AddWaterToTargetCompoundConcentration',
    },
    'Add water to target [ion]': {
      formControls: {
        ion_name: [''],
        target_conc: [0, Validators.required],
      },
      templateRef: 'AddWaterToTargetIonConcentration',
    },
    'Add solution to target [ion]': {
      formControls: {
        solution_name: [''],
        ion_name: [''],
        target_conc: [0, Validators.required],
      },
      templateRef: 'AddSolutionToTargetIonConcentration',
    },
    'Add solution to target pH': {
      formControls: {
        solution_name: [''],
        target_pH: [0, Validators.required],
      },
      templateRef: 'AddSolutionToTargetpH',
    },
  };

  form_config_solution_modification_actions = {
    'Modify and add solution to target [ion] and pH': {
      formControls: {
        solution_name: [''],
        target_conc: [0, Validators.required],
        target_pH: [0, Validators.required],
        dilution_ratio: [0, Validators.required],
      },
      templateRef: 'ModifySolutionToTargetConcpH',
    },
  };



  onVolumeActionSelect(event: MatChipSelectionChange) {

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
    this.steps_list.push(
      new Step(
        this.steps_list.length + 1,
        this.selected_operations_method,
        this.selected_parameters,
      )
    );
    this.steps_list[this.steps_list.length - 1].category= this.action_structure[this.selected_operations_method].mainCategory;
    this.selectedStepIndex= this.steps_list.length - 1;
    // this.steps_list.push(this.currentStepForm.value);
    console.log('God - add step:', this.steps_list);
  }

  onExecute() {
    console.log('God subscribed list', this.steps_list);
    this.solutionMixtureService.postStepswithTrigger(this.steps_list);
  }

  removeStep(i: number) {
    this.steps_list = this.steps_list.filter(s => s !== this.steps_list[i]);
    this.selectedActionItem.setValue(null);
    this.selectedOperationGroup.setValue(null);
    if (this.steps_list.length > 0) {
      this.selectedStepIndex = this.steps_list.length-1;
      this.editStep(this.steps_list.length-1);
    }

  }

  onSelectItem(i: number) {
    this.selectedStepIndex = i;
    this.editStep(i);
  }

  editStep(i: number) {
    console.log('God edit step:', this.steps_list[i].operation_method);
    this.selectedOperationGroup.setValue(this.action_structure[this.steps_list[i].operation_method].mainCategory);
    this.selectedActionItem.setValue(this.action_structure[this.steps_list[i].operation_method].id);
    this.selectedTemplate = this[this.action_structure[this.steps_list[i].operation_method].templateRef];
    this.volumeAdditionsActionsSelected=true;
    this.currentStepForm = this.fb.group(this.action_structure[this.steps_list[i].operation_method].formControls);
    this.currentStepForm.patchValue(this.steps_list[i].parameters);
    //this.currentStepForm = this.fb.group(this.steps_list[i].parameters);
  }
}
