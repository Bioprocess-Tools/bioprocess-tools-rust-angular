import Plotly from 'plotly.js/lib/core';
Plotly.register([
require('plotly.js/lib/heatmap'),
require('plotly.js/lib/scatter'),
require('plotly.js/lib/bar')
]);

export default Plotly;