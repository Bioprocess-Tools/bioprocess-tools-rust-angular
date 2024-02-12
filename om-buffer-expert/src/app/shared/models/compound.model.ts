import { Ion } from './ion.model';

export class Compound {
  name: string;
  is_buffer: boolean;
  molecular_weight: number;
  ion_names: string[];
  stoichiometry: number[];
  buffer_stoichiometry: number;
  ions: Ion[];
  buffer_ion_name: string;
  buffer_ion_position: number;
  non_buffer_ion_position: number;
  non_buffer_coef : number;
  compound_conc_interval_data: number[];
  compound_type: string;

  constructor(

  ) {

  }


}
