var network = new Network(960,600)

//define the function that will be called on a node when the mouse get on it
//d is the data
//i is a parameter from d3
//node is the reference to the node graphic object
//network is the reference to the network object
network.onShowDetails(function(d,i,node,network){
	var content;
    content = '<p class="main"><span>' + d.name + "</span></p>" +
              '<hr class="tooltip-hr">' +
              '<p class="main">' + d.artist + '</span></p>'

    network.tooltip.showTooltip(content,d3.event)

    return d3.select(node).style("stroke","black").style("stroke-width", 2.0)
});

//define the function that will be called on a node when the mouse get out of it
//d is the data
//i is a parameter from d3
//node is the reference to the node graphic object
//network is the reference to the network object
network.onHideDetails(function(d,i,node,network){
	network.tooltip.hideTooltip();

    network.node.style("stroke", n => "#555")
        .style("stroke-width", n => 1)
});

d3.json("data/songs.json",function(err,data){
	if(err) throw err
	console.log(data)

	//define what value will be used to generate the domain of node's radius 
	//d is the data element
	network.setRadiusDomain(function(d){
		return d.playcount
	})

	//render(selection, data, color="red",charge=-200, linkDistance=50)
	//render the graph on the "#vis" container, using the data and fill the nodes with black
	return network.render("#vis",data,"black")
})