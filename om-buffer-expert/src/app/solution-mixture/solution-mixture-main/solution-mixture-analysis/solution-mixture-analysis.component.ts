import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatChipListboxChange,
  MatChipSelectionChange,
} from '@angular/material/chips';
import * as Plotly from 'plotly.js';
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

  selectedCategories = ['all'];
  selectedKeys = [];
  selectedData = [];
  selectedLinearData = [];
  selectedScatterData = [];
  phaseOptions = [];
  solution_volumes_bar_chart_data = [];
  selectedPlotlyData = [];
  selectedPlotlyLayout = {};
  ion_concs_data = [];
  ion_concs_layout = {};
  compound_concs_data = [];
  compound_concs_layout = {};
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
      color: 'b}ack',
    },
    tickmode: 'linear',
    tick0: 0.0,
    dtick: 0.25,
  };

  //view: any[] = [700, 400]; // Dimensions of the chart
  //colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] }; // Colors for the chart
  //gradient: boolean = false; // Whether to show gradient
  //showXAxis = true; // Whether to show the x-axis
  //showYAxis = true; // Whether to show the y-axis
  // showLegend = true; // Whether to show the legend
  // showXAxisLabel = true; // Whether to show the x-axis label
  // showYAxisLabel = true; // Whether to show the y-axis label
  // xAxisLabel = 'Volume'; // Label for the x-axis
  // yAxisLabel = 'Value'; // Label for the y-axis
  // autoScale = true; // Whether to auto-scale the y-axis
  // lineChartData = []; // The data for the chart
  solution_volumes_data = [];
  solution_volumes_layout = {};
  plotlyData = [];
  selectedPhases: string[] = []; // User-selected phase
  category: string = ''; // Category selected by the user, e.g., 'compound', 'ion', 'pH'
  specificSelection: string = ''; // Specific compound or ion selected, or 'All'

  plotData: any[]; // Variable to hold the prepared data for plotting
  layout: any; // Variable to hold the layout for the plot
  traces: any[]; // Variable to hold the traces for the plot
  categories: string[] = ['compound', 'ion', 'pH']; // Categories for the dropdown
  allPhasesSelected: boolean = false; // Whether all phases are selected

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
          this.getNames();
          this.plotData = this.preparePlotData(
            this.solutionMixture.phase_sliced_data,
            this.selectedPhases,
            this.category,
            this.specificSelection
          );
          if (this.plotData) {
            this.plotWithPlotly();
            this.createCompoundConcsBarChart(solutionMixture);
            this.createIonConcsBarChart(solutionMixture);
            this.createSolutionVolumesBarChart(solutionMixture);
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

  preparePlotData(
    slicedData: any,
    selectedPhases: string[],
    category: string,
    specificSelection: string
  ): any[] {
    let plotData: any[] = [];
    if (slicedData) {
      console.log(
        'God slected phases, category, specific selection',
        selectedPhases,
        category,
        specificSelection
      );

      if (this.selectedPhases.length != 0) {
        // Define relevant names based on category
        const relevantNames =
          category === 'compound'
            ? this.compound_names
            : category === 'ion'
            ? this.ion_names
            : [];
        if (selectedPhases.includes('all')) {
          selectedPhases = Object.keys(slicedData);
        }
        selectedPhases.forEach((selectedPhase) => {
          const phaseData = slicedData[selectedPhase];

          if (!phaseData) {
            console.error(
              'Selected phase data not found for phase',
              selectedPhase
            );
            return;
          }

          // Depending on the category, prepare data for plotting
          phaseData.forEach((dataPoint: any) => {
            relevantNames.forEach((key) => {
              // Check if we should include the current key based on specificSelection
              if (specificSelection === 'All' || specificSelection === key) {
                let entry = plotData.find((entry) => entry.name === key);
                if (!entry) {
                  entry = { name: key, series: [] };
                  plotData.push(entry);
                }
                entry.series.push({ x: dataPoint.volume, y: dataPoint[key] });
              }
            });
          });
        });

        // Special handling for pH if selected
        if (category === 'pH') {
          selectedPhases.forEach((selectedPhase) => {
            const phaseData = slicedData[selectedPhase];
            if (!phaseData) return;

            const pHData = phaseData.map((dataPoint: any) => ({
              x: dataPoint.volume,
              y: dataPoint.pH,
            }));
            let pHEntry = plotData.find((entry) => entry.name === 'pH');
            if (!pHEntry) {
              pHEntry = { name: 'pH', series: [] };
              plotData.push(pHEntry);
            }
            pHEntry.series = pHEntry.series.concat(pHData);
          });
        }
      }
    }
    return plotData;
  }

  plotWithPlotly(): void {
    if (this.plotData) {
      this.layout = {
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
        linewidth: 6,
        
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
          color: 'b}ack',
        },
        tickmode: 'linear',
        tick0: 0.0,
        dtick: 0.25,
        margin: { t: 40 }, // Adjust top margin to make room for the title
      }};

      this.traces = this.plotData.map((dataItem) => {
        return {
          x: dataItem.series.map((point: any) => point.x),
          y: dataItem.series.map((point: any) => point.y),
          mode: 'lines',
          type: 'scatter',
          name: dataItem.name,
        };
      });
    }

    // Plotly.newPlot('plotDiv', traces, layout);
  }

  updatePlot(): void {
    this.plotData = this.preparePlotData(
      this.solutionMixture.phase_sliced_data,
      this.selectedPhases,
      this.category,
      this.specificSelection
    );
    this.plotWithPlotly();
    // Further steps to actually plot this data with Plotly or similar would go here
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
    this.updatePlot();
  }

  onChangeSpecificSelection(event: any): void {
    this.specificSelection = event.source.value;
    this.updatePlot();
  }

  createSolutionVolumesBarChart(solutionMixture: SolutionMixture) {
    if (this.plotData) {
      this.solution_volumes_data = [
        {
          type: 'bar',
          y: solutionMixture.solutions.map((solution) => solution.volume),
          x: solutionMixture.solutions.map((solution) => solution.name),
          orientation: 'v', // This makes the chart horizontal
        },
      ];

      console.log('God bar data', this.solution_volumes_data);

      this.solution_volumes_layout = {
        title: 'Solution Volumes',
        xaxis: { title: 'Volume', tickfont: { size: 14 } },
        yaxis: { title: 'Solution' },
        width: this.small_graph_width,
        height: this.small_graph_height,
      };

      //this has a polyfill issue
      // Plotly.newPlot('myDiv', this.bardata as any, this.barlayout);
    }
  }

  createIonConcsBarChart(solutionMixture: SolutionMixture) {
    if (this.plotData) {
      let xdata = [];
      let ydata = [];
      for (let ion of Object.keys(solutionMixture.ion_concentrations)) {
        //console.log("God ion ", ion)
        if (ion != 'H' && ion != 'OH') {
          //console.log ("God came here", ion)
          xdata.push(ion);
          ydata.push(solutionMixture.ion_concentrations[ion]);
        }
      }
      this.ion_concs_data = [
        {
          type: 'bar',
          y: ydata,
          x: xdata,
          orientation: 'v', // This makes the chart horizontal
        },
      ];

      console.log('God ion data', this.ion_concs_data);

      this.ion_concs_layout = {
        title: 'Ion Concentrations',
        xaxis: { title: 'Ions', tickfont: { size: 14 } },
        yaxis: { title: 'Concentration' },
        width: this.small_graph_width,
        height: this.small_graph_height,
      };
      //this has a polyfill issue
      // Plotly.newPlot('myDiv', this.bardata as any, this.barlayout);
    }
  }

  createCompoundConcsBarChart(solutionMixture: SolutionMixture) {
    if (this.plotData) {
      let xdata = [];
      let ydata = [];
      for (let compound of Object.keys(
        solutionMixture.compound_concentrations
      ).filter((comp) => comp != 'Water')) {
        xdata.push(compound);
        ydata.push(solutionMixture.compound_concentrations[compound]);
      }
      this.compound_concs_data = [
        {
          type: 'bar',
          y: ydata,
          x: xdata,
          orientation: 'v', // This makes the chart horizontal
        },
      ];

      console.log('God compound data', this.compound_concs_data);

      this.compound_concs_layout = {
        title: 'Compound Concentrations',
        xaxis: { title: 'Compounds', tickfont: { size: 14 } },
        yaxis: { title: 'Concentration' },
        width: this.small_graph_width,
        height: this.small_graph_height,
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
}
