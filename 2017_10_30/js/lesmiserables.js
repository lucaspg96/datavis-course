var network = new Network(960,600);

network.onShowDetails(function(d,i,node,network){
	var content;
    content = '<p class="main"><span>' + d.id + "</span></p>" +
              '<hr class="tooltip-hr">' +
              '<p class="main">' + d.degree + '</span></p>'

    network.tooltip.showTooltip(content,d3.event)

    return d3.select(node).style("stroke","black").style("stroke-width", 2.0)
});

network.onHideDetails(function(d,i,node,network){
	network.tooltip.hideTooltip();

    network.node.style("stroke", n => "#555")
        .style("stroke-width", n => 1)
});

d3.json("data/lesmiserables.json",function(err,data){
	if(err) throw err

	var degreesMap = network.getDegreesMap(data);
	network.setRadiusDomain(d => degreesMap[d.id])

	return network.render("#vis",data)
})