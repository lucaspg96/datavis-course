class Network {

  constructor(width=500,height=500){
    this.width = width;
    this.height = height;
    // our force directed layout
    this.force = d3.layout.force();
    // these will point to the circles and lines
    // of the nodes and links
    this.link = null;
    this.node = null;
    // these will hold the svg groups for
    // accessing the nodes and links display
    this.linksG = null;
    this.nodesG = null;
    // tooltip used to display details
    this.tooltip = Tooltip("vis-tooltip", 230);

    this.radiusDomain = undefined;

    this.showDetails = d => "";
    this.hideDetails = d => "";

  }

  // Helper function to map node id's to node objects.
  // Returns d3.map of ids -> nodes
  __mapNodes(nodes) {
    var nodesMap;
    nodesMap = d3.map();
    nodes.forEach(function(n) {
      return nodesMap.set(n.id, n);
    });
    return nodesMap;
  }

  //returns a json where the key is the node id and the value is its degree
  getDegreesMap(data=this.allData){
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

  //set the function used to calculate the domain of the radius
  setRadiusDomain(callback){
    this.radiusDomain = callback
  }

  __setupData(data){
    var circleRadius, countExtent;
    var degreesMap = this.getDegreesMap(data);
    
    if(!this.radiusDomain)
      this.radiusDomain = d=>degreesMap[d.id]

    countExtent = d3.extent(data.nodes, this.radiusDomain );
    circleRadius = d3.scale.sqrt().range([3, 15]).domain(countExtent);

    data.nodes.forEach(n => {
      n.x = Math.floor(Math.random() * this.width);
      n.y = Math.floor(Math.random() * this.height);

      n.degree = degreesMap[n.id]
      n.radius = circleRadius(this.radiusDomain(n));
    });

    var nodesMap = this.__mapNodes(data.nodes);

    data.links.forEach(l => {
      l.source = nodesMap.get(l.source);
      l.target = nodesMap.get(l.target);
    })

    return data;
  }

  //set the function to "mouseover" event
  onShowDetails(callback){
    this.showDetails = callback
  }

  //set the function to "mouseout" event
  onHideDetails(callback){
    this.hideDetails = callback
  }

  // enter/exit display for nodes
  __updateNodes(color) {
    var classThis = this
    //select all node elements in svg group of nodes
    //select all node elements in svg group of nodes
    this.node = this.nodesG.selectAll("circle.node")
    .data(this.allData.nodes, d => d.id);

    // set cx, cy, r attributes and stroke-width style
    this.node.enter()
          .append("circle").attr("class","node")
          .attr("cx",d => d.x)
          .attr("cy",d => d.y)
          .attr("r",d => d.radius)
          .attr("fill",color)
          .style("stroke-width",1)

    this.node.on("mouseover", function(d,i){
      classThis.showDetails(d, i, this, classThis);
    })
    .on("mouseout", function(d,i){
      classThis.hideDetails(d, i, this, classThis);
    });
  }

  // enter/exit display for links
  __updateLinks() {
    //select all link elements in svg group of nodes
    this.link = this.linksG.selectAll("line.link")
                  .data(this.allData.links, d => `${d.source.id}_${d.target.id}`);
    this.link.enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#ddd").attr("stroke-opacity", 0.8)
    .attr("x1", d => d.source.x )
    .attr("y1", d => d.source.y )
    .attr("x2", d => d.target.x )
    .attr("y2", d => d.target.y );
  }

  // tick function for force directed layout
  __forceTick(e) {
    this.node.attr("cx", d => d.x)
    .attr("cy", d => d.y );

    this.link.attr("x1", d => d.source.x )
    .attr("y1", d => d.source.y )
    .attr("x2", d => d.target.x )
    .attr("y2", d => d.target.y );

  };

  // Starting point for network visualization
  // Initializes visualization and starts force layout
  render(selection, data, color="red",charge=-200, linkDistance=50) {
    var vis;
    var classThis = this;
    // format our data
    this.allData = this.__setupData(data)

    // create our svg and groups
    vis = d3.select(selection).append("svg").attr("width",this.width).attr("height",this.height);
    this.linksG = vis.append("g").attr("id","links");
    this.nodesG = vis.append("g").attr("id","nodes");

    // setup the size of the force environment
    this.force.size([this.width,this.height]);

    // set the tick callback, charge and linkDistance
    this.force.on("tick", function(e){
      classThis.__forceTick(e);
    })
    .charge(charge).linkDistance(linkDistance);

    // setup nodes and links
    this.force.nodes(this.allData.nodes);
    this.force.links(this.allData.links);

    this.__updateNodes(color);
    this.__updateLinks();

    // perform rendering and start force layout
    this.force.start();
  };
}
