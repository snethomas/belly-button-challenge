let responseData;

function init () {
    // https://stackoverflow.com/questions/22325819/d3-js-get-json-from-url
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(response => {
        
        console.log(response);
        responseData = response;

        // populate dropdown
        var select = document.getElementById("selDataset");
        for(index in response.names) {
            select.options[select.options.length] = new Option(response.names[index]);
        }

        let firstIndividual = response.names[0];
        populateDemographicInfo(firstIndividual);
        plotHorizontalBarGraph(firstIndividual);
        plotBubbleGraph(firstIndividual);
    });
}

init();

function getDataByIndividual (individual, topResults) {
    responseSamples = responseData.samples;

    let individualToDataMap = new Map();
    // find and set all data for each individual
    // filter top ten results 
    for (i=0; i < responseSamples.length; i++) {
        let sample = responseSamples[i];
        let sample_otu_ids = [];
        let sample_otu_labels = [];
        let sample_values = [];

        // Following code was referenced from https://stackoverflow.com/questions/11499268/sort-two-arrays-the-same-way
        //1) combine the arrays:
        var list = [];
        for (var j = 0; j < sample.otu_ids.length; j++) {
            list.push({'otu_id': sample.otu_ids[j], 'otu_label': sample.otu_labels[j], 'sample_value': sample.sample_values[j]});
        }
        
        //2) sort:
        list.sort(function(a, b) {
            return b.sample_value - a.sample_value;
        });

        //3) separate them back out but keep top ten values:
        if(topResults) {
            for (var k = 0; k < list.length && k < 10; k++) {
                sample_otu_ids[k] = "OTU " + list[k].otu_id;
                sample_otu_labels[k] = list[k].otu_label;
                sample_values[k] = list[k].sample_value;
            }
        } else {
            for (var k = 0; k < list.length; k++) {
                sample_otu_ids[k] = list[k].otu_id;
                sample_otu_labels[k] = list[k].otu_label;
                sample_values[k] = list[k].sample_value;
            }
        }

        individualToDataMap.set(sample.id, {otu_ids: sample_otu_ids, otu_labels: sample_otu_labels, sample_values: sample_values})
    }
    let check = individualToDataMap.get(individual);
    console.log("individual",individual)
    console.log("topResults",topResults)
    console.log("check",check)
    return individualToDataMap.get(individual);

}

function populateDemographicInfo(individual) {
    let demoInfo;
    // populate dropdown
    for(i=0; i < responseData?.metadata.length; i++ ) {
        let i_data = responseData.metadata[i];
        if (individual == i_data.id + "") {
            demoInfo = i_data;
            break;
        }
    }

    var demographicDiv = document.getElementById("sample-metadata");
    // https://stackoverflow.com/questions/2554149/how-can-i-change-div-content-with-javascript
    demographicDiv.innerHTML = `<p> id: ${demoInfo.id} </p><p> ethnicity: ${demoInfo.ethnicity} </p><p> gender: ${demoInfo.gender} </p>`+
                `<p> age: ${demoInfo.age} </p><p> location: ${demoInfo.location} </p><p> bbtype: ${demoInfo.bbtype} </p><p> wfreq: ${demoInfo.wfreq} </p>`;
}

function plotHorizontalBarGraph (individual) {
    let plotdata = getDataByIndividual(individual, true);

        // https://plotly.com/javascript/horizontal-bar-charts/
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
        var data = [{
                type: 'bar',
                x: plotdata.sample_values.reverse(),
                y: plotdata.otu_ids.reverse(),
                orientation: 'h',
                text: plotdata.otu_labels.reverse(),
            }];

        Plotly.newPlot('bar', data);
}

function plotBubbleGraph (individual) {
    // https://plotly.com/javascript/bubble-charts/
    let plotdata = getDataByIndividual(individual, false);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
    // https://stackoverflow.com/questions/11866781/how-do-i-convert-an-integer-to-a-javascript-color

    var trace1 = {
        x: plotdata.otu_ids,
        y: plotdata.sample_values,
        mode: 'markers',
        marker: {
          size: plotdata.sample_values,
          color: plotdata.otu_ids,
        },
        text: plotdata.otu_labels,
      };
      
    var data = [trace1];
    
    var layout = {
    showlegend: false,
    xaxis: {title: 'OTU ID'},
    };
    
    Plotly.newPlot('bubble', data, layout);
}

// Drop Down Menu Actions
function getData() 
{
  let dropdownMenu = d3.select("#selDataset");
  let individual = dropdownMenu.property("value");

  populateDemographicInfo(individual);
  plotHorizontalBarGraph(individual);
  plotBubbleGraph(individual);
}

d3.selectAll("#selDataset").on("change", getData);