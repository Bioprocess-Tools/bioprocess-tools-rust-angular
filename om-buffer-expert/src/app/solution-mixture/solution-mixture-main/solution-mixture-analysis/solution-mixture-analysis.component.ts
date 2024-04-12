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

  phaseOptions = [];
  compoundOptions = [];
  ionOptions = [];

  selectedCategories = ['all'];
  selectedPhases: string[] = ['all']; // User-selected phase
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
  sel_compound_interval_data_phase = [];
  sel_ion_interval_data_phase = [];
  ion_interval_data_phase = [];
  pH_interval_data_phase = [];
  compound_interval_data_phase_layout = {};
  ion_interval_data_phase_layout = {};
  pH_interval_data_phase_layout = {};
  max_compound_conc: number;
  max_ion_conc: number;
  max_pH: number;
  phaseBasedDataByCategory = [];
  bartrace = [];
  barlayout = {};
  ion_colors = [
    '#9e0142', // dark purple
    '#d53e4f', // red
    '#f46d43', // orange
    '#fdae61', // light orange
    '#fee08b', // yellow
    '#ffffbf', // light yellow
    '#e6f598', // light green
    '#abdda4', // green
    '#66c2a5', // turquoise
    '#3288bd', // blue
    '#5e4fa2', // dark blue
  ];
  compound_colors = [
    '#1B9E77', // dark green
    '#D95F02', // dark orange
    '#7570B3', // dark purple
    '#E7298A', // dark pink
    '#66A61E', // light green
    '#E6AB02', // gold
    '#A6761D', // brown
    '#666666', // dark gray
  ];
  solution_colors = [
    '#e41a1c',
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#ffff33',
    '#a65628',
    '#f781bf',
    '#999999',
  ];
  pH_color = '#1f77b4';
  phase_colors = [
    '#b3e2cd',
    '#fdcdac',
    '#cbd5e8',
    '#f4cae4',
    '#e6f5c9',
    '#fff2ae',
    '#f1e2cc',
    '#cccccc',
  ];
  //phase_colors = ['#d9f0e6', '#fee6d5', '#e5eaf3', '#f9e4f1', '#f2fae4', '#fff8d6', '#f8f0e5', '#e5e5e5'];
  phase_colors_light: string[] = [
    'rgba(216, 240, 229, 0.5)',
    'rgba(253, 229, 212, 0.5)',
    'rgba(229, 234, 243, 0.5)',
    'rgba(249, 228, 240, 0.5)',
    'rgba(242, 249, 228, 0.5)',
    'rgba(255, 248, 214, 0.5)',
    'rgba(248, 240, 229, 0.5)',
    'rgba(229, 229, 229, 0.5)',
  ];

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

  category: string = 'pH'; // Category selected by the user, e.g., 'compound', 'ion', 'pH'
  specificSelection: string = ''; // Specific compound or ion selected, or 'All'

  plotData: any[]; // Variable to hold the prepared data for plotting
  plot2data: any[]; // Variable to hold the prepared data for the line plot
  plotSingleData: any[]; // Variable to hold the prepared data for the single plot
  layout: any; // Variable to hold the layout for the plot
  traces: any[]; // Variable to hold the traces for the plot
  categories: string[] = ['compound', 'ion', 'pH']; // Categories for the dropdown
  allPhasesSelected: boolean = true; // Whether all phases are selected
  allCompoundsSelected: boolean = true; // Whether all compounds are selected
  allIonsSelected: boolean = true; // Whether all ions are selected
  pHBarLayout: any;
  compBarLayout: any;
  ionBarLayout: any;
  compoundbyPhase = [];
  ionbyPhase = [];
  pHbyPhase = [];
  traceOM : {};
  layoutOM: any;

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
          this.selectedIons = this.ion_names;
          this.selectedCompounds = this.compound_names;
          //this.selectedPhases = this.phaseOptions;
          this.getMaxValues();
          this.pHBarLayout = this.omtryphasev2('pH');
          this.compBarLayout = this.omtryphasev2('compound');
          this.ionBarLayout = this.omtryphasev2('ion');

          this.createCompoundConcsBarChart(solutionMixture);
          this.createIonConcsBarChart(solutionMixture);
          this.createSolutionVolumesBarChart(solutionMixture);

          this.createDataLayoutselCompoundIonpHDataAllPhases();
          this.createDataLayoutallCompoundIonpHDataAllPhases();

          //this.plot2data = this.prepareLinePlotData();
          //this.phaseBasedDataByCategory= this.prepareLinePlotDatav2();
          this.compoundbyPhase =
            this.prepareLinePlotDataCategoryInput('compound');
          this.ionbyPhase = this.prepareLinePlotDataCategoryInput('ion');
          this.pHbyPhase = this.prepareLinePlotDataCategoryInput('pH');

          //this.plotSingleData = this.prepareSinglePlotData();
        }
      }
    );
  }

  subscribeSolutionMixtureSteps(): void {
    this.solutionMixtureService.Steps$.subscribe((steps: Step[]) => {
      this.steps = steps;
    });
  }

  getMaxValues() {
    this.max_compound_conc = Math.max(
      ...this.solutionMixture.compounds.map((compound) => {
        return Math.max(...compound.compound_conc_interval_data);
      })
    );

    this.max_ion_conc = Math.max(
      ...this.solutionMixture.unique_ions.map((compound) => {
        return Math.max(...compound.ion_conc_interval_data);
      })
    );

    this.max_pH = Math.max(...this.solutionMixture.pH_interval_data);
  }

  prepareSinglePlotData(): any[] {
    let linePlotData = [];
    let traces = [];
    if (this.category === 'compound') {
      traces = this.selectedCompounds.map((compound) => {
        return {
          x: this.solutionMixture.volume_interval_data,
          y: this.solutionMixture.compounds.find(
            (compoundobj) => compoundobj.name === compound
          ).compound_conc_interval_data,
          mode: 'lines',
          name: `${compound}`,
        };
      });
    } else if (this.category === 'ion') {
      traces = this.selectedIons.map((ion) => {
        return {
          x: this.solutionMixture.volume_interval_data,
          y: this.solutionMixture.unique_ions.find(
            (ionobj) => ionobj.name === ion
          ).ion_conc_interval_data,
          mode: 'lines',
          name: `${ion}`,
        };
      });
    } else if (this.category === 'pH') {
      traces = [
        {
          x: this.solutionMixture.volume_interval_data,
          y: this.solutionMixture.pH_interval_data,
          mode: 'lines',
          name: `pH`,
        },
      ];
    }
    console.log('God traces', traces);
    linePlotData.push(...traces);
    console.log('God line plot data', linePlotData);

    return linePlotData;
  }

  createDataLayoutallCompoundIonpHDataAllPhases() {
    let linePlotData = [];
    let traces = [];

    this.compound_interval_data_phase = this.compound_names.map(
      (compound, index) => {
        return {
          x: this.solutionMixture.volume_interval_data,
          y: this.solutionMixture.compounds.find(
            (compoundobj) => compoundobj.name === compound
          ).compound_conc_interval_data,
          mode: 'lines',
          name: `${compound}`,
          line: {
            color: this.compound_colors[index % this.compound_colors.length],
            width: 2, // Use the index to get a color from the array
          },
        };
      }
    );

    this.compound_interval_data_phase_layout = {
      title: 'Compound Concentrations vs Volume',
      xaxis: { title: 'Volume' },
      yaxis: { title: 'Concentration (M)' },
      autosize: true,
      //   paper_bgcolor: 'rgb(0,0,0)',
      //   plot_bgcolor: 'rgb(0,0,0)',
    };

    this.ion_interval_data_phase = this.ion_names.map((ion, index) => {
      return {
        x: this.solutionMixture.volume_interval_data,
        y: this.solutionMixture.unique_ions.find(
          (ionobj) => ionobj.name === ion
        ).ion_conc_interval_data,
        mode: 'lines',
        name: `${ion}`,
        line: {
          color: this.ion_colors[index % this.ion_colors.length],
          width: 2, // Use the index to get a color from the array
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

    this.pH_interval_data_phase = [
      {
        x: this.solutionMixture.volume_interval_data,
        y: this.solutionMixture.pH_interval_data,
        mode: 'lines',
        name: `pH`,
      },
    ];
    this.pH_interval_data_phase_layout = {
      title: 'pH vs Volume',
      xaxis: { title: 'Volume' },
      yaxis: { title: 'pH' },
      autosize: true,
      //   paper_bgcolor: 'rgb(0,0,0)',
      //   plot_bgcolor: 'rgb(0,0,0)',
    };
  }

  generateHeatMap() {
    // Assuming you have a method to handle the heatmap generation

    //let dataPoints1 = this.solution.heat_map_data['data_points'];
    const dataPoints = [
      { x: 0.95, y: 0.95, pH: 7.0 },
      { x: 0.95, y: 1.0, pH: 7.1 },
      { x: 1.0, y: 0.95, pH: 7.2 },
      { x: 1.05, y: 1.05, pH: 7.3 },
    ];

    const xValues = dataPoints.map((dp) => dp.x * 100);
    const yValues = dataPoints.map((dp) => dp.y * 100);
    const zValues = dataPoints.map((dp) => dp.pH);
    this.traceOM = {
      x: xValues,
      y: yValues,
      z: zValues,
      type: 'heatmap',
      colorscale: [
        [0, 'green'],
        [0.5, 'yellow'],
        [1, 'red'],
      ],
      showscale: true,
    };

    this.layoutOM = {
      title: 'pH Deviations Heatmap',
      //annotations: [],
    };

    // dataPoints.forEach((dp) => {
    //   layout.annotations.push({
    //     x: dp.x * 100,
    //     y: dp.y * 100,
    //     xref: 'x',
    //     yref: 'y',
    //     text: dp.pH.toFixed(2),
    //     showarrow: false,
    //     font: {
    //       family: 'Arial',
    //       size: 12,
    //       color: 'black',
    //     },
    //   });
    // });

    console.log('God trace', this.traceOM);
    console.log('God layout', this.layoutOM);
  }

  createDataLayoutselCompoundIonpHDataAllPhases() {
    let linePlotData = [];
    let traces = [];

    this.sel_compound_interval_data_phase = this.selectedCompounds.map(
      (compound, index) => {
        return {
          x: this.solutionMixture.volume_interval_data,
          y: this.solutionMixture.compounds.find(
            (compoundobj) => compoundobj.name === compound
          ).compound_conc_interval_data,
          mode: 'lines',
          name: `${compound}`,
          line: {
            color: this.compound_colors[index % this.compound_colors.length],
            width: 2, // Use the index to get a color from the array
          },
        };
      }
    );

    this.compound_interval_data_phase_layout = {
      title: 'Compound Concentrations vs Volume',
      xaxis: { title: 'Volume' },
      yaxis: { title: 'Concentration (M)' },
      autosize: true,
      //   paper_bgcolor: 'rgb(0,0,0)',
      //   plot_bgcolor: 'rgb(0,0,0)',
    };

    this.sel_ion_interval_data_phase = this.selectedIons.map((ion, index) => {
      return {
        x: this.solutionMixture.volume_interval_data,
        y: this.solutionMixture.unique_ions.find(
          (ionobj) => ionobj.name === ion
        ).ion_conc_interval_data,
        mode: 'lines',
        name: `${ion}`,
        line: {
          color: this.ion_colors[index % this.ion_colors.length],
          width: 2, // Use the index to get a color from the array
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

    this.pH_interval_data_phase = [
      {
        x: this.solutionMixture.volume_interval_data,
        y: this.solutionMixture.pH_interval_data,
        mode: 'lines',
        name: `pH`,
      },
    ];
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
    const labels = [
      'Label 0',
      'Label 1',
      'Label 2',
      'Label 3',
      'Label 4',
      'Label 5',
    ];

    // Create the trace for the line chart
    this.bartrace = [
      {
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
      x: xValues.flatMap((x) => [x, x, null]), // Add null to create separate lines
      y: Array(xValues.length * 3).flatMap((_, i) =>
        (i + 1) % 3 === 0 ? [null] : [0, 1]
      ), // Add null to create separate lines
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
    console.log('God selected phases', this.selectedPhases);
    console.log('God selected compounds', this.selectedCompounds);
    console.log('God selected ions', this.selectedIons);
    console.log('God category', this.category);

    for (let phase of this.selectedPhases.filter((phase) => phase != 'all')) {
      console.log('God phase', phase);
      console.log(
        'God phase data',
        this.solutionMixture.phase_sliced_data[phase]
      );
      traces = [];
      if (this.category === 'compound') {
        traces = this.selectedCompounds.map((compound) => {
          return {
            x: this.solutionMixture.phase_sliced_data[phase].map(
              (obj) => obj.volume
            ),
            y: this.solutionMixture.phase_sliced_data[phase].map(
              (obj) => obj[compound]
            ),
            mode: 'lines',
            name: `${compound} - ${phase}`,
          };
        });
        console.log('God compound traces', traces);
      } else if (this.category === 'ion') {
        traces = this.selectedIons.map((ion) => {
          return {
            x: this.solutionMixture.phase_sliced_data[phase].map(
              (obj) => obj.volume
            ),
            y: this.solutionMixture.phase_sliced_data[phase].map(
              (obj) => obj[ion]
            ),
            mode: 'lines',
            name: `${ion} - ${phase}`,
          };
        });
      } else if (this.category === 'pH') {
        traces = [
          {
            x: this.solutionMixture.phase_sliced_data[phase].map(
              (obj) => obj.volume
            ),
            y: this.solutionMixture.phase_sliced_data[phase].map(
              (obj) => obj.pH
            ),
            mode: 'lines',
            name: `pH - ${phase}`,
          },
        ];
      }
      console.log('God traces', traces);
      linePlotData.push(...traces);
      console.log('God line plot data', linePlotData);
    }

    return linePlotData;
  }

  prepareLinePlotDatav2(): any[] {
    let linePlotData = [];

    // Initialize a map or object to hold the traces for each compound/ion/pH
    let tracesMap = {};
    console.log('God selected phases in lineplotdatav2', this.selectedPhases);
    for (let phase of this.selectedPhases.filter((phase) => phase != 'all')) {
      console.log('God phase iterating', phase);
      if (this.category === 'compound') {
        this.selectedCompounds.forEach((compound) => {
          // Initialize the trace for the compound if it doesn't exist
          if (!tracesMap[compound]) {
            tracesMap[compound] = {
              x: [],
              y: [],
              mode: 'lines',
              name: compound,
            };
          }

          // Append phase data to the compound's trace
          const phaseData = this.solutionMixture.phase_sliced_data[phase];
          tracesMap[compound].x.push(...phaseData.map((obj) => obj.volume));
          tracesMap[compound].y.push(...phaseData.map((obj) => obj[compound]));
        });
      } else if (this.category === 'ion') {
        this.selectedIons.forEach((ion) => {
          // Initialize the trace for the ion if it doesn't exist
          if (!tracesMap[ion]) {
            tracesMap[ion] = {
              x: [],
              y: [],
              mode: 'lines',
              name: ion,
            };
          }

          // Append phase data to the ion's trace
          const phaseData = this.solutionMixture.phase_sliced_data[phase];
          tracesMap[ion].x.push(...phaseData.map((obj) => obj.volume));
          tracesMap[ion].y.push(...phaseData.map((obj) => obj[ion]));
        });
      } else if (this.category === 'pH') {
        // Assuming pH is a single trace across all phases
        // Only initialize once if pH is the category
        if (!tracesMap['pH']) {
          tracesMap['pH'] = {
            x: [],
            y: [],
            mode: 'lines',
            name: 'pH',
          };
        }
        const phaseData = this.solutionMixture.phase_sliced_data[phase];
        tracesMap['pH'].x.push(...phaseData.map((obj) => obj.volume));
        tracesMap['pH'].y.push(...phaseData.map((obj) => obj.pH));
      }
    }

    // Convert the tracesMap object to an array of traces
    linePlotData = Object.values(tracesMap);
    console.log('God line plot data v2', linePlotData);

    return linePlotData;
  }

  prepareLinePlotDataCategoryInput(category: string): any[] {
    let linePlotData = [];

    // Initialize a map or object to hold the traces for each compound/ion/pH
    let tracesMap = {};
    console.log('God selected phases in lineplotdatav2', this.selectedPhases);
    for (let phase of this.selectedPhases.filter((phase) => phase != 'all')) {
      console.log('God phase iterating', phase);
      if (category === 'compound') {
        this.selectedCompounds.forEach((compound) => {
          // Initialize the trace for the compound if it doesn't exist
          if (!tracesMap[compound]) {
            tracesMap[compound] = {
              x: [],
              y: [],
              mode: 'lines',
              name: compound,
            };
          }

          // Append phase data to the compound's trace
          const phaseData = this.solutionMixture.phase_sliced_data[phase];
          tracesMap[compound].x.push(...phaseData.map((obj) => obj.volume));
          tracesMap[compound].y.push(...phaseData.map((obj) => obj[compound]));
        });
      } else if (category === 'ion') {
        this.selectedIons.forEach((ion) => {
          // Initialize the trace for the ion if it doesn't exist
          if (!tracesMap[ion]) {
            tracesMap[ion] = {
              x: [],
              y: [],
              mode: 'lines',
              name: ion,
            };
          }

          // Append phase data to the ion's trace
          const phaseData = this.solutionMixture.phase_sliced_data[phase];
          tracesMap[ion].x.push(...phaseData.map((obj) => obj.volume));
          tracesMap[ion].y.push(...phaseData.map((obj) => obj[ion]));
        });
      } else if (category === 'pH') {
        // Assuming pH is a single trace across all phases
        // Only initialize once if pH is the category
        if (!tracesMap['pH']) {
          tracesMap['pH'] = {
            x: [],
            y: [],
            mode: 'lines',
            name: 'pH',
          };
        }
        const phaseData = this.solutionMixture.phase_sliced_data[phase];
        tracesMap['pH'].x.push(...phaseData.map((obj) => obj.volume));
        tracesMap['pH'].y.push(...phaseData.map((obj) => obj.pH));
      }
    }

    // Convert the tracesMap object to an array of traces
    linePlotData = Object.values(tracesMap);
    console.log('God line plot data v2', linePlotData);

    return linePlotData;
  }
  // omtryphase(plottype: string = 'pH'): any {
  //   let title ='';
  //   let ylabel = '';

  // //Initialize empty arrays for names and end volumes
  // // let names = [];
  // // let endVolumes = [];
  // // let beginVolume;
  // // console.log("God selected phases", this.selectedPhases)
  // // let stepNumbers = this.selectedPhases
  // // .filter(name => name !== 'all')  // Filter out 'all'
  // // .map(name =>name.charAt(0));

  // // // // If the first selected phase is "1", begin_volume is 0
  // // // // Otherwise, it's the end_volume of the phase immediately preceding the first selected phase
  // // const firstSelectedPhaseKey = stepNumbers[0];
  // // if(stepNumbers.length > 0)
  // // { beginVolume = firstSelectedPhaseKey === "1" ? 0 : this.solutionMixture.phase_data[firstSelectedPhaseKey].end_volume;}
  // // stepNumbers.forEach(key => {
  // //   if (this.solutionMixture.phase_data.hasOwnProperty(key)) {
  // //     names.push(this.solutionMixture.phase_data[key].name);
  // //     endVolumes.push(this.solutionMixture.phase_data[key].end_volume);
  // //   }
  // // });

  // // console.log("God names", names)
  // // console.log("God end volumes", endVolumes)
  // // console.log("God begin volume", beginVolume)
  // // console.log("God step numbers", stepNumbers)

  // console.log("God phase data", this.solutionMixture.phase_data)
  // // let filteredPhaseData = Object.keys(this.solutionMixture.phase_data).filter(id => stepNumbers.includes(id));
  // // console.log("God filtered phase data", filteredPhaseData)
  //  let phaseData = this.solutionMixture.phase_data;
  //   if (phaseData) {
  //   let maxValue = 0;
  //   const phaseDataTyped = phaseData as { [key: string]: { end_volume: number, name: string } };

  // let phaseBoundaries = Object.values(phaseDataTyped).map(phase => phase.end_volume);
  // let phaseNames = Object.values(phaseDataTyped).map(phase => phase.name);
  //   console.log("God phase boundaries", phaseBoundaries)
  //   console.log("God phase names", phaseNames)

  // // phaseBoundaries= endVolumes;
  // //   phaseNames = names;
  // //   console.log("God phase boundaries after", phaseBoundaries)
  // //   console.log("God phase names after", phaseNames)

  //   const volumes = this.solutionMixture.volume_interval_data; // Volumes
  // //  const yValues = this.solutionMixture.pH_interval_data; // Corresponding y-values
  //  // const phaseBoundaries = [20, 40, 60, 80]; // Volume values where phases change
  //  // const phaseNames = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];

  //  if (plottype === 'pH') {
  //   maxValue = this.max_pH;
  // title = 'pH vs Volume';
  // ylabel = 'pH';
  // }
  // else if (plottype === 'compound') {
  //   maxValue = this.max_compound_conc;
  //  title = 'Compound Concentrations vs Volume';
  //  ylabel = 'Compound Concentration (M)';
  // }
  // else if (plottype === 'ion') {
  //   maxValue = this.max_ion_conc;
  //   title = 'Ion Concentrations vs Volume';
  //   ylabel = 'Ion Concentration (M)';
  // }

  //   // Initialize shapes and annotations arrays
  //   const shapes = [];
  //   const annotations = [];

  //   // Generate shapes for phase boundaries and rectangles for phases
  //   phaseBoundaries.forEach((boundary, i) => {
  //     const x0 = i === 0 ? 0 : phaseBoundaries[i-1];
  //     const x1 = boundary;

  //     // Rectangle for each phase
  //     // shapes.push({
  //     //   type: 'rect',
  //     //   x0: x0,
  //     //   y0: maxValue,
  //     //   x1: x1,
  //     //   y1: maxValue*1.2,
  //     //  fillcolor: this.phase_colors[i],
  //     //   line: {
  //     //     width: 0
  //     //    // dash: 'dash'
  //     //   }
  //     // });

  //     let constantHeightFraction = 0.3;  // Set the height to 10% of the plot's height

  //     shapes.push({
  //       type: 'rect',
  //       xref: 'x',
  //       yref: 'paper',  // Use 'paper' coordinates for the y dimension
  //       x0: x0,
  //       y0: 1 - constantHeightFraction,  // Position the bottom of the shape
  //       x1: x1,
  //       y1: 1,  // Position the top of the shape
  //       fillcolor: this.phase_colors[i],
  //       line: {
  //         width: 0
  //         // dash: 'dash'
  //       },
  //       layer: 'above traces'  // Draw the shape above the traces
  //     });

  //     // Annotation for phase names
  //     annotations.push({
  //       x: (Number(x0) + Number(x1)) / 2,
  //       y:maxValue*1.3,
  //       text: this.wrapText(phaseNames[i],12),
  //       showarrow: false,
  //      yshift: 10
  //     });
  //   });

  //   // Add vertical lines for phase boundaries
  //   phaseBoundaries.forEach(boundary => {
  //     shapes.push({
  //       type: 'line',
  //       x0: boundary,
  //       x1: boundary,
  //       y0: 0,
  //       y1: 1,
  //       xref: 'x',
  //       yref: 'paper',
  //       line: {color: 'Black', width: .5,dash: 'dash'}
  //     });
  //   });

  // this.barlayout= {
  //     title: {text: title, font: {size: 20,style: 'bold'}},
  //     xaxis: {title: 'Volume'},
  //     yaxis: {title: ylabel, range: [0, maxValue*1.6]},
  //     shapes: shapes,
  //     annotations: annotations,
  //     autosize: true,
  //     legend: {
  //       orientation: 'h',  // Horizontal orientation
  //       x: 0.5,  // Centered horizontally
  //       y: -.2,  // Positioned slightly above the top of the chart
  //       xanchor: 'center',  // Anchor the legend at its center
  //     },
  //   };
  // return this.barlayout;
  // }

  // return null;

  // }

  omtryphasev2(plottype: string = 'pH'): any {
    let title = '';
    let ylabel = '';

    let phaseData = this.solutionMixture.phase_data;
    if (phaseData) {
      let maxValue = 0;
      const phaseDataTyped = phaseData as {
        [key: string]: { end_volume: number; name: string };
      };
      let filteredPhaseData = Object.keys(phaseDataTyped).filter((phase) =>
        this.selectedPhases.includes(phase)
      );

      const phaseBoundaries = Object.values(phaseDataTyped).map(
        (phase) => phase.end_volume
      );
      const phaseNames = Object.values(phaseDataTyped).map(
        (phase) => phase.name
      );
      const volumes = this.solutionMixture.volume_interval_data; // Volumes
      //  const yValues = this.solutionMixture.pH_interval_data; // Corresponding y-values
      // const phaseBoundaries = [20, 40, 60, 80]; // Volume values where phases change
      // const phaseNames = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];

      if (plottype === 'pH') {
        maxValue = this.max_pH;
        title = 'pH vs Volume';
        ylabel = 'pH';
      } else if (plottype === 'compound') {
        maxValue = this.max_compound_conc;
        title = 'Compound Conc. vs Volume';
        ylabel = 'Compound Concentration (M)';
      } else if (plottype === 'ion') {
        maxValue = this.max_ion_conc;
        title = 'Ion Conc. vs Volume';
        ylabel = 'Ion Concentration (M)';
      }

      // Initialize shapes and annotations arrays
      const shapes = [];
      const annotations = [];

      // Generate shapes for phase boundaries and rectangles for phases
      phaseBoundaries.forEach((boundary, i) => {
        const x0 = i === 0 ? 0 : phaseBoundaries[i - 1];
        const x1 = boundary;

        // Rectangle for each phase
        // shapes.push({
        //   type: 'rect',
        //   x0: x0,
        //   y0: maxValue,
        //   x1: x1,
        //   y1: maxValue*1.2,
        //  fillcolor: this.phase_colors[i],
        //   line: {
        //     width: 0
        //    // dash: 'dash'
        //   }
        // });

        let constantHeightFraction = 0.3; // Set the height to 10% of the plot's height

        shapes.push({
          type: 'rect',
          xref: 'x',
          yref: 'paper', // Use 'paper' coordinates for the y dimension
          x0: x0,
          y0: 1 - constantHeightFraction, // Position the bottom of the shape
          x1: x1,
          y1: 1, // Position the top of the shape
          fillcolor: this.phase_colors[i],
          line: {
            width: 0,
            // dash: 'dash'
          },
          layer: 'above traces', // Draw the shape above the traces
        });

        // Annotation for phase names
        annotations.push({
          x: (Number(x0) + Number(x1)) / 2,
          y: maxValue * 1.3,
          text: this.wrapText(phaseNames[i], 12),
          showarrow: false,
          yshift: 10,
        });
      });

      // Add vertical lines for phase boundaries
      phaseBoundaries.forEach((boundary) => {
        shapes.push({
          type: 'line',
          x0: boundary,
          x1: boundary,
          y0: 0,
          y1: 1,
          xref: 'x',
          yref: 'paper',
          line: { color: 'Black', width: 0.5, dash: 'dash' },
        });
      });

      this.barlayout = {
        title: { text: title, font: { size: 10, style: 'bold' } },
        xaxis: { title: 'Volume' },
        yaxis: { title: ylabel, range: [0, maxValue * 1.6] },
        shapes: shapes,
        annotations: annotations,
        autosize: false,
        width: phaseBoundaries.length * 150 + 100,
        height: 450,
        margin: {
          // Set the size of the margins
          l: 50, // Left margin
          r: 25, // Right margin
          b: 50, // Bottom margin
          t: 50, // Top margin
          pad: 4, // Padding between the plotting area and the axis labels
        },
        legend: {
          orientation: 'h', // Horizontal orientation
          x: 0.5, // Centered horizontally
          y: -0.35, // Positioned slightly above the top of the chart
          xanchor: 'center', // Anchor the legend at its center
        },
      };
      return this.barlayout;
    }

    return null;
  }

  wrapText(text: string, n: number): string {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      if ((currentLine + ' ' + words[i]).length > n) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine += ' ' + words[i];
      }
    }

    lines.push(currentLine);

    return lines.join('<br>');
  }

  plotWithPlotly(): void {
    if (this.plot2data) {
      this.selectedPlotlyLayout = {
        title: 'Your Plot Title',
        xaxis: { title: 'Volume' },
        yaxis: {
          title: 'Concentioio',
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
        },
      };
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

    this.traces = this.plot2data;
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
    this.phaseBasedDataByCategory = this.prepareLinePlotDatav2();
    this.compoundbyPhase = this.prepareLinePlotDataCategoryInput('compound');
    this.ionbyPhase = this.prepareLinePlotDataCategoryInput('ion');
    this.pHbyPhase = this.prepareLinePlotDataCategoryInput('pH');

    console.log(
      'God phase based data by category',
      this.phaseBasedDataByCategory
    );
    this.pHBarLayout = this.omtryphasev2('pH');
    this.compBarLayout = this.omtryphasev2('compound');
    this.ionBarLayout = this.omtryphasev2('ion');
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
          console.log(
            'God added phase if not duplicate',
            this.selectedCompounds
          );
          if (
            this.selectedCompounds.length ===
            this.compoundOptions.length - 1
          ) {
            // this.selectedCompounds.push('all');
            // console.log('God added all', this.selectedCompounds);
          }
        }
      } else {
        // Remove the deselected phase
        this.selectedCompounds = this.selectedCompounds.filter(
          (id) => id !== compound
        );
        console.log('God: removed phase', this.selectedCompounds);
        this.selectedCompounds = this.selectedCompounds.filter(
          (id) => id !== 'all'
        );
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

  isContiguous(selectedPhases: string[]): boolean {
    let stepNumbers = selectedPhases
      .filter((name) => name !== 'all')
      .map((name) => parseInt(name.charAt(0)));
    stepNumbers.sort((a, b) => a - b); // Sort the step numbers in ascending order
    console.log('God step numbers', stepNumbers);
    for (let i = 1; i < stepNumbers.length; i++) {
      if (stepNumbers[i] !== stepNumbers[i - 1] + 1) {
        return false;
      }
    }
    return true;
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
      console.log(
        'God selected phase numbers',
        this.selectedPhases.map((name) => parseInt(name.charAt(0)))
      );
      if (!this.isContiguous(this.selectedPhases)) {
        this.selectedPhases = this.selectedPhases.filter(
          (id) => id !== phaseId
        );
        console.log('God selected phases new', this.selectedPhases);
      }
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
      this.selectedIons.push(ion);
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
      this.selectedCompounds.push(compound);
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
    let colors = [
      '#e41a1c',
      '#377eb8',
      '#4daf4a',
      '#984ea3',
      '#ff7f00',
      '#ffff33',
      '#a65628',
      '#f781bf',
      '#999999',
    ];
    // let colorArray = [];
    if (this.plot2data) {
      this.solution_volumes_data = [
        {
          type: 'bar',
          y: solutionMixture.solutions.map((solution) => solution.volume),
          x: solutionMixture.solutions.map((solution) => {
            let name = solution.name;

            name = name.replace(/,/g, ',<br>');
            return name;
          }),
          text: solutionMixture.solutions.map((solution) => {
            let name = solution.name;

            name = name.replace(/,/g, ',<br>');
            return name;
          }),
          textposition: 'inside',
          textangle: -90,
          insidetextanchor: 'middle',
          insidetextfont: { size: 12 },
          orientation: 'v', // This makes the chart horizontal
          marker: { color: this.solution_colors },
        },
      ];

      console.log('God bar data', this.solution_volumes_data);

      this.solution_volumes_layout = {
        title: 'Solution Volumes',
        xaxis: { tickfont: { size: 10 }, tickangle: -45, automargin: true },
        yaxis: { title: 'Volume (mL)' },
        //bargap:0.1,
        //bargroupgap:0.5,
        // width: this.small_graph_width,
        // height: this.small_graph_height,
        autosize: false,
        width: this.solutionMixture.solutions.length * 100 + 100,
        height: 450,
        margin: {
          // Set the size of the margins
          l: 50, // Left margin
          r: 25, // Right margin
          b: 50, // Bottom margin
          t: 50, // Top margin
          pad: 4, // Padding between the plotting area and the axis labels
        },
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
      let colors = [
        '#8dd3c7',
        '#ffffb3',
        '#bebada',
        '#fb8072',
        '#80b1d3',
        '#fdb462',
        '#b3de69',
        '#fccde5',
        '#d9d9d9',
        '#bc80bd',
        '#ccebc5',
        '#ffed6f',
      ];
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
          marker: { color: this.ion_colors },
        },
      ];

      console.log('God ion data', this.ion_concs_data);

      this.ion_concs_layout = {
        title: 'Ion Concentrations',
        xaxis: { tickfont: { size: 10 }, tickangle: -45, automargin: true },
        yaxis: { title: 'Concentration (M)' },
        autosize: false,
        width: xdata.length * 50 + 100,
        height: 450,
        margin: {
          // Set the size of the margins
          l: 50, // Left margin
          r: 25, // Right margin
          b: 50, // Bottom margin
          t: 50, // Top margin
          pad: 4, // Padding between the plotting area and the axis labels
        },
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
      let colors = [
        '#ffd1dc',
        '#ffabab',
        '#ffcbc1',
        '#ffe5d9',
        '#d5aaff',
        '#cfcfcf',
        '#a6beff',
        '#ace7ff',
        '#9effdf',
        '#a7ffd2',
      ];
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
          marker: { color: this.compound_colors },
        },
      ];

      console.log('God compound data', this.compound_concs_data);

      this.compound_concs_layout = {
        title: 'Compound Concentrations',
        xaxis: { tickfont: { size: 10 }, tickangle: -45, automargin: true },
        yaxis: { title: 'Concentration (M)' },
        autosize: false,
        width: xdata.length * 50 + 100,
        height: 450,
        margin: {
          // Set the size of the margins
          l: 50, // Left margin
          r: 25, // Right margin
          b: 100, // Bottom margin
          t: 50, // Top margin
          pad: 4, // Padding between the plotting area and the axis labels
        },
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
    // compoundOptions.push({
    //   id: 'all', // A unique identifier for the "All" option
    //   name: 'All', // The display name for the "All" option
    // });

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
    // ionOptions.push({
    //   id: 'all', // A unique identifier for the "All" option
    //   name: 'All', // The display name for the "All" option
    // });

    // Now phaseOptions is ready to use, e.g., assign it to a component property
    this.ionOptions = ionOptions;
  }
}
