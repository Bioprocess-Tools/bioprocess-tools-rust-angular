import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { Solution } from 'src/app/shared/models/solution.model';
import { SolutionMixture } from 'src/app/shared/models/solution_mixture.model';
import { Step } from 'src/app/shared/models/step.model';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';

@Component({
  selector: 'app-solution-mixture-analysis',
  templateUrl: './solution-mixture-analysis.component.html',
  styleUrls: ['./solution-mixture-analysis.component.scss']
})
export class SolutionMixtureAnalysisComponent implements OnInit{

  solutionMixture: SolutionMixture;
  steps: Step[];
  dictionaryData: any[] = [];
  solution_names: string[];
  solutions: Solution[];
  compound_names: string[];
  ion_names: string[];
  phaseData: any;
  selectedPhases = ['all'];
  selectedCategories = ['all'];
  selectedKeys = [];
  selectedData = [];
  selectedLinearData = [];  
  selectedScatterData = [];
  phase_names = [];

  constructor(private solutionMixtureService: SolutionMixtureService) { }





  ngOnInit(): void {
    this.subscribeSolutionMixtureSolutionsReview();

    this.subscribeSolutionMixtureSteps();
  }



  subscribeSolutionMixtureSolutionsReview(): void {
    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe((solutionMixture: SolutionMixture) => {
      this.solutionMixture = solutionMixture;
      if(this.solutionMixture && this.solutionMixture.data_dictionary){
      this.prepareDictionaryData();
      this.getNames();
      this.makeDatabyPhase();}
    });
  }

  subscribeSolutionMixtureSteps(): void {
    this.solutionMixtureService.Steps$.subscribe((steps: Step[]) => {
      this.steps = steps;
    });
  }

  makeDatabyPhase() {
    this.phaseData = {};
    let previousVolume = 0;
  
    for (let phase in this.solutionMixture.phase_data) {
      let endVolume = this.solutionMixture.phase_data[phase]; // Corrected line
      this.phaseData[phase] = {};
  
      for (let key in this.solutionMixture.data_dictionary) {
        this.phaseData[phase][key] = this.solutionMixture.data_dictionary[key].filter((_, index) => this.solutionMixture.data_dictionary['volume'][index] > previousVolume && this.solutionMixture.data_dictionary['volume'][index] <= endVolume);
      }
  
      previousVolume = endVolume;
    }
    console.log("God phase",this.phaseData);
    console.log("God Linear Data",this.getLinearbyPhaseCategoryKey(["Titrate to volume"], ["compounds"], []))
  }

  getSelectedData(selectedPhases, selectedCategories, selectedKeys) {
    let selectedData = {};
  
    // If 'all' is selected for phases, use all phases, otherwise use selected phases
    let phases = selectedPhases.includes('all') ? Object.keys(this.phaseData) : selectedPhases;
  
    // If 'all' is selected for categories, use all keys, otherwise use selected categories
    let keys = selectedCategories.includes('all') ? this.getAllKeys() : this.getKeysByCategories(selectedCategories);
  console.log("God keys",keys);
    // Add selected keys to the keys array
   // keys = [...new Set([...keys, ...selectedKeys])];
   // keys = [...new Set([...keys])];
   //console.log("God select phase data", this.phaseData[phases[0]]);
    for (let phase of phases) {
      selectedData[phase] = {};
      for (let key of keys) {
       // console.log("God phase - key",phase, key, this.phaseData[phase][key]);
        if (this.phaseData[phase][key]) {
          selectedData[phase][key] = this.phaseData[phase][key];
          console.log("God selectedData",selectedData);
        }
      }
    }
  
    return selectedData;
  }

  getLinearbyPhaseCategoryKey(selectedPhases, selectedCategories, selectedKeys) {
    console.log("God get linear", this.phaseData)
    let selectedData = this.getSelectedData(selectedPhases, selectedCategories, selectedKeys);
    return this.transformDataForLineChart(selectedData);
  }
  
  getAllKeys() {
    let allKeys = [];
    for (let phase in this.phaseData) {
      for (let key in this.phaseData[phase]) {
        if (!allKeys.includes(key)) {
          allKeys.push(key);
        }
      }
    }
    return allKeys;
  }

  getKeysByCategories(selectedCategories) {
    let keys = [];
  
    for (let category of selectedCategories) {
      if (category === 'compounds' && this.compound_names) {
        keys = [...keys, ...this.compound_names];
      } else if (category === 'ions' && this.ion_names) {
        keys = [...keys, ...this.ion_names];
      }
    }
  
    return keys;
  }



  transformDataForLineChart(phaseData: any) {
    let lineChartData = [];
  
    for (let phase in phaseData) {
      if (phaseData[phase] && phaseData[phase]['volume']) {
        for (let key in phaseData[phase]) {
          let seriesData = phaseData[phase][key].map((value, index) => {
            return {
              name: phaseData[phase]['volume'][index],
              value: value
            };
          });
  
          lineChartData.push({
            name: `${phase} ${key}`,
            series: seriesData
          });
        }
      }
    }
  
    return lineChartData;
  }

  prepareDictionaryData(): void {
    this.dictionaryData = [];
    const keys = Object.keys(this.solutionMixture.data_dictionary);
    const volumeIndex = keys.indexOf('volume');
    keys.splice(volumeIndex, 1);
    keys.forEach(key => {
      const plotData = this.prepareScatterPlotData(this.solutionMixture.data_dictionary, key);
      this.dictionaryData.push(plotData);
    });
  }

  prepareScatterPlotData(data, measurementName: string) {
    return {
      name: measurementName,
      series: data.volume.map((volume, index) => ({
        name: `${volume}`,
        x: volume,
        y: data[measurementName][index],
        r: 5
        
      }))
    };
  }

  getNames() {
    this.solution_names = Object.keys(
      this.solutionMixture.solution_indices
    );
    this.solutions = this.solutionMixture.solutions;
    this.compound_names = Object.keys(
      this.solutionMixture.compound_concentrations
    );
    this.ion_names = Object.keys(
      this.solutionMixture.ion_concentrations
    );

    this.phase_names = Object.keys(this.solutionMixture.phase_data);
    console.log("God phase names",this.phase_names);

  }


}






