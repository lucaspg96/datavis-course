// Create the dc.js chart objects & link to divs
// 

// load data from a csv file
d3.csv("earthquakes.csv", function (data) {
  // format our data
  var dateFormater = d3.time.format.utc("%Y-%m-%dT%H:%M:%S")

  data.forEach(function(d){
    d.dtg = dateFormater.parse(d.origintime.substr(0,19));
    d.magnitude = d3.round(+d.magnitude,1);
    d.depth = d3.round(+d.depth,0);
  });

  console.log(data)

  // Run the data through crossfilter and load our 'facts'
  var fact = crossfilter(data)
  
  //Create dataTable dimension using the date (dtg)
  var dataTable = dc.dataTable("#dc-table-graph");

  var dateDim = fact.dimension(d => d.dtg);

  dataTable//.width(960)
            //.height(800)
            .dimension(dateDim)
            .group(d => "Earthquake Table")
            //.size(10)
            .columns([
              d => d.dtg,
              d => d.magnitude,
              d => d.depth,
              d => d.latitude,
              d => d.longitude
              ])
            .sortBy(d => d.dtg)
            .order(d3.ascending)

  //Create a dimension for Magnitude
  var magnitudeDim = fact.dimension(d => d.magnitude);
  
  //Create a group for Magnitude that just counts the number of elements in the group
  var magnitudeGroup = magnitudeDim.group();

  // Create a dimension for Depth
  var depthDim = fact.dimension(d => d.depth);

  //Create a group for Depth that just counts the number of elements in the group
  var depthGroup = depthDim.group();

  // Create a dimension just for the hour from the datetime in the dataset
  //hint: use d3.time.hour() function
  var dateHourDimension = fact.dimension(d => d3.time.hour(d.dtg))
  
  //Create a group for the hour dimension that just counts the number of elements per hour
  var dateHourGroup = dateHourDimension.group();

  // Setup the charts

  // Configure Magnitude Bar Graph
  // 480 x 150
  // x dimension domain: [0, 8]
  //use a gap of 56, this number is very obscure. It seems to depend on the width of the chart and on the number of dimensions. It was found using trial and error.
  //set elasticY to true
  var magnitudeGraph = dc.barChart("#magnitude-chart")
  magnitudeGraph.width(480)
    .height(150)
    .dimension(magnitudeDim)
    .group(magnitudeGroup)
    .x(d3.scale.linear().domain([0,8]))
    .gap(56)
    .elasticY(true)
    .centerBar(true)

  // Configure Depth bar graph
  // 480 x 150
  // x dimension domain: [0, 100]
  var depthGraph = dc.barChart("#depth-chart")
  depthGraph.width(480)
    .height(150)
    .dimension(depthDim)
    .group(depthGroup)
    .x(d3.scale.linear().domain([0,100]))
    .centerBar(true)
 
  // Configure Time line graph
  // height: 150
  //x dimension: build the time scale from the data: d3.time.scale().domain(d3.extent(data, function(d) { return d.dtime; }))
  var timeLineGraph = dc.lineChart("#time-chart")
  timeLineGraph.height(150)
    .width(900)
    .dimension(dateHourDimension)
    .group(dateHourGroup)
    .x(d3.time.scale().domain(
      d3.extent(data, d => d.dtg))
    )
    .xUnits(d3.time.days)  

  // Render the Charts
  dc.renderAll();
  setTimout(function(){
    $("#dc-table-graph tbody").css({
      "overflow-y":"scroll",
      "height":"10px",
      "max-height":"10px"
    })
  },1000)
});