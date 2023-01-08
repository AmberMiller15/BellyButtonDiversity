function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
  
    // Create the yticks for the bar chart.
     
    var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Create the trace for the bar chart. 
    var barData = [{
      y : yticks,
      x : values.slice(0,10).reverse(),
      type : "bar",
      orientation : "h"
      }
    ];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin : {t:30 , l:150}
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot ("bar", barData, barLayout);
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker : {
        colorscale: "Viridis",
        color: ids,
        size: values
      }
    }];
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title : "Bacteria Cultures Per Sample",
      margin : {t : 30},
      xaxis: { title : "OTU ID"},
      hovermode: "closest",
    }
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample)[0];
      //var results = resultsArray[0];
      var washFreq = filteredMetadata.wfreq
     
    // Create a variable that holds the washing frequency.
      // var freq = results.wfreq;
  
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain: {x :[0,1], y:[0,1]},
      value: washFreq,
      title :{ text: "Belly Button Washing Frequency <br> Scrubs per Week"},
      type: "indicator",
      mode : "gauge+number",
      delta: {reference: 400},
      gauge: {
        axis : {range :[null, 10]},
        bar : {color : "black"},
        steps: [
          {range:[0,2], color:"red"},
          {range:[2,4], color:"yellow"},
          {range:[4,6], color:"green"},
          {range:[6,8], color:"blue"},
          {range:[8,10], color:"violet"},
        ]
      }
    };
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600,
      height: 400,
    
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
