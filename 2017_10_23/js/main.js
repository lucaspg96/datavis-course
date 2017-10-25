// Create the dc.js chart objects & link to divs
// 

// load data from a csv file
d3.csv("Crimes_Chicago_Sep2017.csv", function (data) {
  
  var format = d3.time.format("%m/%d/%Y");

  data.forEach(function(d){
    d.lat = +d.Latitude;
    d.lon = +d.Longitude;
    d.date = format.parse(d.Date.split(" ")[0])
    d.day = d3.time.day(d.date)
  });

  console.log(data[0])

  var fact = crossfilter(data)
  
  var typeDim = fact.dimension(d => d["Primary Type"]);

  var typeGroup = typeDim.group()

  var types = typeGroup.top(Infinity).map(function(d){return d.key})
  // console.log(types)

  var colors = {
    "HOMICIDE":"orange",
    "BURGLARY":"red",
    "ROBBERY":"blue"
  }

  var map = L.map('map').setView([data[0].lat,data[0].lon], 10);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 17
  }).addTo(map);

  var typeLegend = L.control({position:'topright'})

  typeLegend.onAdd = function(map){
    var div = L.DomUtil.create('div', 'info legend');
    for(t in colors){
      var d = L.DomUtil.create('div','type')

      var ball = L.DomUtil.create('div','ball')
      ball.style["background-color"] = colors[t]

      d.append(ball)
      d.innerHTML += t
      
      div.append(d)
    }
    return div;
  }

  typeLegend.addTo(map)

  data.forEach(d => {
    var circle = L.circle([d.lat, d.lon], 1, {
     color: colors[d["Primary Type"]],
     weight: 2,
     fillColor: colors[d["Primary Type"]],
     fillOpacity: 0.5
    }).addTo(map);

    circle.bindPopup("Type: "+d["Primary Type"]);
  })

  var barChart = dc.barChart("#bar-chart");

  barChart
  .width(440)
  .height(370)
  .x(d3.scale.ordinal().domain(types))
  .xUnits(dc.units.ordinal)
  .brushOn(false)
  .dimension(typeDim)
  .group(typeGroup)
  .yAxisLabel("",10)
  .renderHorizontalGridLines(true)
  
  barChart.render();

  setTimeout(function(){
    var recs = document.querySelector('.stack').children
    for(i in recs){
      let rec = recs[i]

      try{
        let type = rec.children[0].innerHTML.split(":")[0]
        $(rec).attr("fill",colors[type])
      }
      catch(err){}
    }
  },1000)

  var timeDim = fact.dimension(d => d.date)
  var typeSeriesDim = fact.dimension(d => [d["Primary Type"],d.date])
  var typeSeriesGroup = typeSeriesDim.group()

  var seriesChart = dc.seriesChart("#series-chart");

  seriesChart.width(900)
    .height(480)
    .chart(function(c) { return dc.lineChart(c).interpolate('cardinal'); })
    .x(d3.time.scale().domain([timeDim.bottom(1)[0].date,timeDim.top(1)[0].date]))
    .dimension(typeSeriesDim)
    .group(typeSeriesGroup)
    .ordinalColors(["red","orange","blue"])
    .seriesAccessor(d => d.key[0])
    .keyAccessor(d => d.key[1])
    .valueAccessor(d => d.value)
    .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5));
  seriesChart.render()
});