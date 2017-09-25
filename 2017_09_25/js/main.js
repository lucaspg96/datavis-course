function render(data,valueGetter,textGetter,chart,color) {
    $(chart).empty();
    $(chart).css("padding-top",($("header").height()+20)+"px")
    var maxSize = 600;
    // console.log(data)
    //console.log("Rendering "+chart)
    //console.log(d3.select(chart))
    d3.select(chart).selectAll("div.h-bar")
            .data(data)
        .enter().append("div")
        .attr("class", "h-bar")
        .append("span");
    //console.log("DOM created")

    d3.select(chart).selectAll("div.h-bar")
            .data(data)
        .attr("class", "h-bar")
        .style("text-align","left")
        .style("background-color",color)
        .style("width", function (d) {
            return (d.size*maxSize) + "px";
        })
        .select("span")
        .style("font-weight","bold")
            .text(function (d) {
                return textGetter(d,valueGetter);
            });
    //console.log("DOM updated")

    d3.select(chart)
        .selectAll("div.h-bar") 
        .sort(function(a, b) { 
            return valueGetter(a) < valueGetter(b) ? 1:-1;
        });

    //console.log("DOM sorted")
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

        var genreTicketsGetter = function(d){
            return d.tickets;
        }

        var textGetter = function(d,valueGetter){
            return d.Film+" ($"+valueGetter(d)+"M)"
        }

        var genreNameGetter = function(d,valueGetter){
            return d.name+" ($"+valueGetter(d)+"M)"
        }

        $("#tickets").click(function(){
            if(!$(this).hasClass("active")){
                render(normalize(json,ticketsGetter),ticketsGetter,textGetter,"#chart","#B21212");
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        $("#budget").click(function(){
            if(!$(this).hasClass("active")){
                render(normalize(json,budgetGetter),budgetGetter,textGetter,"#chart","#1485CC")
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        $("#profit").click(function(){
            if(!$(this).hasClass("active")){
                render(normalize(json,profitGetter),profitGetter,textGetter,"#chart","#")
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        $("#genre").click(function(){
            if(!$(this).hasClass("active")){
                var genrers = {};

                json.forEach(function(d){
                    var genrer = d.Genre;

                    if(!genrers[genrer]){
                        genrers[genrer] = {tickets: 0, name: genrer};
                    }

                    genrers[genrer].tickets+=d.Worldwide_Gross_M;
                
                })
                
                var data = [];
                for(i in genrers){
                    data.push(genrers[i]);
                }
                render(normalize(data,genreTicketsGetter),genreTicketsGetter,genreNameGetter,"#chart","#59A351")
                $("#tabs li").removeClass("active")
                $(this).addClass("active")
            }
        })

        // render(normalize(json,ticketsGetter),ticketsGetter,textGetter,"#chart","blue");

    }
});