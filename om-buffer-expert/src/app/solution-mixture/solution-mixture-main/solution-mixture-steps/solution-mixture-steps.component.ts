import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solution } from 'src/app/shared/models/solution.model';
import { SolutionMixture } from 'src/app/shared/models/solution_mixture.model';
import { Step } from 'src/app/shared/models/step.model';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';

@Component({
  selector: 'app-solution-mixture-steps',
  templateUrl: './solution-mixture-steps.component.html',
  styleUrls: ['./solution-mixture-steps.component.scss']
})
export class SolutionMixtureStepsComponent implements OnInit {
  @ViewChild('TitrateSpecifiedVolumeofSolution') TitrateSpecifiedVolumeofSolution: TemplateRef<any>;
  @ViewChild('IncreaseVolumeSolutionTemplate') IncreaseVolumeSolutionTemplate: TemplateRef<any>;
  @ViewChild('DiluteByVolumeWater') DiluteByVolumeWater: TemplateRef<any>;
  @ViewChild('DiluteByRatioWater') DiluteByRatioWater: TemplateRef<any>;

  volumeAdditions = false;
  targetConc_pH = false;
  solutionModification = false;

  solution_mixture_steps: SolutionMixture;
  solution_names:string[]=[]

  selectedTemplate: TemplateRef<any>;
  steps_list:Step[] = [];
  selected_operations_method = "";
  selected_parameters = {};
  volumeAdditionsActionsSelected = false;
  targetConc_pHActionsSelected = false;
  solutionModificationActionsSelected = false;
  
  currentStepForm = this.fb.group({});

  operationGroups = [
    { id: 'volumeAdditions', displayName: 'Volume Adjustments' },
    { id: 'targetConc_pH', displayName: 'Target Compound, Ion Concentrations or pH' },
    { id: 'solutionModification', displayName: 'Target Ion Concentrations and pH' }
  ];

  operations_parameters = {"Get Buffer Solution": ["buffer_species"],
  "Get Buffer Solution with Salt": ["buffer_species","salt_compound_name"],
  "Get Stock Solution": ["compound_name"],
  "Make Stock Solution": ["compound_name","compound_conc"],
  "Make Water": [],
    "Make Solution with Buffer Species with salt to Target Concentration and pH": ["buffer_species","target_conc","target_pH","salt_compound_name","salt_conc"],
    "Make Solution with Buffer Species to Target Concentration and pH": ["buffer_species","target_conc","target_pH"],
    "Make Solution with Buffer Species and Salt and add acid or base to get to target pH": ["buffer_species","target_conc","target_pH","salt_compound_name","salt_conc","acid_for_adjust","base_for_adjust"],
    "Add Solution": ["solution_name"],
    "Add Solution to Target Concentration of Compound Auto Pick Solution": ["compound_name","target_conc"],
}


volume_actions = [
  {id:"Titrate with Solution Name to Volume",displayName: "Titrate specified volume of solution",parameters: ["solution_name","volume"]},
  {id:"Increase Volume of Solution Name",displayName: "Add specified volume of solution" ,parameters: ["solution_name","volume_to_add"]},
  {id:"Dilute Solution Mixture with Water",displayName:"Add specified volume of water", parameters:  ["volume_to_add"]},
  {id:"Dilute Solution Mixture",displayName: "Add water to dilution ratio",parameters: ["dilution_factor"]},
]

target_conc_pH_actions = [
  {id:"Dilute Solution Mixture with Water to Target Compound Concentration",displayName:"Add water to target [compound]" ,parameters:["compound_name","target_conc"]},
  {id:"Dilute Solution Mixture with Water to Target Ion Concentration",displayName: "Add water to target [ion]",parameters:["ion_name","target_conc"]},
  {id:"Add Solution to Solution Mixture to Target Ion Concentration",displayName: "Add solution to target [ion]",parameters:["solution_name","target_conc"]},
  {id:"Titrate with Specified Solution Name to pH",displayName: "Add solution to target pH",parameters:["solution_name","target_pH"]},
]

solution_modification_actions = [
  {id: "Modify and Add Solution to achieve Target buffer species concentration, pH and dilution ratio",displayName:"Modify and add solution to target [ion] and pH",parameters: ["buffer_species","target_conc","target_pH","dilution_ratio"]}
]

constructor(private fb:FormBuilder, private solutionMixtureService:SolutionMixtureService) { }


ngOnInit() {


    this.getSolutionNames()

  }


getSolutionNames() {
  //this.solution_names = this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe()
  this.solution_names =[]
  this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
    (solutionMixture) => {
      if (solutionMixture) {
        // do something with solutionMixture
        this.solution_mixture_steps = solutionMixture;
        let solutions = this.solution_mixture_steps.solutions;
        for (let solution of this.solution_mixture_steps.solutions ){
            this.solution_names.push(solution.name);
        }
        console.log("God solname", this.solution_names)
      }
    }
  );
  
}

getParametersById(actions: any[], id: string) {
  const action = actions.find(action => action.id === id);
  return action ? action.parameters : null;
}

getDisplayNameById(actions: any[], id: string) {
  const action = actions.find(action => action.id === id);
  return action ? action.displayName : null;
}

getTemplateById(actions: any[], id: string) {
  const action = actions.find(action => action.id === id);
  return action ? action.templateRef : null;
}

  onOperationGroupSelect(id) {
    console.log(id);
    if (id === 'volumeAdditions') {
      this.volumeAdditions = true;
      this.targetConc_pH = false;
      this.solutionModification = false;
      console.log("God volume additions chosen", this.volumeAdditions)
    }
    if (id === 'targetConc_pH') {
      this.targetConc_pH = true;
      this.volumeAdditions = false;
      this.solutionModification = false;
      console.log("God targetConc_pH chosen", this.targetConc_pH)
    }
    if (id === 'solutionModification') {
      this.solutionModification = true;
      this.volumeAdditions = false;
      this.targetConc_pH = false;
      console.log("God solutionModification chosen", this.solutionModification)
    }

  }




 form_config_volume_actions = {
  "Titrate specified volume of solution": { 
    
    formControls : {
      solution_name: [""],
      volume: [0,Validators.required]
  },
  templateRef: 'TitrateSpecifiedVolumeofSolution',



 },

  "Add specified volume of solution": {
    formControls : {
      solution_name: [""],
      volume_to_add: [0,Validators.required]
  },
  templateRef: 'IncreaseVolumeSolutionTemplate',

  },
  "Add specified volume of water": {
    formControls : {
      volume_to_add: [0,Validators.required]
  },
  templateRef: 'DiluteByVolumeWater',
  },
  "Add water to dilution ratio": {
    formControls : {
      dilution_factor: [0,Validators.required]
  },
  templateRef: 'DiluteByRatioWater',
  },
}

form_config_target_conc_pH_actions = {
  "Add water to target [compound]": { 
    formControls : {
      compound_name: [""],
      target_conc: [0,Validators.required]
  },  
  },
  "Add water to target [ion]": {
    formControls : {
      ion_name: [""],
      target_conc: [0,Validators.required]
  },
  },
  "Add solution to target [ion]": {
    formControls : {
      solution_name: [""],
      target_conc: [0,Validators.required]
  },
  },
  "Add solution to target pH": {
    formControls : {
      solution_name: [""],
      target_pH: [0,Validators.required]
  },
  },
}

form_config_solution_modification_actions = {
  "Modify and add solution to target [ion] and pH": { 
    formControls : {
      buffer_species: [""],
      target_conc: [0,Validators.required],
      target_pH: [0,Validators.required],
      dilution_ratio: [0,Validators.required]
  },
  },
}

  onVolumeActionSelect(id) {
    this.getSolutionNames()
    console.log("God-parameters",this.getParametersById(this.volume_actions,id));
   // console.log("God-id",this.volume_actions[id].id);
   // console.log("God-parameters",this.volume_actions[id].parameters);

    this.volumeAdditionsActionsSelected = true;
    this.targetConc_pHActionsSelected = false;
    this.solutionModificationActionsSelected = false;

    const config = this.form_config_volume_actions[this.getDisplayNameById(this.volume_actions,id)];
   this.currentStepForm = this.fb.group(config.formControls);
    this.selected_operations_method = id;
    this.selected_parameters = this.getParametersById(this.volume_actions,id);
    console.log("God", config.templateRef)
    this.selectedTemplate= config.templateRef;
    console.log(this.currentStepForm);
  }

  onTargetConc_pHActionSelect(id) {
    console.log(id);
    this.volumeAdditionsActionsSelected = false;
    this.targetConc_pHActionsSelected = true;
    this.solutionModificationActionsSelected = false;

    const config = this.form_config_target_conc_pH_actions[this.target_conc_pH_actions[id].displayName];  
    this.currentStepForm = this.fb.group(config.formControls);
    this.selected_operations_method = this.target_conc_pH_actions[id].id;
    this.selected_parameters = this.target_conc_pH_actions[id].parameters;


  }

  onSolutionModificationActionSelect(id) {
    this.solutionModificationActionsSelected = true;
    this.volumeAdditionsActionsSelected = false;
    this.targetConc_pHActionsSelected = false;
    const config = this.form_config_solution_modification_actions[this.solution_modification_actions[id].displayName];
    this.currentStepForm = this.fb.group(config.formControls);
    this.selected_operations_method = this.solution_modification_actions[id].id;
    this.selected_parameters = this.solution_modification_actions[id].parameters;
    

    console.log(id);
  }


  getFormControls(): string[] {
    return this.currentStepForm ? Object.keys(this.currentStepForm.controls) : [];
  }

  onSubmit() {
    console.log(this.currentStepForm.value);
    this.selected_parameters=this.currentStepForm.value
    console.log ("God param",this.selected_parameters)
    this.steps_list.push(new Step(this.steps_list.length+1,this.selected_operations_method,this.selected_parameters))
   // this.steps_list.push(this.currentStepForm.value);
    console.log(this.steps_list);
  }

  onExecute() {
    this.solution_mixture_steps.steps.concat(this.steps_list)
    this.solutionMixtureService.postStepsAndGetSolutionMixture(this.solution_mixture_steps.steps);
    
    console.log("God new mixture", this.solution_mixture_steps)
  }
}
