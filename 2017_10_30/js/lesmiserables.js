var network = Network()

d3.json("data/lesmiserables.json",function(err,data){
	if(err) throw err
	console.log(data)
	return network("#vis",data)
})