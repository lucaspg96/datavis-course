function renderChart1(){
	var compositeChart = dc.compositeChart('#chart1');

	d3.csv("stocks.csv", function(data){
		// formatando nossos dados
	    var dtgFormat = d3.time.format("%Y/%m/%d");
	    data.forEach(function(d){
	        d.date = dtgFormat.parse(d.date);
	        d.apple = +d.apple;
	        d.facebook = +d.facebook;
	    });

	    //criando um crossfilter
	    var facts = crossfilter(data);

	    var dateDim = facts.dimension(function(d){
	        return d.date;
	    });

	    var appleByDayGroup = dateDim.group().reduceSum(function(d){
	        return d.apple;
	    });

	    var fbByDayGroup = dateDim.group().reduceSum(function(d){
	        return d.facebook;
	    });

	    var appleBase = facts.all()[0].apple
	    var appleByDayGroupPercent = dateDim.group().reduceSum(function(d){
	        return (1- d.apple/appleBase)*100;
	    });

	    var facebookBase = facts.all()[0].facebook
	    var fbByDayGroupPercent = dateDim.group().reduceSum(function(d){
	        return (1 - d.facebook/facebookBase)*100;
	    });

	    compositeChart.width(800)
	             .height(400)
	             .margins({top: 50, right: 50, bottom: 25, left: 40})
	             .dimension(dateDim)
	             .x(d3.time.scale().domain([new Date(2016, 8, 28), new Date(2017, 8, 28)]))
	             .xUnits(d3.time.days)
	             .renderHorizontalGridLines(true)
	             .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
	             .brushOn(false)    
	             .compose([
	                dc.lineChart(compositeChart)
	                          .group(appleByDayGroup, 'Apple')
	                          .ordinalColors(['steelblue']),
	                dc.lineChart(compositeChart)
	                          .group(fbByDayGroup, 'Facebook')
	                          .ordinalColors(['darkorange'])]);

	    dc.renderAll();

	});
}

function renderChart2(){
	var compositeChart = dc.compositeChart('#chart2');

	d3.csv("stocks.csv", function(data){
		// formatando nossos dados
	    var dtgFormat = d3.time.format("%Y/%m/%d");
	    data.forEach(function(d){
	        d.date = dtgFormat.parse(d.date);
	        d.apple = +d.apple;
	        d.facebook = +d.facebook;
	    });

	    //criando um crossfilter
	    var facts = crossfilter(data);

	    var dateDim = facts.dimension(function(d){
	        return d.date;
	    });

	    var appleBase = facts.all()[0].apple
	    var appleByDayGroupPercent = dateDim.group().reduceSum(function(d){
	        return (d.apple/appleBase - 1)*100;
	    });

	    var facebookBase = facts.all()[0].facebook
	    var fbByDayGroupPercent = dateDim.group().reduceSum(function(d){
	        return (d.facebook/facebookBase - 1)*100;
	    });

	    compositeChart.width(800)
	             .height(400)
	             .margins({top: 50, right: 50, bottom: 25, left: 40})
	             .dimension(dateDim)
	             .x(d3.time.scale().domain([new Date(2016, 8, 28), new Date(2017, 8, 28)]))
	             .xUnits(d3.time.days)
	             .renderHorizontalGridLines(true)
	             .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
	             .brushOn(false)    
	             .compose([
	                dc.lineChart(compositeChart)
	                          .group(appleByDayGroupPercent, 'Apple')
	                          .ordinalColors(['steelblue']),
	                dc.lineChart(compositeChart)
	                          .group(fbByDayGroupPercent, 'Facebook')
	                          .ordinalColors(['darkorange'])]);

	    dc.renderAll();

	});
}

renderChart1()
renderChart2()