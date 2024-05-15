
import { SolutionMixture } from './solution_mixture.model';
import { Solution } from './solution.model';


export class Step {
    id: number; // Or you might use a string, depending on your API data
    operation_method: string;
    parameters: Record<string, any>; // Flexible type for parameters
    is_modified: boolean;
    is_executed: boolean;
    result_flag: { flag: string; comment: string };
    associated_solution: string;
    category: string;
    validation_flag: { flag: string; comment: string };

    constructor(id: number, operation_method: string = "", parameters: Record<string, any> = {}, is_modified: boolean = false, is_executed: boolean = false) {
        this.id = id;
        this.operation_method = operation_method;
        this.parameters = parameters;
        this.is_modified = is_modified;
        this.is_executed = is_executed;
        this.result_flag = { flag: "None", comment: "None" };
        this.validation_flag = { flag: "None", comment: "None" };
        
    }
static isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

    // This method is used to check if a new step is equal to any of the existing steps

    isEqualStep(step: Step): boolean {
        let duplicategod = false
        // check if the operation method is the same
        if (this.operation_method !== step.operation_method) {
            duplicategod = false;
            //console.log("God: Operation method is not the same", this.operation_method, step.operation_method)
            return duplicategod
        }
        // now check if the parameters are the same


        // if both the operation method and the parameters are the same, then check if the parameter values are the same
      else { 
        if (Step.isEqual(this.parameters, step.parameters)) {
            duplicategod = true;
            //console.log("God: Parameters are the same - It is a duplicate", this.parameters, step.parameters)
            
        }  
        else {
            //console.log("God: Parameters are not the same - not duplicates", this.parameters, step.parameters)
            duplicategod = false;
        } 

        return duplicategod;
    }   

}

    static isDuplicateStep(steps: Step[], stepToCheck: Step): boolean {
        //console.log("Came here god", steps);
        return steps.some(step => step.isEqualStep(stepToCheck));
    }

    // a new function that does the reverse of the evaluateEffectOfRemovingSolution function
    // this function will take an "operation step" and the list of "Make" steps and mark which "Make" steps are affected by the "operation step"
    // the function will mark the "Make" steps as "linked" if the "operation step" uses a solution, a compound from the solution or an ion from the solution

    static evaluateEffectOfOperationStep(solution_mixture :SolutionMixture, step:Step, stepstocheck:Step[]) {
        // get the solution
       
        // look through the parameters of the step and determine the solution name or compound name or ion name
        // get the solution
        const solution_name = Object.values(step.parameters).find((value: any) => solution_mixture.solutions.some(s => s.name === value));
        const compound_name = Object.values(step.parameters).find((value: any) => solution_mixture.solutions.some(s => Object.keys(s.compound_concentrations).includes(value)));    
        const ion_name = Object.values(step.parameters).find((value: any) => solution_mixture.solutions.some(s => Object.keys(s.ion_concentrations).includes(value)));
        console.log("God: Solution name", solution_name, compound_name, ion_name);
        let step_solution: Solution;
        let step_compounds: string[];
        let step_ions: string[];
        step.validation_flag = { flag: "None", comment: "None" };
        for (let i = 0; i <stepstocheck.length; i++) {
            console.log("God: Stepstocheck in loop", stepstocheck[i].category, stepstocheck[i].parameters)
            // check if the step is a "Make" step
            if (stepstocheck[i].category === "Make") {

                step_solution = solution_mixture.solutions.find(s => s.name === stepstocheck[i].associated_solution);
                step_compounds = Object.keys(step_solution.compound_concentrations);
                step_ions = Object.keys(step_solution.ion_concentrations);
                if (solution_name === step_solution.name) {
                    console.log("God: Solution used in step", solution_name, stepstocheck[i].parameters, stepstocheck[i].operation_method)
                    stepstocheck[i].validation_flag.flag = "Linked";
                    stepstocheck[i].validation_flag.comment = "The solution used in this step has been used in the operation step";
                }
                if (compound_name && step_compounds.includes(compound_name)) {
                    console.log("God: Compound used in step", compound_name, stepstocheck[i].parameters, stepstocheck[i].operation_method)
                    stepstocheck[i].validation_flag.flag = "Linked";
                    stepstocheck[i].validation_flag.comment = "The compound used in this step has been used in the operation step";
                }
                if (ion_name && step_ions.includes(ion_name)) {
                    console.log("God: Ion used in step", ion_name, stepstocheck[i].parameters, stepstocheck[i].operation_method)
                    stepstocheck[i].validation_flag.flag = "Linked";
                    stepstocheck[i].validation_flag.comment = "The ion used in this step has been used in the operation step";
                }
                if (stepstocheck[i].validation_flag.flag === "Linked") {
                    console.log("God: Stepstocheck - linked step", stepstocheck[i].validation_flag.flag, stepstocheck[i].validation_flag.comment)
                }
                else {
                    console.log("God: Stepstocheck - not linked step", stepstocheck[i].validation_flag.flag, stepstocheck[i].validation_flag.comment)
                }

            }
        }
    }


    static evaluateEffectOfRemovingSolution(solution_mixture :SolutionMixture, step:Step, stepstocheck:Step[]) {
        // get the solution
       
       

        const solution = solution_mixture.solutions.find(s => s.name === step.associated_solution);

        
        // go through each step
       let  sol_name = step.associated_solution;
          let sol_compound_names = Object.keys(
            solution.compound_concentrations
          );
          let sol_ion_names = Object.keys(
           solution.ion_concentrations
          );

          console.log("God: Solution details", sol_name, sol_compound_names, sol_ion_names)
          console.log("God: Stepstocheck", stepstocheck)
        // go through each step
        for (let i = 0; i <stepstocheck.length; i++) {
            console.log("God: Stepstocheck in loop", stepstocheck[i].category, stepstocheck[i].parameters)
            // check if the step is a "Make" step
            if (stepstocheck[i].category !== "Make") {
                console.log("God: Stepstocheck - not a make step", stepstocheck[i].category, stepstocheck[i].parameters);
                // check if the solution is used in the step
                if (Object.values(stepstocheck[i].parameters).includes(sol_name) ) {
                   console.log("God: Solution used in step", sol_name, stepstocheck[i].parameters, stepstocheck[i].operation_method)
                   stepstocheck[i].result_flag.flag = "Invalid";
                   stepstocheck[i].result_flag.comment = "The solution used in this step has been removed from the mixture";
                }
                // check if a compound from the solution is used in the step
               if (sol_compound_names.length > 0) {
                for (let j = 0; j < sol_compound_names.length; j++) {
                    if (Object.values(stepstocheck[i].parameters).includes(sol_compound_names[j])) {
                        console.log("God: Compound used in step", sol_compound_names[j], stepstocheck[i].parameters, stepstocheck[i].operation_method)
                        stepstocheck[i].result_flag.flag = "Invalid";
                        stepstocheck[i].result_flag.comment = "The solution used in this step has been removed from the mixture";
                    }
                }
            }
            // check if an ion from the solution is used in the step
            if (sol_ion_names.length > 0) {
                for (let j = 0; j < sol_ion_names.length; j++) {
                    if ( Object.values(stepstocheck[i].parameters).includes(sol_ion_names[j])) {
                        console.log("God: Ion used in step", sol_ion_names[j], stepstocheck[i].parameters, stepstocheck[i].operation_method)
                        stepstocheck[i].result_flag.flag = "Invalid";
                        stepstocheck[i].result_flag.comment = "The solution used in this step has been removed from the mixture";
                    }
                }
            }
            if (stepstocheck[i].result_flag.flag === "Invalid") {
                console.log("God: Stepstocheck - invalid step", stepstocheck[i].result_flag.flag, stepstocheck[i].result_flag.comment)
            }
            else {
                console.log("God: Stepstocheck - good to go", stepstocheck[i].result_flag.flag, stepstocheck[i].result_flag.comment)
            }
        }

    }
return stepstocheck;
}

    
}
