let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @returns {string}
*/
export function get_chemical_database_as_json() {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_chemical_database_as_json(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
* @param {string} compounds_name_json
* @param {string} compounds_conc_json
* @returns {string}
*/
export function calculate_pH_compounds_json(compounds_name_json, compounds_conc_json) {
    let deferred3_0;
    let deferred3_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(compounds_name_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(compounds_conc_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.calculate_pH_compounds_json(retptr, ptr0, len0, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred3_0 = r0;
        deferred3_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
* @param {string} solution_json
* @param {string} compounds_name_json
* @param {string} compounds_conc_json
* @returns {string}
*/
export function calculate_pH_compounds_changed_conc_json(solution_json, compounds_name_json, compounds_conc_json) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(solution_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(compounds_name_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(compounds_conc_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.calculate_pH_compounds_changed_conc_json(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred4_0 = r0;
        deferred4_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
* @param {string} compounds_name_json
* @param {string} compounds_conc_json
* @param {string} chemical_database_json
* @returns {string}
*/
export function calculate_pH_compounds_json_db(compounds_name_json, compounds_conc_json, chemical_database_json) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(compounds_name_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(compounds_conc_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(chemical_database_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.calculate_pH_compounds_json_db(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred4_0 = r0;
        deferred4_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
* @param {string} buffer_compound_1_name
* @param {string} buffer_compound_2_name
* @param {number} total_buffer_conc
* @param {number} target_pH
* @param {string} chemical_database_json
* @returns {string}
*/
export function calculate_composition_common_buffer_target_pH_json(buffer_compound_1_name, buffer_compound_2_name, total_buffer_conc, target_pH, chemical_database_json) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(buffer_compound_1_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(buffer_compound_2_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(chemical_database_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.calculate_composition_common_buffer_target_pH_json(retptr, ptr0, len0, ptr1, len1, total_buffer_conc, target_pH, ptr2, len2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred4_0 = r0;
        deferred4_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
* @param {string} buffer_compound_1_name
* @param {string} buffer_compound_2_name
* @param {number} total_buffer_conc
* @param {number} target_pH
* @param {string} chemical_database_json
* @returns {string}
*/
export function calculate_composition_common_buffer_target_pH_json_db(buffer_compound_1_name, buffer_compound_2_name, total_buffer_conc, target_pH, chemical_database_json) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(buffer_compound_1_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(buffer_compound_2_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(chemical_database_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.calculate_composition_common_buffer_target_pH_json_db(retptr, ptr0, len0, ptr1, len1, total_buffer_conc, target_pH, ptr2, len2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred4_0 = r0;
        deferred4_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
* @param {string} chemical_database_json
* @param {number} conc_set_concentration
* @param {string} conc_set_compound_name
* @param {string} conc_change_compound_name
* @param {number} target_pH
* @returns {string}
*/
export function calculate_concentration_change_json(chemical_database_json, conc_set_concentration, conc_set_compound_name, conc_change_compound_name, target_pH) {
    let deferred4_0;
    let deferred4_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(chemical_database_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(conc_set_compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(conc_change_compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.calculate_concentration_change_json(retptr, ptr0, len0, conc_set_concentration, ptr1, len1, ptr2, len2, target_pH);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred4_0 = r0;
        deferred4_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
*/
export const SolutionType = Object.freeze({ SingleSpecies:0,"0":"SingleSpecies",DualSpecies:1,"1":"DualSpecies",MultiSpecies:2,"2":"MultiSpecies",Stock:3,"3":"Stock", });

const ChemicalDatabaseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chemicaldatabase_free(ptr >>> 0));
/**
*/
export class ChemicalDatabase {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChemicalDatabaseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chemicaldatabase_free(ptr);
    }
}

const CompoundFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_compound_free(ptr >>> 0));
/**
*/
export class Compound {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Compound.prototype);
        obj.__wbg_ptr = ptr;
        CompoundFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CompoundFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compound_free(ptr);
    }
    /**
    * @param {number} comp_id
    * @param {string} comp_name
    * @param {Uint32Array} comp_ion_id
    * @param {Uint32Array} stoichiometry
    * @param {number} molecular_weight
    * @param {number} comp_conc
    * @returns {Compound}
    */
    static new(comp_id, comp_name, comp_ion_id, stoichiometry, molecular_weight, comp_conc) {
        const ptr0 = passStringToWasm0(comp_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(comp_ion_id, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray32ToWasm0(stoichiometry, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.compound_new(comp_id, ptr0, len0, ptr1, len1, ptr2, len2, molecular_weight, comp_conc);
        return Compound.__wrap(ret);
    }
    /**
    * @param {number} ion_id
    * @returns {number | undefined}
    */
    ion_position(ion_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compound_ion_position(retptr, this.__wbg_ptr, ion_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const IonFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ion_free(ptr >>> 0));
/**
*/
export class Ion {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ion.prototype);
        obj.__wbg_ptr = ptr;
        IonFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IonFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ion_free(ptr);
    }
    /**
    * @param {string} ion_name
    * @param {boolean} is_buffer
    * @param {Float64Array} pka
    * @param {number} highest_charge
    * @returns {Ion}
    */
    static new(ion_name, is_buffer, pka, highest_charge) {
        const ptr0 = passStringToWasm0(ion_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(pka, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.ion_new(ptr0, len0, is_buffer, ptr1, len1, highest_charge);
        return Ion.__wrap(ret);
    }
}

const SolutionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_solution_free(ptr >>> 0));
/**
*/
export class Solution {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Solution.prototype);
        obj.__wbg_ptr = ptr;
        SolutionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SolutionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_solution_free(ptr);
    }
    /**
    * @returns {Solution}
    */
    static new() {
        const ret = wasm.solution_new();
        return Solution.__wrap(ret);
    }
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
    calculate_conc_change_one_compound_conc_target_pH(chemical_database, conc_set_concentration, conc_set_compound_name, conc_change_compound_name, target_pH) {
        _assertClass(chemical_database, ChemicalDatabase);
        const ptr0 = passStringToWasm0(conc_set_compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(conc_change_compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.solution_calculate_conc_change_one_compound_conc_target_pH(this.__wbg_ptr, chemical_database.__wbg_ptr, conc_set_concentration, ptr0, len0, ptr1, len1, target_pH);
    }
    /**
    * @param {number} total_buffer_conc
    * @param {number} target_pH
    * @returns {buffer_common_ion_parameters}
    */
    get_common_ion_buffer_parameters(total_buffer_conc, target_pH) {
        const ret = wasm.solution_get_common_ion_buffer_parameters(this.__wbg_ptr, total_buffer_conc, target_pH);
        return buffer_common_ion_parameters.__wrap(ret);
    }
    /**
    * @param {ChemicalDatabase} chemical_database
    * @param {number} conc_set_concentration
    * @param {string} conc_set_compound_name
    * @param {string} conc_change_compound_name
    * @param {number} target_pH
    * @returns {Solution}
    */
    static calculate_concentration_change(chemical_database, conc_set_concentration, conc_set_compound_name, conc_change_compound_name, target_pH) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(chemical_database, ChemicalDatabase);
            const ptr0 = passStringToWasm0(conc_set_compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(conc_change_compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.solution_calculate_concentration_change(retptr, chemical_database.__wbg_ptr, conc_set_concentration, ptr0, len0, ptr1, len1, target_pH);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Solution.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint32Array}
    */
    non_salt_compound_ids() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.solution_non_salt_compound_ids(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} comp_id
    * @returns {Compound | undefined}
    */
    get_compound_by_id(comp_id) {
        const ret = wasm.solution_get_compound_by_id(this.__wbg_ptr, comp_id);
        return ret === 0 ? undefined : Compound.__wrap(ret);
    }
    /**
    * @param {number} ion_id
    * @returns {Ion | undefined}
    */
    get_ion_by_id(ion_id) {
        const ret = wasm.solution_get_ion_by_id(this.__wbg_ptr, ion_id);
        return ret === 0 ? undefined : Ion.__wrap(ret);
    }
    /**
    * @returns {Uint32Array}
    */
    get_salt_compound_ids() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.solution_get_salt_compound_ids(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint32Array}
    */
    get_buffer_compound_ids() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.solution_get_buffer_compound_ids(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} compound_id
    * @param {number} target_conc
    */
    set_compound_conc_target_buffer_ion_conc(compound_id, target_conc) {
        wasm.solution_set_compound_conc_target_buffer_ion_conc(this.__wbg_ptr, compound_id, target_conc);
    }
    /**
    * @param {string} compound_name
    * @param {ChemicalDatabase} database
    * @returns {number | undefined}
    */
    add_comp(compound_name, database) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(database, ChemicalDatabase);
            wasm.solution_add_comp(retptr, this.__wbg_ptr, ptr0, len0, database.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} compound_name
    * @param {number} conc
    * @param {ChemicalDatabase} database
    */
    set_conc_by_name(compound_name, conc, database) {
        const ptr0 = passStringToWasm0(compound_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(database, ChemicalDatabase);
        wasm.solution_set_conc_by_name(this.__wbg_ptr, ptr0, len0, conc, database.__wbg_ptr);
    }
    /**
    * @param {number} compound_id
    * @param {number} conc
    */
    set_init_comp_conc(compound_id, conc) {
        wasm.solution_set_init_comp_conc(this.__wbg_ptr, compound_id, conc);
    }
    /**
    * @param {number} compound_id
    * @param {number} new_conc
    */
    change_comp_conc(compound_id, new_conc) {
        wasm.solution_change_comp_conc(this.__wbg_ptr, compound_id, new_conc);
    }
    /**
    * @param {number} compound_id
    * @param {number} conc
    */
    add_comp_conc(compound_id, conc) {
        wasm.solution_add_comp_conc(this.__wbg_ptr, compound_id, conc);
    }
    /**
    * @param {number} ph
    * @returns {number}
    */
    ion_concs_unique_ions(ph) {
        const ret = wasm.solution_ion_concs_unique_ions(this.__wbg_ptr, ph);
        return ret;
    }
    /**
    * @param {number} comp_id_set_conc
    * @param {number} comp_conc
    * @param {number} comp_id_change_conc
    * @param {number} target_pH
    */
    calculate_single_compound_conc_target_pH(comp_id_set_conc, comp_conc, comp_id_change_conc, target_pH) {
        wasm.solution_calculate_single_compound_conc_target_pH(this.__wbg_ptr, comp_id_set_conc, comp_conc, comp_id_change_conc, target_pH);
    }
    /**
    * @param {string} buffer_compound_1_name
    * @param {string} buffer_compound_2_name
    * @param {number} total_buffer_conc
    * @param {number} target_pH
    * @param {ChemicalDatabase} chemical_database
    * @returns {Solution}
    */
    static calculate_composition_common_buffer_target_pH(buffer_compound_1_name, buffer_compound_2_name, total_buffer_conc, target_pH, chemical_database) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(buffer_compound_1_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(buffer_compound_2_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            _assertClass(chemical_database, ChemicalDatabase);
            wasm.solution_calculate_composition_common_buffer_target_pH(retptr, ptr0, len0, ptr1, len1, total_buffer_conc, target_pH, chemical_database.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Solution.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {(string)[]} compounds_name_list
    * @param {Float64Array} compounds_conc_list
    * @param {ChemicalDatabase} chemical_database
    * @returns {Solution}
    */
    static calculate_pH_compounds(compounds_name_list, compounds_conc_list, chemical_database) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(compounds_name_list, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArrayF64ToWasm0(compounds_conc_list, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            _assertClass(chemical_database, ChemicalDatabase);
            wasm.solution_calculate_pH_compounds(retptr, ptr0, len0, ptr1, len1, chemical_database.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Solution.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Solution} godsolution
    * @param {(string)[]} compounds_name_list
    * @param {Float64Array} compounds_conc_list
    * @returns {Solution}
    */
    static calculate_pH_compounds_changed_conc(godsolution, compounds_name_list, compounds_conc_list) {
        _assertClass(godsolution, Solution);
        var ptr0 = godsolution.__destroy_into_raw();
        const ptr1 = passArrayJsValueToWasm0(compounds_name_list, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(compounds_conc_list, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.solution_calculate_pH_compounds_changed_conc(ptr0, ptr1, len1, ptr2, len2);
        return Solution.__wrap(ret);
    }
    /**
    * @param {number} total_buffer_conc
    * @param {number} target_pH
    * @param {buffer_common_ion_parameters} parameters
    */
    calculate_compound_conc_common_buffer_ion(total_buffer_conc, target_pH, parameters) {
        _assertClass(parameters, buffer_common_ion_parameters);
        var ptr0 = parameters.__destroy_into_raw();
        wasm.solution_calculate_compound_conc_common_buffer_ion(this.__wbg_ptr, total_buffer_conc, target_pH, ptr0);
    }
}

const buffer_common_ion_parametersFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_buffer_common_ion_parameters_free(ptr >>> 0));
/**
*/
export class buffer_common_ion_parameters {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(buffer_common_ion_parameters.prototype);
        obj.__wbg_ptr = ptr;
        buffer_common_ion_parametersFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        buffer_common_ion_parametersFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_buffer_common_ion_parameters_free(ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('omRustWebA_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
