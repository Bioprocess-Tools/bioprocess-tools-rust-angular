import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators} from '@angular/forms';
import {MatChipListboxChange, MatChipSelectionChange} from '@angular/material/chips';
import { Solution } from 'src/app/shared/models/solution.model';
import { SolutionMixture } from 'src/app/shared/models/solution_mixture.model';
import { Step } from 'src/app/shared/models/step.model';
import { SolutionMixtureService } from 'src/app/solution-mixture.service';

@Component({
  selector: 'app-solution-mixture-analysis',
  templateUrl: './solution-mixture-analysis.component.html',
  styleUrls: ['./solution-mixture-analysis.component.scss'],
})
export class SolutionMixtureAnalysisComponent implements OnInit {
  solutionMixture: SolutionMixture;
  steps: Step[];

  solution_names: string[];
  solutions: Solution[];
  compound_names: string[];
  ion_names: string[];

  // selectedKeys = [];
  // selectedData = [];
  // selectedLinearData = [];
  // selectedScatterData = [];
  //these options are for the chips options, to include individual phases and "all"
  phaseOptions = [];
  compoundOptions = [];
  ionOptions = [];

  selectedCategories = ['all'];
  selectedPhases: string[] = []; // User-selected phase
  selectedCompounds: string[] = []; // User-selected compounds
  selectedIons: string[] = []; // User-selected ions


  solution_volumes_bar_chart_data = [];
  selectedPlotlyData = [];
  selectedPlotlyLayout = {};

  ion_concs_data = [];
  compound_concs_data = [];
  ion_concs_layout = {};
  compound_concs_layout = {};
  solution_volumes_data = [];
  solution_volumes_layout = {};

  compound_interval_data_phase = [];
  ion_interval_data_phase = [];
  pH_interval_data_phase = [];
  compound_interval_data_phase_layout = {};
  ion_interval_data_phase_layout = {};
  pH_interval_data_phase_layout = {};
  bartrace = [];
  barlayout = {};
  ion_colors = [
    '#9e0142',  // dark purple
    '#d53e4f',  // red
    '#f46d43',  // orange
    '#fdae61',  // light orange
    '#fee08b',  // yellow
    '#ffffbf',  // light yellow
    '#e6f598',  // light green
    '#abdda4',  // green
    '#66c2a5',  // turquoise
    '#3288bd',  // blue
    '#5e4fa2'   // dark blue
  ];
  compound_colors =  [
    '#1B9E77',  // dark green
    '#D95F02',  // dark orange
    '#7570B3',  // dark purple
    '#E7298A',  // dark pink
    '#66A61E',  // light green
    '#E6AB02',  // gold
    '#A6761D',  // brown
    '#666666'   // dark gray
  ];
  solution_colors= ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
  pH_color = '#1f77b4';




  small_graph_height = 300;
  small_graph_width = 500;

  yaxis = {
    showgrid: true,
    zeroline: true,
    showline: true,
    gridcolor: '#bdbdbd',
    gridwidth: 2,
    zerolinecolor: '#969696',
    zerolinewidth: 2,
    linecolor: '#636363',
    linewidth: 2,
    title: 'God',
    titlefont: {
      family: 'Arial, sans-serif',
      size: 18,
      color: 'lightgrey',
    },
    showticklabels: true,
    tickangle: 45,
    tickfont: {
      family: 'Old Standard TT, serif',
      size: 14,
      color: 'black',
    },
    tickmode: 'linear',
    tick0: 0.0,
    dtick: 0.25,
  };


  plotlyData = [];


  category: string = ''; // Category selected by the user, e.g., 'compound', 'ion', 'pH'
  specificSelection: string = ''; // Specific compound or ion selected, or 'All'

  plotData: any[]; // Variable to hold the prepared data for plotting
  plot2data: any[]; // Variable to hold the prepared data for the line plot
  plotSingleData: any[]; // Variable to hold the prepared data for the single plot
  layout: any; // Variable to hold the layout for the plot
  traces: any[]; // Variable to hold the traces for the plot
  categories: string[] = ['compound', 'ion', 'pH']; // Categories for the dropdown
  allPhasesSelected: boolean = false; // Whether all phases are selected
  allCompoundsSelected: boolean = false; // Whether all compounds are selected
  allIonsSelected: boolean = false; // Whether all ions are selected


  constructor(private solutionMixtureService: SolutionMixtureService) {}

  ngOnInit(): void {
    this.subscribeSolutionMixtureSolutionsReview();
    this.subscribeSolutionMixtureSteps();
  }

  subscribeSolutionMixtureSolutionsReview(): void {
    this.solutionMixtureService.solutionMixtureSolutionsReview$.subscribe(
      (solutionMixture: SolutionMixture) => {
        this.solutionMixture = solutionMixture;
        if (this.solutionMixture && this.solutionMixture.phase_sliced_data) {
          //this.phaseData = this.solutionMixture.phase_data;
          this.getNames(); //also generates phase options, compound options, and ion options
          // this.plotData = this.preparePlotData(
          //   this.solutionMixture.phase_sliced_data,
          //   this.selectedPhases,
          //   this.category,
          //   this.specificSelection
          // );
          this.barHeightplot();
          this.createCompoundConcsBarChart(solutionMixture);
          this.createIonConcsBarChart(solutionMixture);
          this.createSolutionVolumesBarChart(solutionMixture);
          this.createDataLayoutselCompoundIonpHDataAllPhases();

          this.plot2data = this.prepareLinePlotData();
          if(this.plot2data) {console.log("God got plot2data", this.plot2data)}
          this.plotSingleData = this.prepareSinglePlotData();
          if (this.plot2data) {
            console.log("God got inside plot2data", this.plot2data)
            this.plotWithPlotly();

          }
        }
      }
    );
  }

  subscribeSolutionMixtureSteps(): void {
    this.solutionMixtureService.Steps$.subscribe((steps: Step[]) => {
      this.steps = steps;
    });
  }

  prepareSinglePlotData(): any[] {
    let linePlotData = [];
    let traces = [];
    if (this.category === 'compound') {
      traces = this.selectedCompounds.map(compound => {
        return {
          x: this.solutionMixture.volume_interval_data,  
          y: this.solutionMixture.compounds.find(compoundobj => compoundobj.name === compound).compound_conc_interval_data,  
          mode: 'lines',
          name: `${compound}`,
        };
      });
    }
    else if (this.category === 'ion') {
      traces = this.selectedIons.map(ion => {
        return {
          x: this.solutionMixture.volume_interval_data,  
          y: this.solutionMixture.unique_ions.find(ionobj => ionobj.name === ion).ion_conc_interval_data,  
          mode: 'lines',
          name: `${ion}`,
        };
      });
    }

    else if (this.category === 'pH') {
      traces = [{          
        x: this.solutionMixture.volume_interval_data, 
        y: this.solutionMixture.pH_interval_data,
        mode: 'lines',
        name: `pH`,
      }];
    }
    console.log("God traces", traces)
    linePlotData.push(...traces);
    console.log("God line plot data", linePlotData)

    return linePlotData;
  }
  
  createDataLayoutselCompoundIonpHDataAllPhases() {
    let linePlotData = [];
    let traces = [];

      this.compound_interval_data_phase = this.compound_names.map((compound,index) => {
        return {
          x: this.solutionMixture.volume_interval_data,  
          y: this.solutionMixture.compounds.find(compoundobj => compoundobj.name === compound).compound_conc_interval_data,  
          mode: 'lines',
          name: `${compound}`,
          line: {
            color: this.compound_colors[index % this.compound_colors.length], width:2 // Use the index to get a color from the array
          },
        };
      });
  
      this.compound_interval_data_phase_layout = {
        title: 'Compound Concentrations vs Volume',
        xaxis: { title: 'Volume' },
        yaxis: { title: 'Concentration (M)' },
        autosize: true,
     //   paper_bgcolor: 'rgb(0,0,0)',
     //   plot_bgcolor: 'rgb(0,0,0)',
      };


 
      this.ion_interval_data_phase = this.ion_names.map((ion,index) => {
        return {
          x: this.solutionMixture.volume_interval_data,  
          y: this.solutionMixture.unique_ions.find(ionobj => ionobj.name === ion).ion_conc_interval_data,  
          mode: 'lines',
          name: `${ion}`,
          line: {
            color: this.ion_colors[index % this.ion_colors.length],
            width:2  // Use the index to get a color from the array
          },
        };
      });
      this.ion_interval_data_phase_layout = {
        title: 'Ion Concentrations vs Volume',
        xaxis: { title: 'Volume' },
        yaxis: { title: 'Concentration (M)' },
        autosize: true,
      //  paper_bgcolor: 'rgb(0,0,0)',
       // plot_bgcolor: 'rgb(0,0,0)',
      };

      this.pH_interval_data_phase = [{          
        x: this.solutionMixture.volume_interval_data, 
        y: this.solutionMixture.pH_interval_data,
        mode: 'lines',
        name: `pH`,
      }];
      this.pH_interval_data_phase_layout = {
        title: 'pH vs Volume',
        xaxis: { title: 'Volume' },
        yaxis: { title: 'pH' },
        autosize: true,
     //   paper_bgcolor: 'rgb(0,0,0)',
     //   plot_bgcolor: 'rgb(0,0,0)',
      };

  
 
  }

barHeightplot() {
// Define the x-axis values
const xValues = [0, 1, 2, 3, 4, 5];

// Define the labels for the points
const labels = ['Label 0', 'Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];

// Create the trace for the line chart
this.bartrace = [{
  x: xValues,
  y: Array(xValues.length).fill(1), // Create an array of 1s for the y-axis
  mode: 'lines+text',
  
  name: 'Line',
  text: labels,
  textposition: 'bottom left',
  line: {
    width: 2,
  },
},

];

const verticalLines = {
  x: xValues.flatMap(x => [x, x, null]), // Add null to create separate lines
  y: Array(xValues.length * 3).flatMap((_, i) => (i + 1) % 3 === 0 ? [null] : [0, 1]), // Add null to create separate lines
  mode: 'lines',
  line: {
    color: 'black',
    width: 2,
  },
  showlegend: false,
};

const annotations = xValues.slice(0, -1).map((x, i) => ({
  x: x + 0.5,
  y: 1.2,
  xref: 'x',
  yref: 'y',
  text: 'god',
  showarrow: true,
  arrowhead: 5,
  arrowsize: 5,
  arrowwidth: 6,
 // arrowcolor: '#636363',
  ax: xValues[i + 1] - x - 0.5,
  ay: -15,
}));


this.bartrace.push(verticalLines);

// Define the layout for the chart
this.barlayout = {
  title: 'Line Chart with Constant Y-Axis',
  xaxis: { title: 'X-Axis', range: [0, Math.max(...xValues) + 1] },
  yaxis: { title: 'Y-Axis', range: [0, 2] },
  autosize: true,
  annotations: annotations,
};

}


  // preparePlotData(
  //   slicedData: any,
  //   selectedPhases: string[],
  //   category: string,
  //   specificSelection: string
  // ): any[] {
  //   let plotData: any[] = [];
  //   if (slicedData) {
  //     console.log(
  //       'God slected phases, category, specific selection',
  //       selectedPhases,
  //       category,
  //       specificSelection
  //     );

  //     if (this.selectedPhases.length != 0) {
  //       // Define relevant names based on category
  //       let relevantNames: string[] = [];
  //       if (category === 'compound') {
  //         relevantNames = this.selectedCompounds;
  //       } else if (category === 'ion') {
  //         relevantNames = this.selectedIons;
  //       }
  //       if (selectedPhases.includes('all')) {
  //         selectedPhases = Object.keys(slicedData);
  //       }
  //       selectedPhases.forEach((selectedPhase) => {
  //         const phaseData = slicedData[selectedPhase];
  //         console.log("God phase data udpaed", phaseData)
  //         if (!phaseData) {
  //           console.error(
  //             'Selected phase data not found for phase',
  //             selectedPhase
  //           );
  //           return;
  //         }

  //         // Depending on the category, prepare data for plotting
  //         phaseData.forEach((dataPoint: any) => {
  //           relevantNames.forEach((key) => {
  //             // Check if we should include the current key based on specificSelection
  //             if (specificSelection === 'all' || specificSelection === key) {
  //               console.log("God key", key)
  //               let entry = plotData.find((entry) => entry.name === key);
  //               if (!entry) {
  //                 entry = { name: key, series: [] };
  //                 plotData.push(entry);
  //               }
  //               entry.series.push({ x: dataPoint.volume, y: dataPoint[key] });
  //               console.log("God entry", entry)
  //             }
  //             //console.log("God not if", plotData)
  //           });
  //         });
  //       });

  //       // Special handling for pH if selected
  //       if (category === 'pH') {
  //         selectedPhases.forEach((selectedPhase) => {
  //           const phaseData = slicedData[selectedPhase];
  //           if (!phaseData) return;

  //           const pHData = phaseData.map((dataPoint: any) => ({
  //             x: dataPoint.volume,
  //             y: dataPoint.pH,
  //           }));
  //           let pHEntry = plotData.find((entry) => entry.name === 'pH');
  //           if (!pHEntry) {
  //             pHEntry = { name: 'pH', series: [] };
  //             plotData.push(pHEntry);
  //           }
  //           pHEntry.series = pHEntry.series.concat(pHData);
  //         });
  //       }
  //     }
  //   }
  //   console.log("God plot data renewed", plotData)
  //   return plotData;
  // }

  prepareLinePlotData(): any[] {
    let linePlotData = [];
    let traces = [];
    console.log("God selected phases", this.selectedPhases);
    console.log("God selected compounds", this.selectedCompounds);
    console.log("God selected ions", this.selectedIons);
    console.log("God category", this.category);

    for (let phase of this.selectedPhases.filter((phase) => phase != 'all')){
      console.log("God phase", phase);
      console.log("God phase data", this.solutionMixture.phase_sliced_data[phase]);
      traces = [];
      if (this.category === 'compound') {
        traces = this.selectedCompounds.map(compound => {
          return {
            x: this.solutionMixture.phase_sliced_data[phase].map(obj => obj.volume),
            y: this.solutionMixture.phase_sliced_data[phase].map(obj => obj[compound]),
            mode: 'lines',
            name: `${compound} - ${phase}`,
          };
        });
      }
      else if (this.category === 'ion') {
        traces = this.selectedIons.map(ion => {
          return {
            x: this.solutionMixture.phase_sliced_data[phase].map(obj => obj.volume),
            y: this.solutionMixture.phase_sliced_data[phase].map(obj => obj[ion]),
            mode: 'lines',
            name: `${ion} - ${phase}`,
          };
        });
      }

      else if (this.category === 'pH') {
        traces = [{          
          x: this.solutionMixture.phase_sliced_data[phase].map(obj => obj.volume),
          y: this.solutionMixture.phase_sliced_data[phase].map(obj => obj.pH),
          mode: 'lines',
          name: `pH - ${phase}`,
        }];
      }
      console.log("God traces", traces)
      linePlotData.push(...traces);
      console.log("God line plot data", linePlotData)


    }
    
  
  return linePlotData;
}



  plotWithPlotly(): void {
    if(this.plot2data) {
    this.selectedPlotlyLayout = {
        title: 'Your Plot Title',
        xaxis: { title: 'Volume' },
        yaxis: { title: 'Concentioio',
        showgrid: true,
        zeroline: true,
        showline: true,
        gridcolor: '#bdbdbd',
        gridwidth: 2,
        zerolinecolor: '#969696',
        zerolinewidth: 2,
        linecolor: '#636363',
        linewidth: 2,
        
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'lightgrey',
        },
        showticklabels: true,
        tickangle: 90,
        tickfont: {
          family: 'Arial, sans-serif',
          size: 14,
          color: 'blue',
        },
        tickmode: 'linear',
       // tick0: 0.0,
       // dtick: 0.01,
        margin: { t: 40 }, // Adjust top margin to make room for the title
      
    }};
  }

      // this.traces = this.plotData.map((dataItem) => {
      //   return {
      //     x: dataItem.series.map((point: any) => point.x),
      //     y: dataItem.series.map((point: any) => point.y),
      //     mode: 'lines',
      //     type: 'scatter',
      //     name: dataItem.name,
      //   };
      // }
      
      // );

      this.traces = this.plot2data
    }

    // Plotly.newPlot('plotDiv', traces, layout);
  

  updatePlot(): void {
    // this.plotData = this.preparePlotData(
    //   this.solutionMixture.phase_sliced_data,
    //   this.selectedPhases,
    //   this.category,
    //   this.specificSelection
    // );

    this.plot2data = this.prepareLinePlotData();
    this.plotSingleData = this.prepareSinglePlotData();
    this.plotWithPlotly();
    // Further steps to actually plot this data with Plotly or similar would go here
  }


  onChangeCompoundSelection(event: MatChipSelectionChange): void {
    const compound = event.source.value;
    const isSelected = event.source.selected;


    if (compound === 'all') {
      if (isSelected) {
        // Select all phases including 'all'
        this.selectedCompounds = this.compoundOptions.map((p) => p.id);
      } else {
        // Clear the selection
        if (this.selectedCompounds.length === this.compoundOptions.length) {
          this.selectedCompounds = [];

        } else {
          this.selectedCompounds.filter((id) => id !== 'all');
        }
        //
      }
    } else {
      if (isSelected) {
        // Add the selected phase, ensuring no duplicates
        if (!this.selectedCompounds.includes(compound)) {
          this.selectedCompounds.push(compound);
          console.log('God added phase if not duplicate', this.selectedCompounds);
          if (this.selectedCompounds.length === this.compoundOptions.length - 1) {
            this.selectedCompounds.push('all');
            console.log('God added all', this.selectedCompounds);
          }
        }
      } else {
        // Remove the deselected phase
        this.selectedCompounds = this.selectedCompounds.filter(
          (id) => id !== compound
        );
        console.log('God: removed phase', this.selectedCompounds);
        this.selectedCompounds = this.selectedCompounds.filter((id) => id !== 'all');
        console.log('God: removed phase and all', this.selectedCompounds);
      }

      //   // Remove 'all' if it's there and not all phases are selected
      //  if ((this.selectedPhases.length === this.phaseOptions.length) ) {
      //     this.selectedPhases.push('all');
      //   } else if (this.selectedPhases.length < this.phaseOptions.length && this.selectedPhases.includes('all')) {
      //     // If not all phases are selected and 'all' is in the array, remove it
      //     this.selectedPhases = this.selectedPhases.filter(id => id !== 'all');
      //   }
      //  }

      // Sort selectedPhases based on the order in this.phases


      // If after sorting and modification, all phases are selected, add 'all' to the selection
      // if (this.selectedPhases.length === this.phaseOptions.length) {
      //   this.selectedPhases.push('all');
      // }
      console.log('God selected compounds', this.selectedCompounds);
      this.updatePlot();
    }
  }















  onChangePhase(event: MatChipSelectionChange): void {
    const phaseId = event.source.value;
    const isSelected = event.source.selected;

    console.log(
      'God - map understand',
      this.phaseOptions.map((p) => p.id).filter((id) => id != 'all')
    );
    if (phaseId === 'all') {
      if (isSelected) {
        // Select all phases including 'all'
        this.selectedPhases = this.phaseOptions.map((p) => p.id);
      } else {
        // Clear the selection
        if (this.selectedPhases.length === this.phaseOptions.length) {
          this.selectedPhases = [];
          this.category = '';
          this.specificSelection = '';
        } else {
          this.selectedPhases.filter((id) => id !== 'all');
        }
        //
      }
    } else {
      if (isSelected) {
        // Add the selected phase, ensuring no duplicates
        if (!this.selectedPhases.includes(phaseId)) {
          this.selectedPhases.push(phaseId);
          console.log('God added phase if not duplicate', this.selectedPhases);
          if (this.selectedPhases.length === this.phaseOptions.length - 1) {
            this.selectedPhases.push('all');
            console.log('God added all', this.selectedPhases);
          }
        }
      } else {
        // Remove the deselected phase
        this.selectedPhases = this.selectedPhases.filter(
          (id) => id !== phaseId
        );
        console.log('God: removed phase', this.selectedPhases);
        this.selectedPhases = this.selectedPhases.filter((id) => id !== 'all');
        console.log('God: removed phase and all', this.selectedPhases);
      }

      //   // Remove 'all' if it's there and not all phases are selected
      //  if ((this.selectedPhases.length === this.phaseOptions.length) ) {
      //     this.selectedPhases.push('all');
      //   } else if (this.selectedPhases.length < this.phaseOptions.length && this.selectedPhases.includes('all')) {
      //     // If not all phases are selected and 'all' is in the array, remove it
      //     this.selectedPhases = this.selectedPhases.filter(id => id !== 'all');
      //   }
      //  }

      // Sort selectedPhases based on the order in this.phases
      this.selectedPhases = this.selectedPhases.sort((a, b) => {
        const indexA = this.phaseOptions.findIndex((phase) => phase.id === a);
        const indexB = this.phaseOptions.findIndex((phase) => phase.id === b);
        return indexA - indexB;
      });

      // If after sorting and modification, all phases are selected, add 'all' to the selection
      // if (this.selectedPhases.length === this.phaseOptions.length) {
      //   this.selectedPhases.push('all');
      // }
      console.log('God selected phases', this.selectedPhases);
      this.updatePlot();
    }
  }

  isPhaseSelected(phase: string): boolean {
    return this.selectedPhases.includes(phase);
  }

  onChangeCategory(event: any): void {
    this.category = event.source.value;
    if (this.category === 'compound') {
      this.selectedIons = [];
    } else if (this.category === 'ion') {
      this.selectedCompounds = [];
    } else if (this.category === 'pH') {
      this.selectedIons = [];
      this.selectedCompounds = [];
    }
    console.log('God selected category', this.category);
    this.updatePlot();
  }

  onChangeIonSelection(event: any): void {
    const ion = event.source.value;
    if (event.source.selected) {
      this.selectedIons.push(ion) ;
    } else {
      const index = this.selectedIons.indexOf(ion);
      if (index > -1) {
        this.selectedIons.splice(index, 1);
      }
    }
    console.log('God selected ions', this.selectedIons);
    this.updatePlot();
  }

  deselectAllCompounds(): void {
   
    this.selectedCompounds = [];

    console.log('God deselected all compounds', this.selectedCompounds);
    //this.updatePlot();
  }

  deselectAllIons(): void {
   
    this.selectedIons = [];

    console.log('God deselected all ions', this.selectedIons);
    this.updatePlot();
  }

  onChangeCompoundSelectionv2(event: any): void {
    const compound = event.source.value;

    if (event.source.selected) {
      
      
      
      
      
      
      this.selectedCompounds.push(compound) ;

    } else {
      const index = this.selectedCompounds.indexOf(compound);
      if (index > -1) {
        this.selectedCompounds.splice(index, 1);
      }
    }
    console.log('God selected compounds', this.selectedCompounds);
    this.updatePlot();
  }

  createSolutionVolumesBarChart(solutionMixture: SolutionMixture) {
    let colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
   // let colorArray = [];
    if (this.plot2data) {
      this.solution_volumes_data = [
        {
          type: 'bar',
          y: solutionMixture.solutions.map((solution) => solution.volume),
          x: solutionMixture.solutions.map((solution) => 
          
          {
          let name = solution.name;

          name = name.replace(/,/g, ',<br>');
          return name;
          }),
          orientation: 'v', // This makes the chart horizontal
          marker: {color:this.solution_colors}
        },
      ];

      console.log('God bar data', this.solution_volumes_data);

      this.solution_volumes_layout = {
        title: 'Solution Volumes',
        xaxis: { tickfont: { size: 12 } ,tickangle:0,automargin: true},
        yaxis: { title: 'Volume (mL)' },
       // width: this.small_graph_width,
       // height: this.small_graph_height,
        autosize: true, 
       // paper_bgcolor: 'rgba(0,0,0,0)', // This will make the paper (the entire plot area including the labels) background transparent
       // plot_bgcolor: 'rgba(0,0,0,0)', //
      };

      //this has a polyfill issue
      // Plotly.newPlot('myDiv', this.bardata as any, this.barlayout);
    }
  }

  createIonConcsBarChart(solutionMixture: SolutionMixture) {
    if (this.plot2data) {
      let xdata = [];
      let ydata = [];
      let colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
      let colorArray = [];
      for (let ion of Object.keys(solutionMixture.ion_concentrations)) {
        //console.log("God ion ", ion)
        if (ion != 'H' && ion != 'OH') {
          //console.log ("God came here", ion)
          xdata.push(ion);
          ydata.push(solutionMixture.ion_concentrations[ion]);
          colorArray.push(colors[colorArray.length % colors.length]);
        }
      }
      this.ion_concs_data = [
        {
          type: 'bar',
          y: ydata,
          x: xdata,
          orientation: 'v', // This makes the chart horizontal
          marker: {color:this.ion_colors}
        },
      ];

      console.log('God ion data', this.ion_concs_data);

      this.ion_concs_layout = {
        title: 'Ion Concentrations',
        xaxis: {  tickfont: { size: 12 } },
        yaxis: { title: 'Concentration (M)' },
        autosize: true, 
      //  width: this.small_graph_width,
       // height: this.small_graph_height,
      };
      //this has a polyfill issue
      // Plotly.newPlot('myDiv', this.bardata as any, this.barlayout);
    }
  }

  createCompoundConcsBarChart(solutionMixture: SolutionMixture) {
    if (this.plot2data) {
      let xdata = [];
      let ydata = [];
      let colors = ['#ffd1dc', '#ffabab', '#ffcbc1', '#ffe5d9', '#d5aaff', '#cfcfcf', '#a6beff', '#ace7ff', '#9effdf', '#a7ffd2'];
      let colorArray = [];
      for (let compound of Object.keys(
        solutionMixture.compound_concentrations
      ).filter((comp) => comp != 'Water')) {
        xdata.push(compound.replace(/ /g, '<br>'));
        ydata.push(solutionMixture.compound_concentrations[compound]);
        colorArray.push(colors[colorArray.length % colors.length]); 
      }
      this.compound_concs_data = [
        {
          type: 'bar',
          y: ydata,
          x: xdata,
          orientation: 'v', // This makes the chart horizontal
          marker: {color:this.compound_colors}
        },
      ];

      console.log('God compound data', this.compound_concs_data);

      this.compound_concs_layout = {
        title: 'Compound Concentrations',
        xaxis: { tickfont: { size: 12 } },
        yaxis: { title: 'Concentration (M)' },
        autosize: true, 
       // width: this.small_graph_width,
       // height: this.small_graph_height,
      };
      //this has a polyfill issue
      // Plotly.newPlot('myDiv', this.bardata as any, this.barlayout);
    }
  }

  plotLineChart() {
    this.selectedPlotlyData = this.plotlyData;

    this.selectedPlotlyLayout = {
      title: 'Line Chart',
      xaxis: {
        title: 'X Axis Title',
      },
      yaxis: {
        title: 'Y Axis Title',
      },
    };
  }

  getNames() {
    this.solution_names = Object.keys(this.solutionMixture.solution_indices);
    this.solutions = this.solutionMixture.solutions;
    this.compound_names = Object.keys(
      this.solutionMixture.compound_concentrations
    ).filter((comp) => comp != 'Water');
    this.ion_names = Object.keys(
      this.solutionMixture.ion_concentrations
    ).filter((ion) => ion != 'H' && ion != 'OH');

    this.generatePhaseOptions(
      Object.keys(this.solutionMixture.phase_sliced_data)
    );
    this.generateCompoundOptions(this.compound_names);
    this.generateIonOptions(this.ion_names);

  }

  generatePhaseOptions(phase_names): void {
    // Assuming this.phase_names is an array of strings containing phase names
    const phaseOptions = phase_names.map((phaseName) => {
      return {
        id: phaseName, // Use the phase name as the id for simplicity, or generate a unique id as needed
        name: phaseName, // The display name of the phase
      };
    });

    // Add the "All" option at the end
    phaseOptions.push({
      id: 'all', // A unique identifier for the "All" option
      name: 'All', // The display name for the "All" option
    });

    // Now phaseOptions is ready to use, e.g., assign it to a component property
    this.phaseOptions = phaseOptions;
  }

generateCompoundOptions(compound_names): void {
    // Assuming this.phase_names is an array of strings containing phase names
    const compoundOptions = compound_names.map((compoundName) => {
      return {
        id: compoundName, // Use the phase name as the id for simplicity, or generate a unique id as needed
        name: compoundName, // The display name of the phase
      };
    });

    // Add the "All" option at the end
    compoundOptions.push({
      id: 'all', // A unique identifier for the "All" option
      name: 'All', // The display name for the "All" option
    });

    // Now phaseOptions is ready to use, e.g., assign it to a component property
    this.compoundOptions = compoundOptions;
  }

generateIonOptions(ion_names): void {
    // Assuming this.phase_names is an array of strings containing phase names
    const ionOptions = ion_names.map((ionName) => {
      return {
        id: ionName, // Use the phase name as the id for simplicity, or generate a unique id as needed
        name: ionName, // The display name of the phase
      };
    });

    // Add the "All" option at the end
    ionOptions.push({
      id: 'all', // A unique identifier for the "All" option
      name: 'All', // The display name for the "All" option
    });

    // Now phaseOptions is ready to use, e.g., assign it to a component property
    this.ionOptions = ionOptions;
  }

}
