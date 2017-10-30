function Network() {
  var allData = [],
      width = 960,
      height = 960,
      // our force directed layout
      force = d3.layout.force(), 
      // these will point to the circles and lines
      // of the nodes and links
      link = null,
      node = null,
      // these will hold the svg groups for
      // accessing the nodes and links display
      linksG = null,
      nodesG = null,
      // tooltip used to display details
      tooltip = Tooltip("vis-tooltip", 230),
      network; //function

  // Helper function to map node id's to node objects.
  // Returns d3.map of ids -> nodes
  function mapNodes(nodes) {
    var nodesMap;
    nodesMap = d3.map();
    nodes.forEach(function(n) {
      return nodesMap.set(n.id, n);
    });
    return nodesMap;
  }

  function __getDegreeMap(data){
    var map = {};

    data.nodes.forEach(n => {
      map[n.id] = 0;

      data.links.forEach(l => {
        if(l.source == n.id || l.target == n.id)
          map[n.id] += 1          
      })

    })

    return map;
  }

  function setupData(data){
    var circleRadius, countExtent;

    var degreesMap = __getDegreeMap(data)

    countExtent = d3.extent(data.nodes, d => degreesMap[d.id] );
    circleRadius = d3.scale.sqrt().range([3, 15]).domain(countExtent);

    data.nodes.forEach(n => {
      n.x = Math.floor(Math.random() * width);
      n.y = Math.floor(Math.random() * height);

      n.degree = degreesMap[n.id]
      n.radius = circleRadius(degreesMap[n.id]);
    });

    var nodesMap = mapNodes(data.nodes);

    data.links.forEach(l => {
      l.source = nodesMap.get(l.source);
      l.target = nodesMap.get(l.target);
    })

    return data;
  }

  // Mouseover tooltip function
  function showDetails(node,d, i) {
    var content;
    content = '<p class="main"><span>' + d.id + "</span></p>" +
              '<hr class="tooltip-hr">' +
              '<p class="main">' + d.degree + '</span></p>'

    tooltip.showTooltip(content,d3.event)

    return d3.select(node).style("stroke","black").style("stroke-width", 2.0)
  }

  // Mouseout function
  function hideDetails(d, i) {
    tooltip.hideTooltip();

    node.style("stroke", n => "#555")
        .style("stroke-width", n => 1)
  }

  // enter/exit display for nodes
  function updateNodes() {
    //select all node elements in svg group of nodes
    //select all node elements in svg group of nodes
    node = nodesG.selectAll("circle.node")
    .data(allData.nodes, d => d.id);

    // set cx, cy, r attributes and stroke-width style
    node.enter()
          .append("circle").attr("class","node")
          .attr("cx",d => d.x)
          .attr("cy",d => d.y)
          .attr("r",d => d.radius)
          .attr("fill","red")
          .style("stroke-width",1)

    node.on("mouseover", function(d,i){
      showDetails(this,d,i);
    })
    .on("mouseout", hideDetails);
  }

  // enter/exit display for links
  function updateLinks() {
    //select all link elements in svg group of nodes
    link = linksG.selectAll("line.link")
                  .data(allData.links, d => `${d.source.id}_${d.target.id}`);
                  link.enter()
                  .append("line")
                  .attr("class", "link")
                  .attr("stroke", "#ddd").attr("stroke-opacity", 0.8)
                  .attr("x1", d => d.source.x )
                  .attr("y1", d => d.source.y )
                  .attr("x2", d => d.target.x )
                  .attr("y2", d => d.target.y );
  }

  // tick function for force directed layout
  var forceTick = function(e) {
    node.attr("cx", d => d.x)
    .attr("cy", d => d.y );

    link.attr("x1", d => d.source.x )
    .attr("y1", d => d.source.y )
    .attr("x2", d => d.target.x )
    .attr("y2", d => d.target.y );

  };

  // Starting point for network visualization
  // Initializes visualization and starts force layout
  network = function(selection, data) {
    var vis;

    // format our data
    allData = setupData(data)

    // create our svg and groups
    vis = d3.select(selection).append("svg").attr("width",width).attr("height",height);
    linksG = vis.append("g").attr("id","links");
    nodesG = vis.append("g").attr("id","nodes");

    // setup the size of the force environment
    force.size([width,height]);

    // set the tick callback, charge and linkDistance
    force.on("tick", forceTick).charge(-200).linkDistance(50);

    // setup nodes and links
    force.nodes(allData.nodes);
    force.links(allData.links);

    updateNodes();
    updateLinks();

    // perform rendering and start force layout
    return force.start();
  };
  // Final act of Network() function is to return the inner 'network()' function.
  return network;
}
