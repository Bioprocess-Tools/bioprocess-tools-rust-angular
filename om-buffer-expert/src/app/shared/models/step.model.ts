import isEqual from 'lodash/isEqual';


export class Step {
    id: number; // Or you might use a string, depending on your API data
    operation_method: string;
    parameters: Record<string, any>; // Flexible type for parameters
    is_modified: boolean;
    is_executed: boolean;
    result_flag: { flag: string; comment: string };
    associated_solution: string;
    category: string;

    constructor(id: number, operation_method: string = "", parameters: Record<string, any> = {}, is_modified: boolean = false, is_executed: boolean = false) {
        this.id = id;
        this.operation_method = operation_method;
        this.parameters = parameters;
        this.is_modified = is_modified;
        this.is_executed = is_executed;
        this.result_flag = { flag: "None", comment: "None" };
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
        if (isEqual(this.parameters, step.parameters)) {
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

    
}
