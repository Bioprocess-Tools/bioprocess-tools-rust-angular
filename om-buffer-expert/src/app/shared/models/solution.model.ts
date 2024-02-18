import { Compound } from './compound.model';
import { Ion } from './ion.model';
export class Solution {
  name: string;
  compounds: Compound[];
  compound_concentrations: { [key: string]: number };
  unique_ions: Ion[];
  unique_ion_names: string[];
  non_salt_compounds: Compound[];
  salt_compound: Compound;
  ion_concentrations: { [key: string]: number };
  ionic_species_concentrations: { [key: string]: number };
  target_buffer_concentration: number;
  pH: number;
  result_flag: {[key:string]: string};
  buffer_species: string;
  volume: number;
  solution_type: string;
 

  constructor(name: string) {
    this.name = name;
    this.compounds = [];
    this.compound_concentrations = {};
    this.unique_ions = [];
    this.unique_ion_names = [];
    this.ion_concentrations = {};
    this.ionic_species_concentrations = {};
    this.target_buffer_concentration=0;
    this.pH = 0;
    this.non_salt_compounds = [];
    this.salt_compound = null;
    this.result_flag = {}
    this.buffer_species = "";
    this.volume = 0;
    this.solution_type = "";

  }
  //write a function to get the name of the first compound in the solution
  getFirstCompoundName(): string {
    return this.compounds[0].name;
  }
  //get firstcompound concentration
  getFirstCompoundConcentration(): number {
    return this.compound_concentrations[this.getFirstCompoundName()];
  } 

}
