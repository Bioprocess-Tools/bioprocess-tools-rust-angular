import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferCalculationOption2Component } from './buffer-calculation-option2.component';

describe('BufferCalculationOption2Component', () => {
  let component: BufferCalculationOption2Component;
  let fixture: ComponentFixture<BufferCalculationOption2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BufferCalculationOption2Component]
    });
    fixture = TestBed.createComponent(BufferCalculationOption2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});









// import { SolutionService } from '../../solution.service';
// import { SolutionMixtureService } from 'src/app/solution-mixture.service';

// import {HttpClientTestingModule} from '@angular/common/http/testing';
// import { AppModule } from 'src/app/app.module';
// import { BufferDesignerModule } from '../buffer-designer.module';
// import { of } from 'rxjs';

// describe('BufferCalculationOption2Component', () => {
//   let component: BufferCalculationOption2Component;
//   let fixture: ComponentFixture<BufferCalculationOption2Component>;
//   let mockSolutionService: any;
//   let mockSolutionMixtureService: any;

//   beforeEach(() => {
//     mockSolutionService = jasmine.createSpyObj(['currentSolution']);
//     mockSolutionMixtureService = {
//       bufferSpecies: { species1: 'value1', species2: 'value2' },
//       compounds: { compound1: 'value1', compound2: 'value2' },
//       initData: () => () => Promise.resolve(),
//     };

//     TestBed.configureTestingModule({
//       declarations: [BufferCalculationOption2Component],
//       imports: [HttpClientTestingModule, AppModule, BufferDesignerModule],
//       providers: [
//         { provide: SolutionService, useValue: mockSolutionService },
//         {
//           provide: SolutionMixtureService,
//           useValue: mockSolutionMixtureService,
//         },
//       ],
//     });

//     fixture = TestBed.createComponent(BufferCalculationOption2Component);
//     component = fixture.componentInstance;
//   });

//   it('should return a valid result for each bufferSpecies', (done) => {
//     mockSolutionService.currentSolution.and.returnValue(of({}));

//     component.ngOnInit();

//     const testConcentration = 1; // Replace with your test concentration
//     const testPH = 7; // Replace with your test pH
//     let acids = new Set();
//     let bases = new Set();
//     let selectedAcidCompounds = [];
//     let selectedBasicCompounds = [];

//     for (const species in component.bufferSpecies) {
//         for (const [key, value] of Object.entries(component.bufferSpecies)) {
//           // Check if the key starts with the given prefix, ignoring case
//           if (key.toLowerCase().startsWith(species.toLowerCase())) {
//             // If it matches, add its compounds to the results

//             value.compounds.forEach((compound) => {
//               if (component.acidCompounds.includes(compound)) {
//                 acids.add(compound);
//               } else if (component.basicCompounds.includes(compound)) {
//                 bases.add(compound);
//               }
//             });
//           }
//         }
//         //set options for the acid and base compounds from the above loop
//         selectedAcidCompounds = Array.from(acids);
//         selectedBasicCompounds = Array.from(bases);
//     component.bufferForm.controls['acidicCompound'].setValue(
//       selectedAcidCompounds[0]
//     );
//     component.bufferForm.controls['basicCompound'].setValue(
//       selectedBasicCompounds[0]
//     );
//     component.bufferForm.controls['bufferSpecies'].setValue(species);
//     component.bufferForm.controls['concentration'].setValue(testConcentration);
//     component.bufferForm.controls['pH'].setValue(testPH);






//       component.onSubmit();

//       // Add your assertion here to check the response from the API
//       // For example:
//       expect(component.returnedSolution).toBeDefined(); // Replace with your actual assertion
//     }

//     done();
//   });
// });