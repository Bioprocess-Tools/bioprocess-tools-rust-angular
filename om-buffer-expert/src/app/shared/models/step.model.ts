export class Step {
    id: number; // Or you might use a string, depending on your API data
    operation_method: string;
    parameters: Record<string, any>; // Flexible type for parameters
    is_modified: boolean;
    is_executed: boolean;
    result_flag: { flag: string; comment: string };

    constructor(id: number, operation_method: string = "", parameters: Record<string, any> = {}, is_modified: boolean = false, is_executed: boolean = false) {
        this.id = id;
        this.operation_method = operation_method;
        this.parameters = parameters;
        this.is_modified = is_modified;
        this.is_executed = is_executed;
        this.result_flag = { flag: "None", comment: "None" };
    }

}
