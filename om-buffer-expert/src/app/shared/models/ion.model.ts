export class Ion {
    name: string;
    pka: number[];
    ka: number[];
    highest_charge: number;
    type: string;
    ka1: number;
    ka2: number;
    ka3: number;
    ka1ka2: number;
    ka1ka2ka3: number;
    ionic_concs: number[];
  
    constructor(
      name: string,
      type: string,
      pka: number[],
      highest_charge: number
    ) {
      this.name = name;
      this.pka = pka;
      this.ka = pka.map((x) => 10.0 ** -x);
      this.highest_charge = highest_charge;
      this.type = type;
      this.ka1 = this.ka[0];
      this.ka2 = this.ka[1];
      this.ka3 = this.ka[2];
      this.ka1ka2 = this.ka1 * this.ka[1];
      this.ka1ka2ka3 = this.ka1ka2 * this.ka[2];
      this.ionic_concs = [0, 0, 0, 0];
    }
  }
  