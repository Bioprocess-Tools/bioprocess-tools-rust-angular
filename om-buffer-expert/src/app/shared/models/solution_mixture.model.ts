import { Compound } from "./compound.model";
import { Ion } from "./ion.model";
import { Solution } from "./solution.model";
import { Step } from "./step.model";

export class SolutionMixture {
    name: string;
    solutions: Solution[]; // Specify more detailed types as needed
    solutionIndices: { [key: string]: number };
    pH: number;
    volume: number;
    compounds: Compound[];
    uniqueIons: Ion[];
    uniqueIonNames: string[];
    compoundConcentrations: { [key: string]: number };
    ionConcentrations: { [key: string]: number };
    phaseData: { [key: string]: any };
    dataDictionary: { [key: string]: any };
    steps: Step[]; // Could be an array of Step instances if using Step class
    resultFlag: { flag: string; comment: string };

//write function to add a step to the steps array
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



}

  