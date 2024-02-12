import { Compound } from "./compound.model";
import { Ion } from "./ion.model";
import { Solution } from "./solution.model";
import { Step } from "./step.model";

export interface SolutionMixture {
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
  }
  