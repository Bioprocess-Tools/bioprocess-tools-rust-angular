import { Compound } from './compound.model';
import { Ion } from './ion.model';
export class Solution {
  name: string;
  compounds: Compound[];
  compound_concentrations: { [key: string]: number };
  unique_ions: Ion[];
  unique_ion_names: string[];
  ion_concentrations: { [key: string]: number };
  ionic_species_concentrations: { [key: string]: number };
  target_buffer_concentration: number;
  pH: number;

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
  }
}
