function render(data,getter,chart,compare=true) {
    var maxSize = 1000;
    console.log(data)
    console.log("Rendering "+chart)
    //console.log(d3.select(chart))
    d3.select(chart).selectAll("div.h-bar")
            .data(data)
        .enter().append("div")
        .attr("class", "h-bar")
        .append("span");
    console.log("DOM created")

    d3.select(chart).selectAll("div.h-bar")
            .data(data)
        .attr("class", "h-bar")
        .style("text-align","left")
        .style("width", function (d) {
            console.log(d.size)
            return (d.size*maxSize) + "px";
        })
        .select("span")
        .style("font-weight","bold")
            .text(function (d) {
                return d.Film;
            });
    console.log("DOM updated")

    if(compare)
        d3.select(chart)
            .selectAll("div.h-bar") 
            .sort(function(a, b) { 
                return getter(a) < getter(b) ? 1:-1;
            });

        console.log("DOM sorted")
    }


function normalize(data,getter){
    var bigger = 0;
    var newData = [];
    data.forEach(function(d){
        if(getter(d) > bigger)
            bigger = getter(d);
    });

    for(var i in data){
        var size = getter(data[i])/bigger;
        newData[i] = data[i];
        newData[i].size = size;
    }

    return newData;

}

d3.json("movies.json", function(error, json){ 
    if(error){
        alert("Erro!");
        console.log(error);
    }
    else{

        var ticketsGetter = function(d){
            return d.Worldwide_Gross_M;
        }

        var budgetGetter = function(d){
            return d.Budget_M;
        }

        var profitGetter = function(d){
            return d.Worldwide_Gross_M - d.Budget_M;
        }

        render(normalize(json,ticketsGetter),ticketsGetter,"#chart1");
        render(normalize(json,budgetGetter),budgetGetter,"#chart2")
    }
});