use serde::{Deserialize, Serialize};
#[allow(unused_variables)]
#[allow(dead_code)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_chemical_database_as_json() -> String {
    let mut db = ChemicalDatabase::new();
    db.populate_with_ions();
    db.populate_with_compounds();

    // Serialize the chemical database to a JSON string
    serde_json::to_string(&db)
        .unwrap_or_else(|_| "Failed to serialize chemical database".to_string())
}
#[wasm_bindgen]
pub fn calculate_pH_compounds_json(
    compounds_name_json: String,
    compounds_conc_json: String,
) -> String {
    // Deserialize input JSON to Rust types
    let compounds_name_list: Vec<String> = serde_json::from_str(&compounds_name_json).unwrap();
    let compounds_conc_list: Vec<f64> = serde_json::from_str(&compounds_conc_json).unwrap();
    let mut chemical_database = ChemicalDatabase::new();
    chemical_database.populate_with_ions();
    chemical_database.populate_with_compounds();

    // Call the actual Rust function
    let result = Solution::calculate_pH_compounds(
        compounds_name_list,
        compounds_conc_list,
        &chemical_database,
    );

    // Serialize the result or error into JSON
    match result {
        Ok(solution) => serde_json::to_string(&solution)
            .unwrap_or_else(|_| "Error serializing solution".to_string()),
        Err(e) => {
            serde_json::to_string(&e).unwrap_or_else(|_| "Error serializing error".to_string())
        }
    }
}

#[wasm_bindgen]
pub fn calculate_pH_compounds_changed_conc_json(
    solution_json: String,
    compounds_name_json: String,
    compounds_conc_json: String,
) -> String {
    // Deserialize input JSON to Rust types
    let mut godsolution: Solution = serde_json::from_str(&solution_json).unwrap();
    let compounds_name_list: Vec<String> = serde_json::from_str(&compounds_name_json).unwrap();
    let compounds_conc_list: Vec<f64> = serde_json::from_str(&compounds_conc_json).unwrap();

    let mut updates = Vec::new();

    for (name, &conc) in compounds_name_list.iter().zip(compounds_conc_list.iter()) {
        if let Some(compound) = godsolution.compounds.iter().find(|c| c.comp_name == *name) {
            updates.push((compound.comp_id, conc));
        }
    }

    // Now, iterate over the updates and modify `godsolution`
    for (comp_id, conc) in updates {
        godsolution.change_comp_conc(comp_id, conc);
    }

    godsolution.calculate_ph(1.0, 1.0, 0.01);

    // Serialize the updated Solution to JSON to return it
    serde_json::to_string(&godsolution).unwrap_or_else(|_| "Error serializing solution".to_string())
}

#[wasm_bindgen]
pub fn calculate_pH_compounds_json_db(
    compounds_name_json: String,
    compounds_conc_json: String,
    chemical_database_json: String,
) -> String {
    // Deserialize input JSON to Rust types
    let compounds_name_list: Vec<String> = serde_json::from_str(&compounds_name_json).unwrap();
    let compounds_conc_list: Vec<f64> = serde_json::from_str(&compounds_conc_json).unwrap();
    let chemical_database: ChemicalDatabase =
        serde_json::from_str(&chemical_database_json).unwrap();

    // Call the actual Rust function
    let result = Solution::calculate_pH_compounds(
        compounds_name_list,
        compounds_conc_list,
        &chemical_database,
    );

    // Serialize the result or error into JSON
    match result {
        Ok(solution) => serde_json::to_string(&solution)
            .unwrap_or_else(|_| "Error serializing solution".to_string()),
        Err(e) => {
            serde_json::to_string(&e).unwrap_or_else(|_| "Error serializing error".to_string())
        }
    }
}

#[wasm_bindgen]
pub fn calculate_composition_common_buffer_target_pH_json(
    buffer_compound_1_name: String,
    buffer_compound_2_name: String,
    total_buffer_conc: f64,
    target_pH: f64,
    chemical_database_json: String,
) -> String {
    // Deserialize the chemical database from JSON
    let mut chemical_database = ChemicalDatabase::new();
    chemical_database.populate_with_ions();
    chemical_database.populate_with_compounds();

    // Call the original Rust function
    match Solution::calculate_composition_common_buffer_target_pH(
        &buffer_compound_1_name,
        &buffer_compound_2_name,
        total_buffer_conc,
        target_pH,
        &chemical_database,
    ) {
        Ok(solution) => serde_json::to_string(&solution)
            .unwrap_or_else(|_| "Error serializing solution".to_string()),
        Err(e) => {
            serde_json::to_string(&e).unwrap_or_else(|_| "Error serializing error".to_string())
        }
    }
}

#[wasm_bindgen]
pub fn calculate_composition_common_buffer_target_pH_json_db(
    buffer_compound_1_name: String,
    buffer_compound_2_name: String,
    total_buffer_conc: f64,
    target_pH: f64,
    chemical_database_json: String,
) -> String {
    // Deserialize the chemical database from JSON
    let chemical_database: ChemicalDatabase =
        serde_json::from_str(&chemical_database_json).unwrap();

    // Call the original Rust function
    match Solution::calculate_composition_common_buffer_target_pH(
        &buffer_compound_1_name,
        &buffer_compound_2_name,
        total_buffer_conc,
        target_pH,
        &chemical_database,
    ) {
        Ok(solution) => serde_json::to_string(&solution)
            .unwrap_or_else(|_| "Error serializing solution".to_string()),
        Err(e) => {
            serde_json::to_string(&e).unwrap_or_else(|_| "Error serializing error".to_string())
        }
    }
}

#[wasm_bindgen]
pub fn calculate_concentration_change_json(
    chemical_database_json: String,
    conc_set_concentration: f64,
    conc_set_compound_name: String,
    conc_change_compound_name: String,
    target_pH: f64,
) -> String {
    // Deserialize the chemical database from JSON
    let mut chemical_database = ChemicalDatabase::new();
    chemical_database.populate_with_ions();
    chemical_database.populate_with_compounds();

    // Call the original Rust function
    let result = Solution::calculate_concentration_change(
        &chemical_database,
        conc_set_concentration,
        &conc_set_compound_name,
        &conc_change_compound_name,
        target_pH,
    );

    // Serialize the result or error into JSON
    match result {
        Ok(solution) => serde_json::to_string(&solution)
            .unwrap_or_else(|_| "Error serializing solution".to_string()),
        Err(e) => {
            serde_json::to_string(&e).unwrap_or_else(|_| "Error serializing error".to_string())
        }
    }
}

// fn main() {
//     println!("God, world!");
//     let mut chemical_database = ChemicalDatabase::new();
//     chemical_database.populate_with_ions();
//     chemical_database.populate_with_compounds();
//     // println!("God compounds: {:?}", chemical_database.compounds);
//     // println!("God ions: {:?}", chemical_database.ions);

//     let conc_set_concentration = 0.1;
//     let conc_set_compound_name = "Sodium Phosphate Monobasic";
//     let conc_change_compound_name = "Sodium Phosphate Dibasic";
//     let target_pH = 7.4;
//     let mut godsolution = Solution::new();
//     match Solution::calculate_concentration_change(
//         &chemical_database,
//         conc_set_concentration,
//         conc_set_compound_name,
//         conc_change_compound_name,
//         target_pH,
//     ) {
//         Ok(solution) => {
//             println!("God pH after: {}", solution.ph);
//             godsolution = solution;
//         }
//         Err(e) => {
//             println!("Error: {}", e);
//         }
//     }
//    let godsolution3 = Solution::calculate_composition_common_buffer_target_pH(
//         &conc_set_compound_name,
//         &conc_change_compound_name,
//         conc_set_concentration,
//         target_pH,
//         &chemical_database,
//     );

//     match godsolution3 {
//         Ok(solution) => {
//             println!("God pH after: {}", solution.ph);
//         }
//         Err(e) => {
//             println!("Error: {}", e);
//         }
//     }

//     let compounds_list = vec![
//         "Sodium Phosphate Monobasic",
//         "Sodium Phosphate Dibasic",
//         "Sodium Chloride",
//     ];

//     let compound_concs = vec![0.15, 0.1, 0.1];

//    let godsolution2 =    Solution::calculate_pH_compounds(compounds_list, compound_concs, &chemical_database);

// match godsolution2 {
//     Ok(solution) => {
//         println!("God pH after: {}", solution.ph);
//     }
//     Err(e) => {
//         println!("Error: {}", e);
//     }
// }

// }

// We will need to import these modules for our code
use std::collections::HashMap;

use std::f64; // for mathematical calculations
use std::fmt;

use std::vec;
use std::vec::Vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Ion {
    ion_id: usize,
    ion_name: String,
    is_buffer: bool,
    is_not_h: bool,
    pka: Vec<f64>,
    highest_charge: i32,
    counter_ion_charge: i32,
    ionic_concs: [f64; 4],
    charges: [i32; 4],
    ka: Vec<f64>,
    ka1: f64,
    ka2: f64,
    ka3: f64,
    ka1ka2: f64,
    ka1ka2ka3: f64,
    sol_conc: f64,
}
impl fmt::Display for Ion {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Ion: {}\nIs Buffer: {}\npKa: {:?}\nHighest Charge: {}\nIonic Concentrations: {:?}\nCharges: {:?}\n solution conc: {}\n",
               self.ion_name,
               self.is_buffer,
               self.pka,
               self.highest_charge,
               self.ionic_concs,
               self.charges,
               self.sol_conc)
    }
}
#[wasm_bindgen]
impl Ion {
    // Constructor function in Rust
    pub fn new(ion_name: String, is_buffer: bool, pka: Vec<f64>, highest_charge: i32) -> Ion {
        let charges: [i32; 4] = Self::generate_charges(highest_charge);
        let ka: Vec<f64> = Self::calculate_ka(&pka);
        let ka1: f64 = ka[0];
        let ka2: f64 = ka[1];
        let ka3: f64 = ka[2];
        let ka1ka2: f64 = ka1 * ka2;
        let ka1ka2ka3: f64 = ka1ka2 * ka3;
        let is_not_h = ion_name != "H";
        let counter_ion_charge = if !is_buffer && is_not_h {
            if highest_charge > 0 {
                1
            } else {
                -1
            }
        } else {
            0 // or any default value you want to assign when conditions are not met
        };
        Ion {
            ion_id: 0,
            ion_name,
            is_buffer,
            is_not_h,
            pka,
            highest_charge,
            counter_ion_charge,
            ionic_concs: [0.0; 4],
            charges,
            ka,
            ka1,
            ka2,
            ka3,
            ka1ka2,
            ka1ka2ka3,
            sol_conc: 0.0,
        }
    }

    fn generate_charges(highest_charge: i32) -> [i32; 4] {
        let mut charges = [0; 4];
        let mut charge = highest_charge;
        for i in 0..4 {
            charges[i] = charge;
            charge -= 1;
        }
        charges
    }
    // ka as a method returning a new Vec
    fn calculate_ka(pka: &Vec<f64>) -> Vec<f64> {
        let mut ka = vec![0.0; 3];
        for i in 0..3 {
            ka[i] = 10f64.powf(-pka[i]);
        }
        ka
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Compound {
    comp_id: usize,
    comp_name: String,
    comp_ion_id: Vec<usize>,
    stoichiometry: Vec<usize>,
    molecular_weight: f64,
    comp_conc: f64,
    is_salt: bool,
    is_buffer: bool,
    counter_ion_id: Option<usize>,
    counter_ion_charge: i32,
    buffer_ion_id: Option<usize>,
    is_single_ion: bool,
}
#[wasm_bindgen]
impl Compound {
    pub fn new(
        comp_id: usize,
        comp_name: String,
        comp_ion_id: Vec<usize>,
        stoichiometry: Vec<usize>,
        molecular_weight: f64,
        comp_conc: f64,
        // comp_ion_concs: [Option<f64>; 2],
    ) -> Compound {
        Compound {
            comp_id,
            comp_name,
            comp_ion_id,
            stoichiometry,
            molecular_weight,
            comp_conc,
            is_salt: false,
            is_buffer: false,
            counter_ion_id: None,
            counter_ion_charge: 0,
            buffer_ion_id: None,
            is_single_ion: false,
        }
    }
    pub fn ion_position(&self, ion_id: usize) -> Option<usize> {
        self.comp_ion_id.iter().position(|&id| id == ion_id)
    }
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct buffer_common_ion_parameters {
    counter_ion_id: Option<usize>,
    compounds_ids: Vec<usize>,
    counter_ion_charge: i32,
    is_feasible: bool,
    a: f64,
    b: f64,
    c: f64,
    d: f64,
    e: f64,
    f: f64,
}

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Solution {
    compounds: Vec<Compound>,
    compound_indices: HashMap<usize, usize>,
    solution_ions: Vec<Ion>,
    ion_indices: HashMap<usize, usize>,
    buffer_ion_compounds_map: HashMap<usize, Vec<usize>>,
    ph: f64,
    volume: f64,
    solution_type: SolutionType,
    result_flag: HashMap<String, String>,
    heat_map_data: HashMap<String, f64>, // Using ndarray for the matrix
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub enum SolutionType {
    SingleSpecies,
    DualSpecies,
    MultiSpecies,
    Stock,
    // Add more types as needed
}
#[wasm_bindgen]
impl Solution {
    pub fn new() -> Self {
        Solution {
            compounds: Vec::new(),
            compound_indices: HashMap::new(),
            solution_ions: Vec::new(),
            ion_indices: HashMap::new(),
            buffer_ion_compounds_map: HashMap::new(),
            ph: 0.0,
            volume: 1.0,
            solution_type: SolutionType::SingleSpecies,
            result_flag: HashMap::new(),
            heat_map_data: HashMap::new(),
        }
    }
    /// Calculates the concentration change for one compound to achieve a target pH.
    ///
    /// # Parameters
    /// - `chemical_database`: Reference to the chemical database.
    /// - `conc_set_concentration`: The concentration set for the compound.
    /// - `conc_set_compound_name`: The name of the compound in the concentration set.
    /// - `conc_change_compound_name`: The name of the compound to change concentration.
    /// - `target_pH`: The target pH to achieve.
    ///
    /// # Note
    /// This function only proceeds with the calculation if both compound IDs are found.
    pub fn calculate_conc_change_one_compound_conc_target_pH(
        &mut self,
        chemical_database: &ChemicalDatabase, // Assuming ChemicalDatabase is the type
        conc_set_concentration: f64,
        conc_set_compound_name: &str,
        conc_change_compound_name: &str,
        target_pH: f64,
    ) {
        if let (Some(compound_conc_set_id), Some(compound_conc_change_id)) = (
            self.add_comp(conc_set_compound_name, chemical_database),
            self.add_comp(conc_change_compound_name, chemical_database),
        ) {
            // Both IDs are available, proceed to call calculate_sing..
            self.calculate_single_compound_conc_target_pH(
                compound_conc_set_id,
                conc_set_concentration,
                compound_conc_change_id,
                target_pH,
            );
        } else {
            println!("Error: One or both compound IDs not found.");
        }
    }

    pub fn get_common_ion_buffer_parameters(
        &mut self,
        total_buffer_conc: f64,
        target_pH: f64,
    ) -> buffer_common_ion_parameters {
        let mut counter_ion_id: Option<usize> = None;
        let mut counter_ion_conc = 0.0;
        let mut counter_ion_charge = 0;
        // let (counter_ion_id, counter_ion_charge) = self.get_counter_ion_id_charge();
        let compounds_with_two_ids: Vec<usize> = self
            .buffer_ion_compounds_map
            .iter()
            .filter_map(|(&_ion_id, compound_ids)| {
                if compound_ids.len() == 2 {
                    Some(compound_ids.clone())
                } else {
                    None
                }
            })
            .flatten()
            .collect();

        for compound_id in compounds_with_two_ids.iter() {
            let compound = self.get_compound_by_id(*compound_id).unwrap();
            counter_ion_id = compound.counter_ion_id;
            counter_ion_charge = compound.counter_ion_charge;
            if counter_ion_id != None {
                if let Some(ion) = self.get_ion_by_id(counter_ion_id.unwrap()) {
                    counter_ion_conc = ion.sol_conc;
                }
            }
        }
        let (comp_0_buffer_ion_stoic, comp_0_counter_ion_stoic) = {
            let compound = self.get_compound_by_id(compounds_with_two_ids[0]).unwrap();
            (
                compound.stoichiometry[0] as f64,
                compound.stoichiometry[1] as f64,
            )
        };
        let (comp_1_buffer_ion_stoic, comp_1_counter_ion_stoic) = {
            let compound = self.get_compound_by_id(compounds_with_two_ids[1]).unwrap();
            (
                compound.stoichiometry[0] as f64,
                compound.stoichiometry[1] as f64,
            )
        };
        let a = comp_0_counter_ion_stoic;
        let b = comp_1_counter_ion_stoic;
        let c = 0.0;
        let d = comp_0_buffer_ion_stoic;
        let e = comp_1_buffer_ion_stoic;
        let f = total_buffer_conc;

        let mut pH1 = 0.0;
        let mut pH2 = 0.0;

        self.set_compound_conc_target_buffer_ion_conc(compounds_with_two_ids[0], total_buffer_conc);
        // set the other compound concentrations to zero
        self.change_comp_conc(compounds_with_two_ids[1], 0.0);

        let sum_ion_concs = self
            .solution_ions
            .iter()
            .fold(0.0, |acc, ion| acc + ion.sol_conc);
        if sum_ion_concs > 0.6 {
            // calculate the pH of the solution
            println!("God: sum_ion_concs: is too high {}", sum_ion_concs);
        } else {
            pH1 = self.calculate_ph(1.0, 1.0, 0.01);

            // println!("God: pH  1 is {}", self.ph);
        }

        self.set_compound_conc_target_buffer_ion_conc(compounds_with_two_ids[1], total_buffer_conc);
        // set the other compound concentrations to zero
        self.change_comp_conc(compounds_with_two_ids[0], 0.0);

        let sum_ion_concs = self
            .solution_ions
            .iter()
            .fold(0.0, |acc, ion| acc + ion.sol_conc);
        if sum_ion_concs > 0.6 {
            // calculate the pH of the solution
            // println!("God: sum_ion_concs: is too high {}", sum_ion_concs);
        } else {
            pH2 = self.calculate_ph(1.0, 1.0, 0.01);

            // println!("God: pH 2 is {}", self.ph);
        }
        let is_feasible;
        //exit if target pH is not within the range of pH1 and pH2
        if target_pH < pH1 || target_pH > pH2 {
            is_feasible = false;
        } else {
            is_feasible = true;
        }

        // (
        //     counter_ion_id,
        //     compounds_with_two_ids,
        //     counter_ion_charge as f64,
        //     is_feasible,
        //     a,
        //     b,
        //     c,
        //     d,
        //     e,
        //     f,
        // )
        buffer_common_ion_parameters {
            counter_ion_id,
            compounds_ids: compounds_with_two_ids,
            counter_ion_charge,
            is_feasible,
            a,
            b,
            c,
            d,
            e,
            f,
        }
    }

    pub fn calculate_concentration_change(
        chemical_database: &ChemicalDatabase,
        conc_set_concentration: f64,
        conc_set_compound_name: &str,
        conc_change_compound_name: &str,
        target_pH: f64,
    ) -> Result<Solution, String> {
        let mut solution = Solution::new();
        match (
            solution.add_comp(conc_set_compound_name, chemical_database),
            solution.add_comp(conc_change_compound_name, chemical_database),
        ) {
            (Some(compound_conc_set_id), Some(compound_conc_change_id)) => {
                solution.calculate_single_compound_conc_target_pH(
                    compound_conc_set_id,
                    conc_set_concentration,
                    compound_conc_change_id,
                    target_pH,
                );
                Ok(solution)
            }
            _ => Err("One or both compound IDs not found.".to_owned()),
        }
    }

    pub fn non_salt_compound_ids(&self) -> Vec<usize> {
        self.compounds
            .iter()
            .filter(|compound| !compound.is_salt)
            .map(|compound| compound.comp_id)
            .collect()
    }

    pub fn get_compound_by_id(&self, comp_id: usize) -> Option<Compound> {
        self.compound_indices
            .get(&comp_id)
            .and_then(|compound_index| self.compounds.get(*compound_index).cloned())
    }
    pub fn get_ion_by_id(&self, ion_id: usize) -> Option<Ion> {
        self.ion_indices
            .get(&ion_id)
            .and_then(|ion_index| self.solution_ions.get(*ion_index).cloned())
    }

    pub fn get_salt_compound_ids(&self) -> Vec<usize> {
        self.compounds
            .iter()
            .filter(|compound| compound.is_salt)
            .map(|compound| compound.comp_id)
            .collect()
    }

    pub fn get_buffer_compound_ids(&self) -> Vec<usize> {
        self.compounds
            .iter()
            .filter(|compound| compound.is_buffer)
            .map(|compound| compound.comp_id)
            .collect()
    }

    pub fn set_compound_conc_target_buffer_ion_conc(
        &mut self,
        compound_id: usize,
        target_conc: f64,
    ) {
        // Get the compound and its buffer ion
        if let Some(compound) = self.get_compound_by_id(compound_id) {
            if let Some(buffer_ion_id) = compound.buffer_ion_id {
                // Calculate the new compound concentration based on the target buffer ion concentration
                if let Some(ion_position) = compound.ion_position(buffer_ion_id) {
                    let stoichiometry = compound.stoichiometry[ion_position];
                    let new_compound_conc = target_conc * stoichiometry as f64;
                    self.change_comp_conc(compound_id, new_compound_conc);
                } else {
                    println!("God: Buffer ion not found in compound");
                }
            }
        }
    }

    pub fn add_comp(&mut self, compound_name: &str, database: &ChemicalDatabase) -> Option<usize> {
        let mut non_salt_ion_count = 0;
        let mut salt_ion_count = 0;
        let mut ion_type: HashMap<usize, usize> = HashMap::new(); // 0 for buffer ion, 1 for counter ions, 2 for H ion

        if let Some(compound_id) = database.compound_map.get(compound_name) {
            self.compound_indices
                .insert(*compound_id, self.compounds.len());

            if let Some(compound) = database.compounds.get(compound_id) {
                for comp_ion_id in &compound.comp_ion_id {
                    if let Some(ion) = database.ions.get(comp_ion_id) {
                        // Check for "H" ions and skip unless it's a buffer
                        if ion.ion_name == "H" && !ion.is_buffer {
                            ion_type.insert(*comp_ion_id, 2);
                            continue;
                        }

                        // Add ion to solution_ions and update maps/counters based on ion type
                        let ion_index = self.solution_ions.len();
                        self.solution_ions.push(ion.clone());
                        self.ion_indices.entry(*comp_ion_id).or_insert(ion_index);

                        if ion.is_buffer {
                            non_salt_ion_count += 1;
                            ion_type.insert(*comp_ion_id, 0);
                        } else {
                            salt_ion_count += 1;
                            ion_type.insert(*comp_ion_id, 1);
                        }

                        // Update buffer_ion_compounds_map for both buffer and counter ions
                        self.buffer_ion_compounds_map
                            .entry(*comp_ion_id)
                            .or_insert_with(Vec::new)
                            .push(*compound_id);
                    }
                }
                self.compounds.push(compound.clone());
            }

            Some(*compound_id)
        } else {
            None
        }
    }

    pub fn set_conc_by_name(
        &mut self,
        compound_name: &str,
        conc: f64,
        database: &ChemicalDatabase,
    ) {
        if let Some(compound_id) = database.compound_map.get(compound_name) {
            self.set_init_comp_conc(*compound_id, conc);
        }
    }

    pub fn set_init_comp_conc(&mut self, compound_id: usize, conc: f64) {
        // Use early return to avoid deep nesting
        let compound_index = match self.compound_indices.get(&compound_id) {
            Some(index) => index,
            None => return,
        };

        let compound = match self.compounds.get_mut(*compound_index) {
            Some(comp) => comp,
            None => return,
        };

        // Set the compound concentration directly
        compound.comp_conc = conc;

        // Update the ion concentrations based on the new compound concentration
        for (index, comp_ion_id) in compound.comp_ion_id.iter().enumerate() {
            if let Some(ion_index) = self.ion_indices.get(comp_ion_id) {
                if let Some(ion) = self.solution_ions.get_mut(*ion_index) {
                    ion.sol_conc += conc * compound.stoichiometry[index] as f64;
                }
            }
        }
    }

    pub fn change_comp_conc(&mut self, compound_id: usize, new_conc: f64) {
        let compound_index = match self.compound_indices.get(&compound_id) {
            Some(index) => *index,
            None => return, // Early exit if compound ID is not found
        };

        let compound = match self.compounds.get_mut(compound_index) {
            Some(comp) => comp,
            None => return, // Early exit if compound index is invalid
        };

        let old_conc = compound.comp_conc;
        compound.comp_conc = new_conc;

        compound
            .comp_ion_id
            .iter()
            .enumerate()
            .for_each(|(index, comp_ion_id)| {
                if let Some(ion_index) = self.ion_indices.get(comp_ion_id) {
                    if let Some(ion) = self.solution_ions.get_mut(*ion_index) {
                        let stoich = compound.stoichiometry[index] as f64; // Cache stoichiometry value
                                                                           //println!("God: ion.sol_conc before sub: {} is {}", ion.ion_name, ion.sol_conc);
                        ion.sol_conc -= old_conc * stoich; // Adjust ion concentration for the old compound concentration
                                                           //println!("God: ion.sol_conc before: {} is {}", ion.ion_name,ion.sol_conc);
                        ion.sol_conc += new_conc * stoich; // Adjust ion concentration for the new compound concentration
                                                           //println!("God: ion.sol_conc after: {} is {}", ion.ion_name,ion.sol_conc);
                    }
                }
            });
    }

    pub fn add_comp_conc(&mut self, compound_id: usize, conc: f64) {
        let compound_index = match self.compound_indices.get(&compound_id) {
            Some(index) => *index,
            None => return, // Return early if the compound ID is not found
        };

        let compound = match self.compounds.get_mut(compound_index) {
            Some(comp) => comp,
            None => return, // Return early if the compound index is invalid
        };

        // Increment compound concentration
        compound.comp_conc += conc;

        // Update solution ions' concentrations
        for (index, comp_ion_id) in compound.comp_ion_id.iter().enumerate() {
            if let Some(ion_index) = self.ion_indices.get(comp_ion_id) {
                if let Some(ion) = self.solution_ions.get_mut(*ion_index) {
                    // Ensure stoichiometry is used as f64
                    let stoichiometry = compound.stoichiometry[index] as f64; // Explicitly cast if needed
                    ion.sol_conc += conc * stoichiometry;
                }
            }
        }
    }

    pub fn ion_concs_unique_ions(&mut self, ph: f64) -> f64 {
        let mut sumcharge = 0.0;
        let mut sum_is = 0.0;
        let h = 10f64.powf(-ph);
        const KW: f64 = 0.00000000000001;
        let pos_hplus_oh = h + KW / h;
        let hplus_oh = h - KW / h;
        let h_squared = h * h;
        let h_cubed = h_squared * h;
        let mut ka1: f64;
        let mut ka1ka2: f64;
        let mut ka1ka2ka3: f64;
        let mut denom: f64;

        for ion in &self.solution_ions {
            let c1 = ion.highest_charge as f64;
            ka1 = ion.ka1;
            ka1ka2 = ion.ka1ka2;
            ka1ka2ka3 = ion.ka1ka2ka3;
            denom = ion.sol_conc / (h_cubed + h_squared * ka1 + h * ka1ka2 + ka1ka2ka3);

            sum_is += (c1 * c1 * h_cubed
                + (c1 - 1.0) * (c1 - 1.0) * h_squared * ka1
                + (c1 - 2.0) * (c1 - 2.0) * h * ka1ka2
                + (c1 - 3.0) * (c1 - 3.0) * ka1ka2ka3)
                * denom;
        }

        sum_is += pos_hplus_oh;
        let sqrt_i = (sum_is / 2.0).sqrt();
        let is_correction = 0.51 * sqrt_i / (1.0 + 1.6 * sqrt_i) - 0.3 * sum_is / 2.0;

        sum_is = 0.0;

        for ion in &self.solution_ions {
            let c1 = ion.highest_charge as f64;
            if !ion.is_buffer {
                ka1 = ion.ka1;
                ka1ka2 = ion.ka1ka2;
                ka1ka2ka3 = ion.ka1ka2ka3;
            } else {
                ka1 = ion.ka1 * 10f64.powf(-is_correction * (2.0 * c1 - 1.0));
                ka1ka2 = ion.ka1ka2 * 10f64.powf(-is_correction * (4.0 * c1 - 4.0));
                ka1ka2ka3 = ion.ka1ka2ka3 * 10f64.powf(-is_correction * (6.0 * c1 - 9.0));
            }

            let denom =
                ion.sol_conc / (h_cubed + h_squared * ion.ka1 + h * ion.ka1ka2 + ion.ka1ka2ka3);

            sum_is += (c1 * c1 * h_cubed
                + (c1 - 1.0) * (c1 - 1.0) * h_squared * ka1
                + (c1 - 2.0) * (c1 - 2.0) * h * ka1ka2
                + (c1 - 3.0) * (c1 - 3.0) * ka1ka2ka3)
                * denom;
        }

        let sqrt_i = ((sum_is + pos_hplus_oh) / 2.0).sqrt();
        let is_correction = 0.51 * sqrt_i / (1.0 + 1.6 * sqrt_i) - 0.3 * sum_is / 2.0;

        for ion in &mut self.solution_ions {
            let c1 = ion.highest_charge as f64;
            if !ion.is_buffer {
                ka1 = ion.ka1;
                ka1ka2 = ion.ka1ka2;
                ka1ka2ka3 = ion.ka1ka2ka3;
            } else {
                ka1 = ion.ka1 * 10f64.powf(-is_correction * (2.0 * c1 - 1.0));
                ka1ka2 = ion.ka1ka2 * 10f64.powf(-is_correction * (4.0 * c1 - 4.0));
                ka1ka2ka3 = ion.ka1ka2ka3 * 10f64.powf(-is_correction * (6.0 * c1 - 9.0));
            }

            let denom =
                ion.sol_conc / (h_cubed + h_squared * ion.ka1 + h * ion.ka1ka2 + ion.ka1ka2ka3);
            ion.ionic_concs[0] = c1 * h_cubed * denom;
            ion.ionic_concs[1] = (c1 - 1.0) * h_squared * ka1 * denom;
            ion.ionic_concs[2] = (c1 - 2.0) * h * ka1ka2 * denom;
            ion.ionic_concs[3] = (c1 - 3.0) * ka1ka2ka3 * denom;

            sumcharge += (c1 * h_cubed
                + (c1 - 1.0) * h_squared * ion.ka1
                + (c1 - 2.0) * h * ion.ka1ka2
                + (c1 - 3.0) * ion.ka1ka2ka3)
                * denom
        }

        sumcharge += hplus_oh;

        sumcharge
    }

    fn calculate_ph(&mut self, initial_ph: f64, mut interval: f64, tolerance: f64) -> f64 {
        let mut current_ph = initial_ph;
        let mut sum_of_charges: f64 = 1.0;
        let mut sign_change = false;
        let mut previous_sign = 0.0;
        let mut previous_ph = 0.0;
        let mut iter = 0;

        while sum_of_charges.abs() > tolerance {
            iter += 1;
            if iter > 1000 {
                //println!("God: iter {}, {}, {:?}", iter, current_ph, self.solution_ions);
                break;
            }

            if !sign_change {
                previous_ph = current_ph;
                previous_sign = sum_of_charges;
                current_ph += interval;
                sum_of_charges = self.ion_concs_unique_ions(current_ph);
                //println!("God: if iter {}, {}, {:?}", iter, current_ph, sum_of_charges);
                if sum_of_charges < 0.0 {
                    sign_change = true;
                }
            } else {
                interval = current_ph - previous_ph;
                current_ph = -previous_sign * interval / (sum_of_charges - previous_sign)
                    + (current_ph - interval);
                previous_ph += interval;
                interval /= 10.0;
                previous_sign = sum_of_charges;
                sum_of_charges = self.ion_concs_unique_ions(current_ph);
                //println!("God: else iter {}, {}, {:?}", iter, current_ph, sum_of_charges);
                sign_change = false;
            }
        }

        self.ph = current_ph;

        current_ph
    }

    // pub fn get_counter_ion_id_charge(&self) -> (usize, i32) {
    //     let (compound_ids, ion_id) = self
    //         .buffer_ion_compounds_map
    //         .iter()
    //         .find_map(|(&ion_id, compound_ids)| {
    //             if compound_ids.len() == 2 {
    //                 Some((compound_ids.clone(), ion_id))
    //             } else {
    //                 None
    //             }
    //         })
    //         .unwrap_or_else(|| (vec![], 0)); // Default to empty vector and 0 if not found

    //     let counter_ion_charge = compound_ids
    //         .iter()
    //         .filter_map(|id| {
    //             self.compounds
    //                 .iter()
    //                 .find(|&compound| compound.comp_id == *id)
    //         })
    //         .map(|compound| compound.counter_ion_charge)
    //         .sum();

    //     (ion_id, counter_ion_charge)
    // }

    pub fn calculate_single_compound_conc_target_pH(
        &mut self,
        comp_id_set_conc: usize,
        comp_conc: f64,
        comp_id_change_conc: usize,
        target_pH: f64,
    ) {
        let mut current_sumcharge = 0.0;

        self.set_compound_conc_target_buffer_ion_conc(comp_id_set_conc, comp_conc);
        self.change_comp_conc(comp_id_change_conc, 0.0);
        // self.calculate_ph(1.0, 1.0, 0.0001);
        // let mut pH1 = self.ph;
        current_sumcharge = self.ion_concs_unique_ions(target_pH);

        self.change_comp_conc(comp_id_change_conc, 0.1);
        let current_sumchargeatpoint1 = self.ion_concs_unique_ions(target_pH);
        let target_conc =
            (0.1 * (-current_sumcharge) / (current_sumchargeatpoint1 - current_sumcharge)).abs();
        //println!(" God sumcharge is {} and sumcharge at point {}", current_sumcharge, current_sumchargeatpoint1);
        //println!("God: pH  1 is {}", self.ph);

        self.change_comp_conc(comp_id_change_conc, target_conc);
        self.calculate_ph(1.0, 1.0, 0.00001);
    }

    pub fn calculate_composition_common_buffer_target_pH(
        buffer_compound_1_name: &str,
        buffer_compound_2_name: &str,
        total_buffer_conc: f64,
        target_pH: f64,
        chemical_database: &ChemicalDatabase,
    ) -> Result<Solution, String> {
        let mut solution = Solution::new();
        let mut _buffer_compound_1_id = 0;
        let mut _buffer_compound_2_id = 0;

        match (
            solution.add_comp(buffer_compound_1_name, chemical_database),
            solution.add_comp(buffer_compound_2_name, chemical_database),
        ) {
            (Some(_buffer_compound_1_id), Some(_buffer_compound_2_id)) => {
                let parameters =
                    solution.get_common_ion_buffer_parameters(total_buffer_conc, target_pH);
                solution.calculate_compound_conc_common_buffer_ion(
                    total_buffer_conc,
                    target_pH,
                    parameters,
                );
                Ok(solution)
            }
            _ => Err("One or both compound IDs not found.".to_owned()),
        }
    }

    pub fn calculate_pH_compounds(
        compounds_name_list: Vec<String>,
        compounds_conc_list: Vec<f64>,
        chemical_database: &ChemicalDatabase,
    ) -> Result<Solution, String> {
        let mut solution = Solution::new();

        for (i, compound_name) in compounds_name_list.iter().enumerate() {
            match solution.add_comp(compound_name, chemical_database) {
                Some(compound_id) => {
                    solution.set_init_comp_conc(compound_id, compounds_conc_list[i]);
                }
                None => return Err("One or both compound IDs not found.".to_owned()),
            }
        }
        solution.calculate_ph(1.0, 1.0, 0.01);
        Ok(solution)
    }

    pub fn calculate_pH_compounds_changed_conc(
        mut godsolution: Solution,
        compounds_name_list: Vec<String>,
        compounds_conc_list: Vec<f64>,
    ) -> Solution {
        let mut updates = Vec::new();

        for (name, &conc) in compounds_name_list.iter().zip(compounds_conc_list.iter()) {
            if let Some(compound) = godsolution.compounds.iter().find(|c| c.comp_name == *name) {
                updates.push((compound.comp_id, conc));
            }
        }

        // Now, iterate over the updates and modify `godsolution`
        for (comp_id, conc) in updates {
            godsolution.change_comp_conc(comp_id, conc);
        }
        godsolution.calculate_ph(1.0, 1.0, 0.01);

        godsolution
    }

    pub fn calculate_compound_conc_common_buffer_ion(
        &mut self,
        total_buffer_conc: f64,
        target_pH: f64,
        mut parameters: buffer_common_ion_parameters,
    ) {
        // println!("God : parameters are {:?}", &parameters);
        // let (counter_ion_id, compound_ids, counter_ion_charge, is_feasible, a, b, mut c, d, e, f) =
        //     parameters;
        let mut counter_ion_conc = 0.0;
        let mut comp_0_conc = 0.0;
        let mut comp_1_conc = 0.0;

        self.set_compound_conc_target_buffer_ion_conc(
            parameters.compounds_ids[0],
            total_buffer_conc,
        );
        self.set_compound_conc_target_buffer_ion_conc(parameters.compounds_ids[1], 0.0);

        println!(
            "God ion concentrations: {:?}",
            self.solution_ions
                .iter()
                .map(|ion| ion.sol_conc)
                .collect::<Vec<f64>>()
        );

        if parameters.counter_ion_id != None {
            if let Some(ion) = self.get_ion_by_id(parameters.counter_ion_id.unwrap()) {
                counter_ion_conc = ion.sol_conc;
            }
        }

        println!("God: counter_ion_conc 1 initial is {}", counter_ion_conc);

        let additional_sumcharge = self.ion_concs_unique_ions(target_pH);
        println!("God: additional_sumcharge 1 is {}", additional_sumcharge);

        counter_ion_conc =
            counter_ion_conc - parameters.counter_ion_charge as f64 * additional_sumcharge;
        println!("God: counter_ion_conc 1 is {}", counter_ion_conc);

        parameters.c = counter_ion_conc;

        let denominator = parameters.a * parameters.e - parameters.b * parameters.d;
        if denominator != 0.0 {
            comp_0_conc = (parameters.c * parameters.e - parameters.b * parameters.f) / denominator; // Declare and assign in one step
            comp_1_conc = (parameters.a * parameters.f - parameters.c * parameters.d) / denominator;

            println!(
                "God: comp_0_conc is {} and comp_1_conc is {}",
                comp_0_conc, comp_1_conc
            );
            self.change_comp_conc(parameters.compounds_ids[0], comp_0_conc);
            self.change_comp_conc(parameters.compounds_ids[1], comp_1_conc);

            println!(
                "God ion concentrations after first: {:?}",
                self.solution_ions
                    .iter()
                    .map(|ion| ion.sol_conc)
                    .collect::<Vec<f64>>()
            );
            self.calculate_ph(1.0, 1.0, 0.0001);
            println!("God pH iteration 1 is {}", self.ph);
        } else {
            println!("God: No solution exists");
            return;
        }

        let mut comp_0_conc = 0.0;
        let mut comp_1_conc = 0.0;

        let additional_sumcharge = self.ion_concs_unique_ions(target_pH);
        println!("God: additional_sumcharge 2 is {}", additional_sumcharge);

        let mut counter_ion_conc = match self.get_ion_by_id(parameters.counter_ion_id.unwrap()) {
            Some(ion) => ion.sol_conc,
            None => 0.0, // Assuming sol_conc is a float and you want to default to 0.0 if not found
        };
        println!(
            "God: counter_ion_conc before adjust is {}",
            counter_ion_conc
        );

        counter_ion_conc =
            counter_ion_conc - parameters.counter_ion_charge as f64 * additional_sumcharge;
        println!("God: counter_ion_conc 2 is {}", counter_ion_conc);

        parameters.c = counter_ion_conc;

        let denominator = parameters.a * parameters.e - parameters.b * parameters.d;
        if denominator != 0.0 {
            comp_0_conc = (parameters.c * parameters.e - parameters.b * parameters.f) / denominator; // Declare and assign in one step
            comp_1_conc = (parameters.a * parameters.f - parameters.c * parameters.d) / denominator;

            println!(
                "God: comp_0_conc is {} and comp_1_conc is {}",
                comp_0_conc, comp_1_conc
            );
            self.change_comp_conc(parameters.compounds_ids[0], comp_0_conc);
            self.change_comp_conc(parameters.compounds_ids[1], comp_1_conc);
            self.calculate_ph(1.0, 1.0, 0.0001);
            println!("God pH iteration 2 is {}", self.ph);
        } else {
            println!("God: No solution exists");
            return;
        }
    }
}
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct ChemicalDatabase {
    compound_map: HashMap<String, usize>,
    compounds: HashMap<usize, Compound>,
    ion_map: HashMap<String, usize>,
    ions: HashMap<usize, Ion>,
    salt_compounds: HashMap<String, usize>,
}

impl ChemicalDatabase {
    pub fn new() -> Self {
        Self {
            compound_map: HashMap::<String, usize>::new(),
            compounds: HashMap::<usize, Compound>::new(),
            ion_map: HashMap::<String, usize>::new(),
            ions: HashMap::<usize, Ion>::new(),
            salt_compounds: HashMap::<String, usize>::new(),
        }
    }

    pub fn find_add_salt_compounds(&mut self) {
        //Find all the salt compounds in the database
        let mut salt_compound_names: Vec<String> = Vec::new();
        salt_compound_names.push("Sodium Chloride".to_string());
        salt_compound_names.push("Potassium Chloride".to_string());
        salt_compound_names.push("Ammonium Chloride".to_string());
        salt_compound_names.push("Ammonium Sulfate".to_string());
        salt_compound_names.push("Sodium Sulfate".to_string());
        salt_compound_names.push("Potassium Sulfate".to_string());

        for salt_compound_name in salt_compound_names {
            if let Some(compound_id) = self.compound_map.get(&salt_compound_name) {
                self.salt_compounds.insert(salt_compound_name, *compound_id);
            }
        }
    }

    fn get_compound_by_name(&self, compound_name: &str) -> Option<&Compound> {
        self.compound_map
            .get(compound_name) // Step 1: Get usize ID from compound_map
            .and_then(|&id| self.compounds.get(&id)) // Step 2: Use usize ID to get Compound from compounds
    }

    //get compound id by name from the compound map
    pub fn get_compound_id_by_name(&self, compound_name: &str) -> Option<usize> {
        self.compound_map.get(compound_name).map(|&id| id)
    }
    fn get_ion_by_name(&self, ion_name: &str) -> Option<&Ion> {
        self.ion_map
            .get(ion_name) // Step 1: Get usize ID from ion_map
            .and_then(|&id| self.ions.get(&id)) // Step 2: Use usize ID to get Ion from ions
    }
    pub fn add_ion(&mut self, mut ion: Ion) {
        self.ion_map.insert(ion.ion_name.clone(), self.ions.len());
        ion.ion_id = self.ions.len();
        if !ion.is_buffer && ion.ion_name != "H" {
            ion.counter_ion_charge = if ion.highest_charge > 0 { 1 } else { -1 };
        } else {
            ion.counter_ion_charge = 0;
        }

        self.ions.insert(self.ions.len(), ion);
    }

    pub fn create_compound(
        &mut self,
        name: String,
        molecular_weight: f64,
        mut ion_data: Vec<(String, usize)>, // Vector of tuples (ion name, stoichiometry)
        initial_concentration: f64,
    ) {
        if ion_data.len() == 1 {
            ion_data.push(("H".to_string(), 0));
        }
        let mut comp_ion_id = vec![0; 2];
        let mut stoichiometry = vec![0; 2];

        self.compound_map.insert(name.clone(), self.compounds.len());
        for (index, ion_data) in ion_data.iter().enumerate() {
            if let Some(ion_id) = self.ion_map.get(&ion_data.0) {
                comp_ion_id[index] = *ion_id;
                stoichiometry[index] = ion_data.1;
            } else {
                println!("Ion {} not found in registry", name);
            }
        }

        let ion1 = self.get_ion_by_name(&ion_data[0].0).unwrap();
        let ion2 = self.get_ion_by_name(&ion_data[1].0).unwrap();
        let is_salt =
            ion1.is_buffer == false && ion2.is_buffer == false && ion1.is_not_h && ion2.is_not_h;

        let is_buffer = ion1.is_buffer || ion2.is_buffer;

        let is_single_ion =
            (ion1.is_buffer && !ion2.is_not_h) || (!ion1.is_not_h && ion2.is_buffer);

        let counter_ion_id = match (is_single_ion, ion1.is_buffer, ion2.is_buffer) {
            (false, true, _) => Some(comp_ion_id[1]),
            (false, _, true) => Some(comp_ion_id[0]),
            _ => None,
        };

        let counter_ion_charge = match (ion1.counter_ion_charge, ion2.counter_ion_charge) {
            (0, 0) => 0,
            (0, _) => ion2.counter_ion_charge,
            (_, _) => ion1.counter_ion_charge,
        };

        let buffer_ion_id = if ion1.is_buffer {
            Some(comp_ion_id[0])
        } else if ion2.is_buffer {
            Some(comp_ion_id[1])
        } else {
            None
        };

        let mut newcompound = Compound::new(
            self.compounds.len(),
            name,
            comp_ion_id,
            stoichiometry,
            molecular_weight,
            initial_concentration,
        );
        newcompound.is_salt = is_salt;
        newcompound.is_buffer = is_buffer;
        newcompound.counter_ion_id = counter_ion_id;
        newcompound.counter_ion_charge = counter_ion_charge;
        newcompound.buffer_ion_id = buffer_ion_id;
        newcompound.is_single_ion = is_single_ion;

        //println!("God comp_id: {} and name is {}", self.compounds.len(), name);
        self.compounds.insert(self.compounds.len(), newcompound);
    }

    pub fn populate_with_compounds(&mut self) {
        self.create_compound(
            "Tris Base".to_string(),
            121.14,
            vec![("Tris".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Formic Acid".to_string(),
            46.03,
            vec![("Formate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Acetic Acid".to_string(),
            59.04,
            vec![("Acetate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Citric Acid".to_string(),
            192.13,
            vec![("Citrate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Phosphoric Acid".to_string(),
            96.09,
            vec![("Phosphate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sodium MES".to_string(),
            195.2,
            vec![("MES".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );
        self.create_compound(
            "Bis.Tris base".to_string(),
            209.3,
            vec![("Bis.Tris".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Bis.Tris.Propane base".to_string(),
            223.4,
            vec![("Bis.Tris.Propane".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sulfuric Acid".to_string(),
            98.08,
            vec![("Sulfate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Hydrochloric Acid".to_string(),
            36.46,
            vec![("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Tris HCl".to_string(),
            157.6,
            vec![("Tris".to_string(), 1), ("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Trolamine".to_string(),
            149.2,
            vec![("Trolamine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sodium Hydroxide".to_string(),
            40.0,
            vec![("Sodium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Potassium Hydroxide".to_string(),
            56.1,
            vec![("Potassium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Ammonium Hydroxide".to_string(),
            35.05,
            vec![("Ammonium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Histidine".to_string(),
            155.15,
            vec![("Histidine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Arginine".to_string(),
            174.2,
            vec![("Arginine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Glutamic Acid".to_string(),
            147.13,
            vec![("Glutamate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Aspartic Acid".to_string(),
            133.1,
            vec![("Aspartate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "HEPES Acid".to_string(),
            238.3,
            vec![("HEPES".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Hydrochloric Acid".to_string(),
            36.46,
            vec![("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "ACES acid".to_string(),
            182.2,
            vec![("ACES".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "ADA acid".to_string(),
            163.2,
            vec![("ADA".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "AMPD acid".to_string(),
            130.2,
            vec![("AMPD".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "AMP acid".to_string(),
            136.1,
            vec![("AMP".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "GABA acid".to_string(),
            103.1,
            vec![("GABA".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "AMPSO acid".to_string(),
            163.2,
            vec![("AMPSO".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "BES acid".to_string(),
            213.3,
            vec![("BES".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Bicine acid".to_string(),
            163.2,
            vec![("Bicine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Borate acid".to_string(),
            61.83,
            vec![("Borate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "CABS acid".to_string(),
            163.2,
            vec![("CABS".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "CAPS acid".to_string(),
            182.2,
            vec![("CAPS".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "CAPSO acid".to_string(),
            198.2,
            vec![("CAPSO".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Carbonate acid".to_string(),
            105.99,
            vec![("Carbonate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "CHES acid".to_string(),
            207.3,
            vec![("CHES".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Cysteine acid".to_string(),
            121.16,
            vec![("Cysteine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Diethanolamine base".to_string(),
            105.14,
            vec![("Diethanolamine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Diglycolate acid".to_string(),
            134.1,
            vec![("Diglycolate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Dimethylglutarate acid".to_string(),
            160.2,
            vec![("Dimethylglutarate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "DIPSO acid".to_string(),
            163.2,
            vec![("DIPSO".to_string(), 1)],
            0.0,
        );
        self.create_compound(
            "Ethanolamine base".to_string(),
            61.8,
            vec![("Ethanolamine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Ethanolamine HCl".to_string(),
            97.57,
            vec![("Ethanolamine".to_string(), 1), ("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sodium Phosphate Monobasic".to_string(),
            119.98,
            vec![("Phosphate".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );
        self.create_compound(
            "Sodium Phosphate Dibasic".to_string(),
            141.96,
            vec![("Phosphate".to_string(), 1), ("Sodium".to_string(), 2)],
            0.0,
        );

        self.create_compound(
            "Sodium Phosphate Tribasic".to_string(),
            163.94,
            vec![("Phosphate".to_string(), 1), ("Sodium".to_string(), 3)],
            0.0,
        );

        self.create_compound(
            "Sodium Citrate".to_string(),
            294.1,
            vec![("Citrate".to_string(), 1), ("Sodium".to_string(), 3)],
            0.0,
        );

        self.create_compound(
            "Sodium Acetate".to_string(),
            136.08,
            vec![("Acetate".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sodium Formate".to_string(),
            68.01,
            vec![("Formate".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sodium HEPES".to_string(),
            260.29,
            vec![("HEPES".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Histidine Base".to_string(),
            155.15,
            vec![("Histidine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Arginine Base".to_string(),
            174.2,
            vec![("Arginine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Arginine HCl".to_string(),
            210.7,
            vec![("Arginine".to_string(), 1), ("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Trolamine Base".to_string(),
            149.2,
            vec![("Trolamine".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Trolamine HCl".to_string(),
            185.7,
            vec![("Trolamine".to_string(), 1), ("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Bis.Tris HCl".to_string(),
            223.4,
            vec![("Bis.Tris".to_string(), 1), ("Chloride".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Bis.Tris.Propane HCl".to_string(),
            237.5,
            vec![
                ("Bis.Tris.Propane".to_string(), 1),
                ("Chloride".to_string(), 1),
            ],
            0.0,
        );

        self.create_compound(
            "Sodium Sulfate".to_string(),
            142.04,
            vec![("Sulfate".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Sodium Chloride".to_string(),
            58.44,
            vec![("Chloride".to_string(), 1), ("Sodium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Ammonium Sulfate".to_string(),
            132.14,
            vec![("Sulfate".to_string(), 1), ("Ammonium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Ammonium Chloride".to_string(),
            53.49,
            vec![("Chloride".to_string(), 1), ("Ammonium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Potassium Sulfate".to_string(),
            174.26,
            vec![("Sulfate".to_string(), 1), ("Potassium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Potassium Chloride".to_string(),
            74.55,
            vec![("Chloride".to_string(), 1), ("Potassium".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Boric Acid".to_string(),
            61.83,
            vec![("Borate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Aspartic Acid".to_string(),
            133.1,
            vec![("Aspartate".to_string(), 1)],
            0.0,
        );

        self.create_compound(
            "Glutamic Acid".to_string(),
            147.13,
            vec![("Glutamate".to_string(), 1)],
            0.0,
        );
    }

    pub fn populate_with_ions(&mut self) {
        self.add_ion(Ion::new("H".to_string(), false, vec![0.0, 0.0, 0.0], 0));
        self.add_ion(Ion::new(
            "Formate".to_string(),
            true,
            vec![3.75, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Acetate".to_string(),
            true,
            vec![4.76, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Citrate".to_string(),
            true,
            vec![3.128, 4.761, 6.396],
            0,
        ));
        self.add_ion(Ion::new(
            "Phosphate".to_string(),
            true,
            vec![2.15, 7.20, 12.35],
            0,
        ));
        self.add_ion(Ion::new("MES".to_string(), true, vec![6.27, 14.0, 14.0], 0));
        self.add_ion(Ion::new(
            "Bis.Tris".to_string(),
            true,
            vec![6.484, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Bis.Tris.Propane".to_string(),
            true,
            vec![6.65, 9.1, 14.0],
            2,
        ));
        self.add_ion(Ion::new(
            "Sulfate".to_string(),
            false,
            vec![-3.0, 1.99, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Chloride".to_string(),
            false,
            vec![1.0, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Tris".to_string(),
            true,
            vec![8.072, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Trolamine".to_string(),
            true,
            vec![7.8, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Sodium".to_string(),
            false,
            vec![14.0, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Potassium".to_string(),
            false,
            vec![14.0, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Ammonium".to_string(),
            false,
            vec![14.0, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Histidine".to_string(),
            true,
            vec![1.5, 6.07, 9.34],
            2,
        ));
        self.add_ion(Ion::new(
            "Arginine".to_string(),
            true,
            vec![2.17, 9.04, 12.48],
            2,
        ));
        self.add_ion(Ion::new(
            "Glutamate".to_string(),
            true,
            vec![2.19, 4.25, 9.67],
            1,
        ));
        self.add_ion(Ion::new(
            "Aspartate".to_string(),
            true,
            vec![1.88, 3.65, 9.60],
            1,
        ));
        self.add_ion(Ion::new(
            "HEPES".to_string(),
            true,
            vec![3.0, 7.564, 14.0],
            1,
        ));
        self.add_ion(Ion::new("H".to_string(), false, vec![14.0, 14.0, 14.0], 0));
        self.add_ion(Ion::new("OH".to_string(), false, vec![1.0, 14.0, 14.0], 0));
        self.add_ion(Ion::new(
            "ACES".to_string(),
            true,
            vec![6.6847, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "ADA".to_string(),
            true,
            vec![1.59, 2.48, 6.844],
            1,
        ));
        self.add_ion(Ion::new(
            "AMPD".to_string(),
            true,
            vec![8.801, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "AMP".to_string(),
            true,
            vec![9.694, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "GABA".to_string(),
            true,
            vec![10.2, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "AMPSO".to_string(),
            true,
            vec![9.138, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "BES".to_string(),
            true,
            vec![7.187, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "BICINE".to_string(),
            true,
            vec![2.0, 8.334, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Borate".to_string(),
            true,
            vec![9.237, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "CABS".to_string(),
            true,
            vec![10.7, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "CAPS".to_string(),
            true,
            vec![10.499, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "CAPSO".to_string(),
            true,
            vec![9.825, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Carbonate".to_string(),
            true,
            vec![1.0, 6.351, 10.329],
            0,
        ));
        self.add_ion(Ion::new(
            "CHES".to_string(),
            true,
            vec![9.394, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Cysteine".to_string(),
            true,
            vec![1.71, 8.36, 10.75],
            1,
        ));
        self.add_ion(Ion::new(
            "Diethanolamine".to_string(),
            true,
            vec![8.883, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Diglycolate".to_string(),
            true,
            vec![3.05, 4.37, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Dimethylglutarate".to_string(),
            true,
            vec![3.7, 6.34, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "DIPSO".to_string(),
            true,
            vec![7.576, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Ethanolamine".to_string(),
            true,
            vec![9.498, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "N-ethylmorpholine".to_string(),
            true,
            vec![7.77, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Glycerol 2-phosphate".to_string(),
            true,
            vec![1.329, 6.65, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Glycine".to_string(),
            true,
            vec![2.351, 9.78, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Glycinamide".to_string(),
            true,
            vec![8.04, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Glycylglycine".to_string(),
            true,
            vec![3.14, 8.265, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Glyclglyclglycine".to_string(),
            true,
            vec![3.224, 8.09, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "HEPBS".to_string(),
            true,
            vec![8.3, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "HEPPS".to_string(),
            true,
            vec![7.957, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "HEPPSO".to_string(),
            true,
            vec![8.042, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Hydrazine".to_string(),
            true,
            vec![-0.099, 8.02, 14.0],
            2,
        ));
        self.add_ion(Ion::new(
            "Imidazole".to_string(),
            true,
            vec![6.993, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Maleate".to_string(),
            true,
            vec![1.92, 6.27, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Mercaptoethanol".to_string(),
            true,
            vec![9.7, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Methylamine".to_string(),
            true,
            vec![10.645, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Methylimidazole".to_string(),
            true,
            vec![8.0, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new("MOBS".to_string(), true, vec![7.6, 14.0, 14.0], 0));
        self.add_ion(Ion::new(
            "MOPS".to_string(),
            true,
            vec![7.184, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "MOPSO".to_string(),
            true,
            vec![0.06, 6.9, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Oxalate".to_string(),
            true,
            vec![1.27, 4.266, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Phosphate".to_string(),
            true,
            vec![2.148, 7.198, 12.35],
            0,
        ));
        self.add_ion(Ion::new(
            "Phthalate".to_string(),
            true,
            vec![2.95, 5.408, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Piperazine".to_string(),
            true,
            vec![5.333, 9.731, 14.0],
            2,
        ));
        self.add_ion(Ion::new(
            "PIPES".to_string(),
            true,
            vec![7.141, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "POPSO".to_string(),
            true,
            vec![7.8, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new("TABS".to_string(), true, vec![8.9, 14.0, 14.0], 0));
        self.add_ion(Ion::new(
            "TAPS".to_string(),
            true,
            vec![8.44, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "TAPSO".to_string(),
            true,
            vec![7.635, 14.0, 14.0],
            0,
        ));
        self.add_ion(Ion::new(
            "Tartaric acid".to_string(),
            true,
            vec![3.036, 4.366, 14.0],
            0,
        ));
        self.add_ion(Ion::new("TES".to_string(), true, vec![7.55, 14.0, 14.0], 0));
        self.add_ion(Ion::new(
            "Tricine".to_string(),
            true,
            vec![2.023, 8.135, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Triethanolamine".to_string(),
            true,
            vec![7.762, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Triethylamine".to_string(),
            true,
            vec![10.72, 14.0, 14.0],
            1,
        ));
        self.add_ion(Ion::new(
            "Bicine".to_string(),
            true,
            vec![2.0, 8.334, 14.0],
            1,
        ));

        // Add more ions as needed
    }
}
