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
  solution_volumes_bar_chart_data = [];


view: any[] = [700, 400]; // Dimensions of the chart
colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] }; // Colors for the chart
gradient: boolean = false; // Whether to show gradient
showXAxis = true; // Whether to show the x-axis
showYAxis = true; // Whether to show the y-axis
showLegend = true; // Whether to show the legend
showXAxisLabel = true; // Whether to show the x-axis label
showYAxisLabel = true; // Whether to show the y-axis label
xAxisLabel = 'Volume'; // Label for the x-axis
yAxisLabel = 'Value'; // Label for the y-axis
autoScale = true; // Whether to auto-scale the y-axis
lineChartData = []; // The data for the chart
bardata =[]
barlayout = {}
plotlyData = [];

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
      this.make_solution_volumes_bar_chart_data();
      this.createBarChart(this.solutionMixture);
      this.makeDatabyPhase();}
     
    });
  }

  subscribeSolutionMixtureSteps(): void {
    this.solutionMixtureService.Steps$.subscribe((steps: Step[]) => {
      this.steps = steps;
    });
  }
  make_solution_volumes_bar_chart_data(){
    this.solution_volumes_bar_chart_data = [];
    for (let solution of this.solutionMixture.solutions) {
      this.solution_volumes_bar_chart_data.push({
        name: solution.name,
        value: solution.volume
      });
    }

    console.log("God solution_volumes_bar_chart_data",this.solution_volumes_bar_chart_data);
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
    this.selectedLinearData = this.getLinearbyPhaseCategoryKey(["Titrate to volume"], ["compounds"], []);
  }

  makeDatabyPhase2() {
    this.phaseData = {};
    let previousVolume = 0;
    let plotlyData = [];
  
    for (let phase in this.solutionMixture.phase_data) {
      let endVolume = this.solutionMixture.phase_data[phase];
      this.phaseData[phase] = {};
  
      for (let key in this.solutionMixture.data_dictionary) {
        let filteredData = this.solutionMixture.data_dictionary[key].filter((_, index) => this.solutionMixture.data_dictionary['volume'][index] > previousVolume && this.solutionMixture.data_dictionary['volume'][index] <= endVolume);
        this.phaseData[phase][key] = filteredData;
  
        // Create a trace for Plotly
        plotlyData.push({
          x: this.solutionMixture.data_dictionary['volume'].slice(previousVolume, endVolume),
          y: filteredData,
          mode: 'lines',
          name: `${phase} - ${key}`
        });
      }
  
      previousVolume = endVolume;
    }
  
    this.plotlyData = plotlyData;  // Save the Plotly data for use in the template
  }

  createBarChart(solutionMixture: SolutionMixture) {
    this.bardata = [{
      type: 'bar',
      y: solutionMixture.solutions.map(solution => solution.volume),
      x: solutionMixture.solutions.map(solution => solution.name),
      orientation: 'v' // This makes the chart horizontal
    }];

    console.log("God bar data",this.bardata);
  
    this.barlayout = {
      title: 'Solution Volumes',
      xaxis: { title: 'Volume' ,
      tickfont: { size:14}}
      ,
      yaxis: { title: 'Solution' },
      width:900,
      height:700
    };
  
   // Plotly.newPlot('myDiv', this.bardata as any, this.barlayout);
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
   if(this.phaseData[phases[0]]){ 
   for (let phase of phases) {
      selectedData[phase] = {};
      for (let key of keys) {


        if (this.phaseData[phase]['volume']) {
          selectedData[phase]['volume'] = this.phaseData[phase]['volume'];
        }
    
       // console.log("God phase - key",phase, key, this.phaseData[phase][key]);
        if (this.phaseData[phase][key]) {
          selectedData[phase][key] = this.phaseData[phase][key];
          console.log("God selectedData",selectedData);
        }
      }
    }
   }
    return selectedData;
  }

  getSelectedData2(selectedPhases, selectedCategories, selectedKeys) {
    let selectedData = [];
  
    // If 'all' is selected for phases, use all phases, otherwise use selected phases
    let phases = selectedPhases.includes('all') ? Object.keys(this.phaseData) : selectedPhases;
  
    // If 'all' is selected for categories, use all keys, otherwise use selected categories
    let keys = selectedCategories.includes('all') ? this.getAllKeys() : this.getKeysByCategories(selectedCategories);
  
    if(this.phaseData[phases[0]]){ 
      for (let phase of phases) {
        for (let key of keys) {
          if (this.phaseData[phase][key]) {
            selectedData.push({
              x: this.phaseData[phase]['volume'],
              y: this.phaseData[phase][key],
              mode: 'lines',
              name: `${phase} - ${key}`
            });
          }
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
      console.log("God phase",phaseData[phase], phase )
      if (phaseData[phase]) {
        for (let key in phaseData[phase]) {
          if (key === 'volume') continue; // skip 'volume' key
  
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






