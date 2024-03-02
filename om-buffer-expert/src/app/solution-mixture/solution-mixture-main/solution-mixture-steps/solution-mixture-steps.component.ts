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
  selectedMeasurement: string = '';
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


  onPlotOM()

  {
/*     this.selectPlotData = [{
      "name": "Germany",
      "series": [
        {
          "name": "1",
          "x": 50,
          "y": 80.3,

        },
        {
          "name": "1",
          "x": 80,
          "y": 80.3,

        },
        {
          "name": "1",
          "x": 100,
          "y": 75.4,

        }
      ]
    }
    ]; */

    this.selectPlotData =[
      {
          "name": "Acetate",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.05
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0.045454545454545456
              }
          ]
      }
      
      
      
      
      ,
      {
          "name": "Acetic Acid",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.023349677372392526
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0.02122697942944775
              }
          ]
      },
      {
          "name": "Arginine",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0
              }
          ]
      },
      {
          "name": "Arginine Base",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0
              }
          ]
      },
      {
          "name": "Arginine Chloride",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0
              }
          ]
      },
      {
          "name": "Chloride",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.05
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0.05
              }
          ]
      },
      {
          "name": "Sodium",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.02665032262760748
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0.024227566025097708
              }
          ]
      },
      {
          "name": "Sodium Acetate",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.02665032262760748
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0.024227566025097708
              }
          ]
      },
      {
          "name": "Sodium Chloride",
          "series": [
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.05
              },
              {
                  "name": "118",
                  "x": 118,
                  "y": 0.05
              }
          ]
      }
  ]
  
  
  
  let god2 = [
      {
          "name": "Acetate",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.05
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.045454545454545456
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.05
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.05
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.04950495049504951
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.049019607843137254
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.04854368932038835
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.04807692307692308
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.047619047619047616
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.04716981132075472
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.04672897196261682
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.046296296296296294
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.045871559633027525
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.045454545454545456
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.05
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.05
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.04950495049504951
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.049019607843137254
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.04854368932038835
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.04807692307692308
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.047619047619047616
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.04716981132075472
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0.04672897196261682
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0.046296296296296294
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.045871559633027525
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.045454545454545456
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.05
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.05
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.04950495049504951
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.049019607843137254
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.04854368932038835
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.04807692307692308
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.047619047619047616
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.04716981132075472
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.04672897196261682
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.046296296296296294
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.045871559633027525
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.045454545454545456
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.05
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.05
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.04950495049504951
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.049019607843137254
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.04854368932038835
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.04807692307692308
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.047619047619047616
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.04716981132075472
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.04672897196261682
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.046296296296296294
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.045871559633027525
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.045454545454545456
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.05
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.05
              }
          ]
      },
      {
          "name": "Acetic Acid",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.023349677372392526
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.02122697942944775
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.022873399052933684
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.022873399052933684
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.022646929755379887
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.022424901032287926
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.022207183546537557
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.02199365293551316
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.021784189574222557
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.02157867835182423
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.021377008460685687
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.02117907319716082
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.020984769773333654
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.020793999139030624
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.022873399052933684
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.022873399052933684
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.022646929755379887
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.022424901032287926
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.022207183546537557
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.02199365293551316
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.021784189574222557
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.02157867835182423
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0.021377008460685687
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0.02117907319716082
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.020984769773333654
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.020793999139030624
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.022873399052933684
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.022873399052933684
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.022646929755379887
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.022424901032287926
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.022207183546537557
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.02199365293551316
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.021784189574222557
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.02157867835182423
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.021377008460685687
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.02117907319716082
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.020984769773333654
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.020793999139030624
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.022873399052933684
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.022873399052933684
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.022646929755379887
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.022424901032287926
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.022207183546537557
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.02199365293551316
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.021784189574222557
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.02157867835182423
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.021377008460685687
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.02117907319716082
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.020984769773333654
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.020793999139030624
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.022873399052933684
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.022873399052933684
              }
          ]
      },
      {
          "name": "Arginine",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.0004950495049504951
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.000980392156862745
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.0014563106796116507
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.0019230769230769232
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.002380952380952381
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.0028301886792452833
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.0032710280373831778
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.003703703703703704
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.004128440366972477
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.004545454545454545
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.0049549549549549555
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.005357142857142858
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.005752212389380531
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.006140350877192983
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.006521739130434782
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.006896551724137932
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.007264957264957266
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.007627118644067797
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.007983193277310925
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.008333333333333333
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.0025
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.004761904761904762
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.00681818181818182
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.008695652173913044
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.010416666666666666
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.012000000000000002
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.013461538461538462
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.014814814814814815
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.016071428571428573
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.017241379310344827
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.018333333333333333
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.019354838709677424
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.0203125
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.021212121212121213
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.022058823529411766
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.022857142857142857
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.023611111111111114
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.024324324324324326
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.025
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.02564102564102564
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.026250000000000002
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.02682926829268293
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.027380952380952384
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.02790697674418605
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.028409090909090908
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.02888888888888889
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.029347826086956522
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.029787234042553193
              }
          ]
      },
      {
          "name": "Arginine Base",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.00022650266717581203
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.0004485641055834709
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.0006663136714006897
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.0008798757455675775
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.001089369970702715
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.0012949114746088875
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.001496611081245786
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.001694575509982001
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.0018889075638790196
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.0020797063077051836
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.002267067236327272
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.0024510824340811086
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.0026318407256800103
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.002809427819180686
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.0029839264414900455
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.003155416466863037
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.0033239750388108485
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.0034896766858103926
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.0036525934311796918
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.003812794897459503
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.0011438384692378507
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.00217873994140543
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.0031195594615577747
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.003978568588653394
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.004765993621824379
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.005490424652341683
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.0061591302189730425
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.006778302039928004
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.007353247302243327
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.007888541167157592
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.008388148774410907
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.008855523632809167
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.009293687562557537
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.009705296102624189
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.010092692375628095
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.010457951718746064
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.010802918876135258
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.011129239160152063
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.011438384692378508
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.011731676607567701
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.012010303926997434
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.01227533966986962
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.012527754663081224
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.012768429424050426
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.012998164423157394
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.013217688977859608
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.013427668986705204
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.013628713676025455
              }
          ]
      },
      {
          "name": "Arginine Chloride",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.00026854683777468306
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.0005318280512792743
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.0007899970082109607
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.0010432011775093457
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.0012915824102496662
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.0015352772046363953
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.0017744169561373915
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.0020091281937217025
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.002239532803093458
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.0024657482377493625
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.0026878877186276833
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.002906060423061748
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.0031203716637005206
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.0033309230580122963
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.0035378126889447376
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.0037411352572748946
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.003940982226146417
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.004137441958257405
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.004330599846131233
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.004520538435873831
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.0013561615307621493
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.002583164820499332
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.003698622356624043
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.00471708358525965
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.005650673044842289
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.006509575347658316
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.007302408242565419
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.00803651277488681
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.008718181269185245
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.009352838143187237
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.009945184558922428
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.010499315076868252
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.011018812437442464
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.011506825109497024
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.011966131153783671
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.012399191138396794
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.012808192234975854
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.013195085164172265
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.013561615307621493
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.013909349033457943
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.014239696073002567
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.01455392862281331
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.01485319771787116
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.01513854732013562
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.015410926485933514
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.01567119991102928
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.01592015710025132
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.016158520366527738
              }
          ]
      },
      {
          "name": "Chloride",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.05
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.05
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.04950495049504951
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.049019607843137254
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.04854368932038835
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.04807692307692308
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.047619047619047616
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.04716981132075472
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.04672897196261682
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.046296296296296294
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.045871559633027525
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.045454545454545456
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.05
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.05
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.04950495049504951
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.049019607843137254
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.04854368932038835
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.04807692307692308
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.047619047619047616
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.04716981132075472
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.04672897196261682
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.046296296296296294
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0.045871559633027525
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0.045454545454545456
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.05
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.05
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.04950495049504951
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.049019607843137254
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.04854368932038835
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.04807692307692308
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.047619047619047616
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.04716981132075472
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.04672897196261682
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.046296296296296294
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.045871559633027525
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.045454545454545456
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.05
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.05
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.04950495049504951
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.049019607843137254
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.04854368932038835
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.04807692307692308
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.047619047619047616
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.04716981132075472
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.04672897196261682
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.046296296296296294
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.045871559633027525
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.045454545454545456
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.05
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.05
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.04950495049504951
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.049019607843137254
              }
          ]
      },
      {
          "name": "Sodium",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.02665032262760748
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.024227566025097708
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.07712660094706632
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.07712660094706632
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.0793332682644221
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.08149666759516305
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.08361805917190904
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.08569865475679453
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.08773961994958697
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.0897420763651569
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.09170710368884702
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.093635741617654
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.09552899169455625
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.09738781904278755
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.07712660094706632
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.07712660094706632
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.0793332682644221
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.08149666759516305
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.08361805917190904
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.08569865475679453
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.08773961994958697
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.0897420763651569
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0.09170710368884702
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0.093635741617654
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.09552899169455625
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.09738781904278755
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.07712660094706632
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.07712660094706632
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.0793332682644221
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.08149666759516305
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.08361805917190904
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.08569865475679453
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.08773961994958697
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.0897420763651569
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.09170710368884702
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.093635741617654
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.09552899169455625
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.09738781904278755
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.07712660094706632
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.07712660094706632
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.0793332682644221
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.08149666759516305
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.08361805917190904
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.08569865475679453
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.08773961994958697
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.0897420763651569
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.09170710368884702
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.093635741617654
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.09552899169455625
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.09738781904278755
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.07712660094706632
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.07712660094706632
              }
          ]
      },
      {
          "name": "Sodium Acetate",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.02665032262760748
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.024227566025097708
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.02712660094706632
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.02712660094706632
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.026858020739669624
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.02659470681084933
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.026336505773850796
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.026083270141409924
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.025834858044825066
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.02559113296893049
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.02535196350193114
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.025117223099135482
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.02488678985969387
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.024660546315514835
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.02712660094706632
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.02712660094706632
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.026858020739669624
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.02659470681084933
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.026336505773850796
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.026083270141409924
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.025834858044825066
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.02559113296893049
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0.02535196350193114
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0.025117223099135482
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.02488678985969387
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.024660546315514835
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.02712660094706632
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.02712660094706632
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.026858020739669624
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.02659470681084933
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.026336505773850796
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.026083270141409924
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.025834858044825066
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.02559113296893049
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.02535196350193114
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.025117223099135482
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.02488678985969387
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.024660546315514835
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.02712660094706632
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.02712660094706632
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.026858020739669624
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.02659470681084933
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.026336505773850796
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.026083270141409924
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.025834858044825066
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.02559113296893049
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.02535196350193114
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.025117223099135482
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.02488678985969387
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.024660546315514835
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.02712660094706632
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.02712660094706632
              }
          ]
      },
      {
          "name": "Sodium Chloride",
          "series": [
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.05
              },
              {
                  "name": "10",
                  "x": 10,
                  "y": 0.05
              },
              {
                  "name": "11",
                  "x": 11,
                  "y": 0.04950495049504951
              },
              {
                  "name": "12",
                  "x": 12,
                  "y": 0.049019607843137254
              },
              {
                  "name": "13",
                  "x": 13,
                  "y": 0.04854368932038835
              },
              {
                  "name": "14",
                  "x": 14,
                  "y": 0.04807692307692308
              },
              {
                  "name": "15",
                  "x": 15,
                  "y": 0.047619047619047616
              },
              {
                  "name": "16",
                  "x": 16,
                  "y": 0.04716981132075472
              },
              {
                  "name": "17",
                  "x": 17,
                  "y": 0.04672897196261682
              },
              {
                  "name": "18",
                  "x": 18,
                  "y": 0.046296296296296294
              },
              {
                  "name": "19",
                  "x": 19,
                  "y": 0.045871559633027525
              },
              {
                  "name": "20",
                  "x": 20,
                  "y": 0.045454545454545456
              },
              {
                  "name": "21",
                  "x": 21,
                  "y": 0.05
              },
              {
                  "name": "22",
                  "x": 22,
                  "y": 0.05
              },
              {
                  "name": "23",
                  "x": 23,
                  "y": 0.04950495049504951
              },
              {
                  "name": "24",
                  "x": 24,
                  "y": 0.049019607843137254
              },
              {
                  "name": "25",
                  "x": 25,
                  "y": 0.04854368932038835
              },
              {
                  "name": "26",
                  "x": 26,
                  "y": 0.04807692307692308
              },
              {
                  "name": "27",
                  "x": 27,
                  "y": 0.047619047619047616
              },
              {
                  "name": "28",
                  "x": 28,
                  "y": 0.04716981132075472
              },
              {
                  "name": "29",
                  "x": 29,
                  "y": 0.04672897196261682
              },
              {
                  "name": "30",
                  "x": 30,
                  "y": 0.046296296296296294
              },
              {
                  "name": "31",
                  "x": 31,
                  "y": 0.045871559633027525
              },
              {
                  "name": "32",
                  "x": 32,
                  "y": 0.045454545454545456
              },
              {
                  "name": "33",
                  "x": 33,
                  "y": 0.05
              },
              {
                  "name": "34",
                  "x": 34,
                  "y": 0.05
              },
              {
                  "name": "35",
                  "x": 35,
                  "y": 0.04950495049504951
              },
              {
                  "name": "36",
                  "x": 36,
                  "y": 0.049019607843137254
              },
              {
                  "name": "37",
                  "x": 37,
                  "y": 0.04854368932038835
              },
              {
                  "name": "38",
                  "x": 38,
                  "y": 0.04807692307692308
              },
              {
                  "name": "39",
                  "x": 39,
                  "y": 0.047619047619047616
              },
              {
                  "name": "40",
                  "x": 40,
                  "y": 0.04716981132075472
              },
              {
                  "name": "41",
                  "x": 41,
                  "y": 0.04672897196261682
              },
              {
                  "name": "42",
                  "x": 42,
                  "y": 0.046296296296296294
              },
              {
                  "name": "43",
                  "x": 43,
                  "y": 0.045871559633027525
              },
              {
                  "name": "44",
                  "x": 44,
                  "y": 0.045454545454545456
              },
              {
                  "name": "45",
                  "x": 45,
                  "y": 0.05
              },
              {
                  "name": "46",
                  "x": 46,
                  "y": 0.05
              },
              {
                  "name": "47",
                  "x": 47,
                  "y": 0.04950495049504951
              },
              {
                  "name": "48",
                  "x": 48,
                  "y": 0.049019607843137254
              },
              {
                  "name": "49",
                  "x": 49,
                  "y": 0.04854368932038835
              },
              {
                  "name": "50",
                  "x": 50,
                  "y": 0.04807692307692308
              },
              {
                  "name": "51",
                  "x": 51,
                  "y": 0.047619047619047616
              },
              {
                  "name": "52",
                  "x": 52,
                  "y": 0.04716981132075472
              },
              {
                  "name": "53",
                  "x": 53,
                  "y": 0.04672897196261682
              },
              {
                  "name": "54",
                  "x": 54,
                  "y": 0.046296296296296294
              },
              {
                  "name": "55",
                  "x": 55,
                  "y": 0.045871559633027525
              },
              {
                  "name": "56",
                  "x": 56,
                  "y": 0.045454545454545456
              },
              {
                  "name": "57",
                  "x": 57,
                  "y": 0.05
              },
              {
                  "name": "58",
                  "x": 58,
                  "y": 0.05
              },
              {
                  "name": "59",
                  "x": 59,
                  "y": 0.04950495049504951
              },
              {
                  "name": "60",
                  "x": 60,
                  "y": 0.049019607843137254
              }
          ]
      }
  ]
  

    const rValue = 1;
    this.selectPlotData.forEach(series => {
      // Add the rValue to each point in the series
      series.series.forEach(point => {
        point.r = rValue;
      });
    });
   
    console.log('God selected plot data', this.selectPlotData);
  }
  onSelectionChange(event: MatChipSelectionChange) {
    let temp =[];
    this.selectedMeasurement = event.source.value;
    console.log('God selected measurement', this.selectedMeasurement);
    this.selectPlotData = [this.allPlotsData.find(plot => plot.name === this.selectedMeasurement)];
   // this.selectPlotData = [temp]
   //console.log('God selected plot data', this.selectPlotData);
   


console.log('God selected plot data', this.selectPlotData);
  }


  getSolutionCompoundIonNames() {
    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
      (solutionMixture) => {
        if (solutionMixture) {
          // do something with solutionMixture
          this.solution_mixture_steps_edit = solutionMixture;
          this.prepareAllData(solutionMixture.data_dictionary);
          console.log(this.allPlotsData);
          this.generateAllMeasurements(this.allPlotsData);
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
    this.selectedActionItem.setValue(null);
    this.selectedOperationGroup.setValue(null);
    if (this.steps_list.length > 0) {
      this.selectedStepIndex = this.steps_list.length-1;
      this.editStep(this.steps_list.length-1);
    }

  }

  onSelectItem(i: number) {
    this.selectedStepIndex = i;
    
  }

  onCancelEdit() {
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

  editStep(i: number) {
    this.edit_step_index = i;
    this.add_edit_label = 'Edit';
    this.selected_operations_method = this.steps_list[i].operation_method;
    console.log('God edit step:', this.steps_list[i].operation_method);
    this.selectedOperationGroup.setValue(this.action_structure[this.steps_list[i].operation_method].mainCategory);
    this.selectedActionItem.setValue(this.action_structure[this.steps_list[i].operation_method].id);
    this.selectedTemplate = this[this.action_structure[this.steps_list[i].operation_method].templateRef];
    this.volumeAdditionsActionsSelected=true;
    this.currentStepForm = this.fb.group(this.action_structure[this.steps_list[i].operation_method].formControls);
    this.currentStepForm.patchValue(this.steps_list[i].parameters);
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
