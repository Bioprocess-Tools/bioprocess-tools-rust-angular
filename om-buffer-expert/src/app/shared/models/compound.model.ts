import { Ion } from './ion.model';

export class Compound {
  name: string;
  molecular_weight: number;
  ion_names: string[];
  pos: number;
  stoichiometry: number[];
  ions: Ion[];
  buffer_ion_name: string;
  type: string;

  constructor(
    name: string,
    type: string,
    molecular_weight: number,
    ion_names: string[],
    stoichiometry: number[]
  ) {
    this.name = name;
    this.molecular_weight = molecular_weight;
    this.ion_names = ion_names;
    this.pos = -1;
    this.stoichiometry = stoichiometry;
    this.ions = this.addIons(ion_names);
    this.buffer_ion_name;
    this.type = type;
  }

  private addIons(ion_names: string[]): Ion[] {
    // Implement the logic to create Ion objects based on ion_names
    // and return an array of Ion objects
    // For example:
    return ion_names.map((ionName) => new Ion(ionName, '', [], 0));
  }

  private getBufferIon(): Ion {
    // Implement the logic to get the buffer ion based on the created ions
    // and return the buffer ion object
    // For example:
    return new Ion('Buffer Ion', '', [], 0);
  }
}
