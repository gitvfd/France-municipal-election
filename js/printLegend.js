function printLegend(){
						d3.csv("data/parti.csv", function(error,list){
							g3.selectAll("circle")
								.remove();
							g3.selectAll("text")
								.remove();

							g3.selectAll("circle")
								.data(list)
								.enter()
								.append("circle")
								.attr("cx",15)
                        		.attr("cy",function(d,i){return 15*i+350})
                        		.attr("r",5)
                        		.attr("fill",function(d){ return "#"+d.partiColor});

							g.selectAll("text")
								.data(list)
								.enter()
								.append("text")
								.attr("x",25)
                        		.attr("y",function(d,i){return 15*i+350+5})
                        		.text(function(d){return d.PartiName +" (" + d.partiAcro + ")"});
						});						
					};