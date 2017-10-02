function render(group,dimension,chart,attrib) {
    $(chart).empty();
    $(chart).css("padding-top",($("header").height()+20)+"px")
    
    var chart = dc.barChart(chart);

    chart
    .width(600)
    .height(480)
    .x(d3.scale.linear().domain([
                                    dimension.bottom(1)[0][attrib] - 0.5,
                                    dimension.top(1)[0][attrib] + 0.5
                                ]))
    .brushOn(false)
    .dimension(dimension)
    .group(group)
    .centerBar(true)
    .yAxisLabel("",10)
    .renderHorizontalGridLines(true)
    .xAxis().tickFormat(d3.format("d"));

    chart.render();

}

function renderGenre(group,dimension,chart,names) {
    $(chart).empty();
    $(chart).css("padding-top",($("header").height()+20)+"px")
    
    var chart = dc.barChart(chart);
    console.log(dimension.top(Infinity),group.all())

    //names.unshift("")
    chart
    .width(600)
    .height(480)
    .x(d3.scale.ordinal().domain(names))
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .dimension(dimension)
    .group(group)
    .yAxisLabel("",10)
    .renderHorizontalGridLines(true)
    
    chart.render();

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

        var genreTicketsGetter = function(d){
            return d.tickets;
        }

        var textGetter = function(d,valueGetter){
            return d.Film+" ($"+valueGetter(d)+"M)"
        }

        var genreNameGetter = function(d,valueGetter){
            return d.name+" ($"+valueGetter(d)+"M)"
        }

        movies = crossfilter(json)

        var yearDim = movies.dimension(function(d){
            return d.Year
        })

        var ticketsByYear = yearDim.group().reduceSum(ticketsGetter)
        var budgetsByYear = yearDim.group().reduceSum(budgetGetter)
        var profitByYear = yearDim.group().reduceSum(profitGetter)

        var genreDim = movies.dimension(function(d){
            return d.Genre
        })

        var genreTickets = genreDim.group().reduceSum(ticketsGetter) 
        var genres = genreTickets.top(Infinity).map(function(d){return d.key})       

        $("#tickets").click(function(){
            if(!$(this).hasClass("active")){
                render(ticketsByYear,yearDim,"#chart","Year");
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        $("#budget").click(function(){
            if(!$(this).hasClass("active")){
                render(budgetsByYear,yearDim,"#chart","Year");
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        $("#profit").click(function(){
            if(!$(this).hasClass("active")){
                render(profitByYear,yearDim,"#chart","Year");
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        $("#genre").click(function(){
            if(!$(this).hasClass("active")){
                renderGenre(genreTickets,genreDim,"#chart",genres)
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        // render(normalize(json,ticketsGetter),ticketsGetter,textGetter,"#chart","blue");

    }
});