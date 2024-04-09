export class Ion {
  name: string;
  is_buffer: boolean;
  pka: number[];
  highest_charge: number;
  ionic_concs: number[];
  ionic_concs_div_charge: number[];
  unionized_conc: number;
  ion_conc_interval_data: number[];

  constructor(
    name: string,
    is_buffer: boolean,
    pka: number[],
    highest_charge: number,
    ionic_concs: number[],
    unionized_conc: number,
    ion_conc_interval_data: number[]
  ) {
    this.name = name;
    this.is_buffer = is_buffer;
    this.pka = pka;
    this.highest_charge = highest_charge;
    this.ionic_concs = ionic_concs;
    this.unionized_conc = unionized_conc;
    this.ion_conc_interval_data = ion_conc_interval_data;
  }

  getChargeArray(): number[] {
    let chargeArray = [];
    for (let i = this.highest_charge; i > this.highest_charge - 3; i--) {
      chargeArray.push(i);
    }
    return chargeArray;
  }

  calculateIonizedConc(): number {
    // let chargeArray = this.getChargeArray();
    // let result = this.ionic_concs.map(
    //   (item, index) => item / chargeArray[index]
    // );
    // let sum = result.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue,
    //   0
    // );
    return 1000;
  }

  testcall():string {
    return 'test';
  }
}