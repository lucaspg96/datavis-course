var network = Network()

d3.json("data/songs.json",function(err,data){
	if(err) throw err
	console.log(data)
	return network("#vis",data)
})