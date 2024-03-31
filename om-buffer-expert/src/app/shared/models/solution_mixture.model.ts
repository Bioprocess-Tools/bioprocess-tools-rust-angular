import { Compound } from "./compound.model";
import { Ion } from "./ion.model";
import { Solution } from "./solution.model";
import { Step } from "./step.model";
import { isEqual } from 'lodash/isEqual';

export class SolutionMixture {
    name: string;
    solutions: Solution[]; // Specify more detailed types as needed
    solution_indices: { [key: string]: number };
    pH: number;
    volume: number;
    compounds: Compound[];
    unique_ions: Ion[];
    unique_ion_names: string[];
    compound_concentrations: { [key: string]: number };
    ion_concentrations: { [key: string]: number };
    phase_data: { [key: string]: { end_volume: number, name: string } };
    pH_interval_data:number[];
    volume_interval_data:number[];
    data_dictionary: { [key: string]: any };
    phase_sliced_data: { [key: string]: any };
    steps: Step[]; // Could be an array of Step instances if using Step class
    result_flag: { flag: string; comment: string };

//write function to add a step to the steps array

constructor () {}

    addStep(step: Step) {
      
      const new_id = this.steps.length + 1;
      this.steps.push(step);
      this.steps[this.steps.length - 1].id = new_id;
        
    }

// add steps to the steps array
    addSteps(steps: Step[]) {
        for (let i = 0; i < steps.length; i++) {
            this.addStep(steps[i]);
        }
    }


    //write function to remove a step from the steps array
    removeStep(step: Step) {
        const index = this.steps.indexOf(step);
        if (index !== -1) {
            this.steps.splice(index, 1);
        }
    }
    //write function to update a step in the steps array
    updateStep(step: Step) {
        const index = this.steps.findIndex(s => s.id === step.id);
        if (index !== -1) {
            this.steps[index] = step;
        }
    }
    //write function to get a step from the steps array
    getStep(id: number) {
        return this.steps.find(s => s.id === id);
    }
    //write function to get a step from the steps array
    getStepIndex(id: number) {
        return this.steps.findIndex(s => s.id === id);
    }
    //write function to get a step from the steps array
    getStepById(id: number)
    {
        return this.steps.find(s => s.id === id);
    }

    //write a function to evaluate the effect of removing a solution on the steps
    // for this we have to go through each step and check if the solution is used in the step, if a compound from the solution is used in the step or if an ion from the solution is used in the step.  We need check all the steps that are not "Make" steps
    // if the solution is used in the step, we need to flag the step as invalid
    // if a compound from the solution is used in the step, we need to flag the step as invalid
    // if an ion from the solution is used in the step, we need to flag the step as invalid
    // if the step is invalid, we need to add a comment to the step
    // if the step is invalid, we need to add a flag to the step
    omFun() {
        console.log("OM Function");
    }


}