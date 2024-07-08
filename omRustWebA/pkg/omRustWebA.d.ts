/* tslint:disable */
/* eslint-disable */
/**
* @returns {string}
*/
export function get_chemical_database_as_json(): string;
/**
* @param {string} compounds_name_json
* @param {string} compounds_conc_json
* @returns {string}
*/
export function calculate_pH_compounds_json(compounds_name_json: string, compounds_conc_json: string): string;
/**
* @param {string} solution_json
* @param {string} compounds_name_json
* @param {string} compounds_conc_json
* @returns {string}
*/
export function calculate_pH_compounds_changed_conc_json(solution_json: string, compounds_name_json: string, compounds_conc_json: string): string;
/**
* @param {string} compounds_name_json
* @param {string} compounds_conc_json
* @param {string} chemical_database_json
* @returns {string}
*/
export function calculate_pH_compounds_json_db(compounds_name_json: string, compounds_conc_json: string, chemical_database_json: string): string;
/**
* @param {string} buffer_compound_1_name
* @param {string} buffer_compound_2_name
* @param {number} total_buffer_conc
* @param {number} target_pH
* @param {string} chemical_database_json
* @returns {string}
*/
export function calculate_composition_common_buffer_target_pH_json(buffer_compound_1_name: string, buffer_compound_2_name: string, total_buffer_conc: number, target_pH: number, chemical_database_json: string): string;
/**
* @param {string} buffer_compound_1_name
* @param {string} buffer_compound_2_name
* @param {number} total_buffer_conc
* @param {number} target_pH
* @param {string} chemical_database_json
* @returns {string}
*/
export function calculate_composition_common_buffer_target_pH_json_db(buffer_compound_1_name: string, buffer_compound_2_name: string, total_buffer_conc: number, target_pH: number, chemical_database_json: string): string;
/**
* @param {string} chemical_database_json
* @param {number} conc_set_concentration
* @param {string} conc_set_compound_name
* @param {string} conc_change_compound_name
* @param {number} target_pH
* @returns {string}
*/
export function calculate_concentration_change_json(chemical_database_json: string, conc_set_concentration: number, conc_set_compound_name: string, conc_change_compound_name: string, target_pH: number): string;
/**
*/
export enum SolutionType {
  SingleSpecies = 0,
  DualSpecies = 1,
  MultiSpecies = 2,
  Stock = 3,
}
/**
*/
export class ChemicalDatabase {
  free(): void;
}
/**
*/
export class Compound {
  free(): void;
/**
* @param {number} comp_id
* @param {string} comp_name
* @param {Uint32Array} comp_ion_id
* @param {Uint32Array} stoichiometry
* @param {number} molecular_weight
* @param {number} comp_conc
* @returns {Compound}
*/
  static new(comp_id: number, comp_name: string, comp_ion_id: Uint32Array, stoichiometry: Uint32Array, molecular_weight: number, comp_conc: number): Compound;
/**
* @param {number} ion_id
* @returns {number | undefined}
*/
  ion_position(ion_id: number): number | undefined;
}
/**
*/
export class Ion {
  free(): void;
/**
* @param {string} ion_name
* @param {boolean} is_buffer
* @param {Float64Array} pka
* @param {number} highest_charge
* @returns {Ion}
*/
  static new(ion_name: string, is_buffer: boolean, pka: Float64Array, highest_charge: number): Ion;
}
/**
*/
export class Solution {
  free(): void;
/**
* @returns {Solution}
*/
  static new(): Solution;
/**
* Calculates the concentration change for one compound to achieve a target pH.
*
* # Parameters
* - `chemical_database`: Reference to the chemical database.
* - `conc_set_concentration`: The concentration set for the compound.
* - `conc_set_compound_name`: The name of the compound in the concentration set.
* - `conc_change_compound_name`: The name of the compound to change concentration.
* - `target_pH`: The target pH to achieve.
*
* # Note
* This function only proceeds with the calculation if both compound IDs are found.
* @param {ChemicalDatabase} chemical_database
* @param {number} conc_set_concentration
* @param {string} conc_set_compound_name
* @param {string} conc_change_compound_name
* @param {number} target_pH
*/
  calculate_conc_change_one_compound_conc_target_pH(chemical_database: ChemicalDatabase, conc_set_concentration: number, conc_set_compound_name: string, conc_change_compound_name: string, target_pH: number): void;
/**
* @param {number} total_buffer_conc
* @param {number} target_pH
* @returns {buffer_common_ion_parameters}
*/
  get_common_ion_buffer_parameters(total_buffer_conc: number, target_pH: number): buffer_common_ion_parameters;
/**
* @param {ChemicalDatabase} chemical_database
* @param {number} conc_set_concentration
* @param {string} conc_set_compound_name
* @param {string} conc_change_compound_name
* @param {number} target_pH
* @returns {Solution}
*/
  static calculate_concentration_change(chemical_database: ChemicalDatabase, conc_set_concentration: number, conc_set_compound_name: string, conc_change_compound_name: string, target_pH: number): Solution;
/**
* @returns {Uint32Array}
*/
  non_salt_compound_ids(): Uint32Array;
/**
* @param {number} comp_id
* @returns {Compound | undefined}
*/
  get_compound_by_id(comp_id: number): Compound | undefined;
/**
* @param {number} ion_id
* @returns {Ion | undefined}
*/
  get_ion_by_id(ion_id: number): Ion | undefined;
/**
* @returns {Uint32Array}
*/
  get_salt_compound_ids(): Uint32Array;
/**
* @returns {Uint32Array}
*/
  get_buffer_compound_ids(): Uint32Array;
/**
* @param {number} compound_id
* @param {number} target_conc
*/
  set_compound_conc_target_buffer_ion_conc(compound_id: number, target_conc: number): void;
/**
* @param {string} compound_name
* @param {ChemicalDatabase} database
* @returns {number | undefined}
*/
  add_comp(compound_name: string, database: ChemicalDatabase): number | undefined;
/**
* @param {string} compound_name
* @param {number} conc
* @param {ChemicalDatabase} database
*/
  set_conc_by_name(compound_name: string, conc: number, database: ChemicalDatabase): void;
/**
* @param {number} compound_id
* @param {number} conc
*/
  set_init_comp_conc(compound_id: number, conc: number): void;
/**
* @param {number} compound_id
* @param {number} new_conc
*/
  change_comp_conc(compound_id: number, new_conc: number): void;
/**
* @param {number} compound_id
* @param {number} conc
*/
  add_comp_conc(compound_id: number, conc: number): void;
/**
* @param {number} ph
* @returns {number}
*/
  ion_concs_unique_ions(ph: number): number;
/**
* @param {number} comp_id_set_conc
* @param {number} comp_conc
* @param {number} comp_id_change_conc
* @param {number} target_pH
*/
  calculate_single_compound_conc_target_pH(comp_id_set_conc: number, comp_conc: number, comp_id_change_conc: number, target_pH: number): void;
/**
* @param {string} buffer_compound_1_name
* @param {string} buffer_compound_2_name
* @param {number} total_buffer_conc
* @param {number} target_pH
* @param {ChemicalDatabase} chemical_database
* @returns {Solution}
*/
  static calculate_composition_common_buffer_target_pH(buffer_compound_1_name: string, buffer_compound_2_name: string, total_buffer_conc: number, target_pH: number, chemical_database: ChemicalDatabase): Solution;
/**
* @param {(string)[]} compounds_name_list
* @param {Float64Array} compounds_conc_list
* @param {ChemicalDatabase} chemical_database
* @returns {Solution}
*/
  static calculate_pH_compounds(compounds_name_list: (string)[], compounds_conc_list: Float64Array, chemical_database: ChemicalDatabase): Solution;
/**
* @param {Solution} godsolution
* @param {(string)[]} compounds_name_list
* @param {Float64Array} compounds_conc_list
* @returns {Solution}
*/
  static calculate_pH_compounds_changed_conc(godsolution: Solution, compounds_name_list: (string)[], compounds_conc_list: Float64Array): Solution;
/**
* @param {number} total_buffer_conc
* @param {number} target_pH
* @param {buffer_common_ion_parameters} parameters
*/
  calculate_compound_conc_common_buffer_ion(total_buffer_conc: number, target_pH: number, parameters: buffer_common_ion_parameters): void;
}
/**
*/
export class buffer_common_ion_parameters {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_chemical_database_as_json: (a: number) => void;
  readonly calculate_pH_compounds_json: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly calculate_pH_compounds_changed_conc_json: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly calculate_pH_compounds_json_db: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly calculate_composition_common_buffer_target_pH_json: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly calculate_composition_common_buffer_target_pH_json_db: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly calculate_concentration_change_json: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly __wbg_ion_free: (a: number) => void;
  readonly ion_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_compound_free: (a: number) => void;
  readonly compound_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly compound_ion_position: (a: number, b: number, c: number) => void;
  readonly __wbg_buffer_common_ion_parameters_free: (a: number) => void;
  readonly __wbg_solution_free: (a: number) => void;
  readonly solution_new: () => number;
  readonly solution_calculate_conc_change_one_compound_conc_target_pH: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly solution_get_common_ion_buffer_parameters: (a: number, b: number, c: number) => number;
  readonly solution_calculate_concentration_change: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly solution_non_salt_compound_ids: (a: number, b: number) => void;
  readonly solution_get_compound_by_id: (a: number, b: number) => number;
  readonly solution_get_ion_by_id: (a: number, b: number) => number;
  readonly solution_get_salt_compound_ids: (a: number, b: number) => void;
  readonly solution_get_buffer_compound_ids: (a: number, b: number) => void;
  readonly solution_set_compound_conc_target_buffer_ion_conc: (a: number, b: number, c: number) => void;
  readonly solution_add_comp: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly solution_set_conc_by_name: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly solution_set_init_comp_conc: (a: number, b: number, c: number) => void;
  readonly solution_change_comp_conc: (a: number, b: number, c: number) => void;
  readonly solution_add_comp_conc: (a: number, b: number, c: number) => void;
  readonly solution_ion_concs_unique_ions: (a: number, b: number) => number;
  readonly solution_calculate_single_compound_conc_target_pH: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly solution_calculate_composition_common_buffer_target_pH: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly solution_calculate_pH_compounds: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly solution_calculate_pH_compounds_changed_conc: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly solution_calculate_compound_conc_common_buffer_ion: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_chemicaldatabase_free: (a: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
