function changeRound(Round){

    document.getElementById("roundClicked").innerHTML =Round;
    console.log(Round);

    var numDpt = document.getElementById("selectedDpt").innerHTML;
    console.log(numDpt);

    if(numDpt!="France"){
        console.log(numDpt);
        
        if(Round == "1st round"){
            var URLDpt= "data/"+numDpt+".csv";
        };
        if(Round == "2nd round"){
            var URLDpt= "data2/"+numDpt+".csv";
        };

        var dptURL="France_json/"+numDpt+".json";

        var coordinate0 = document.getElementById("coordinatesDpt0").innerHTML;
        var coordinate1 = document.getElementById("coordinatesDpt1").innerHTML;
        
        console.log(coordinate0,coordinate1);
        console.log(dptURL);
        console.log(URLDpt); 

        var cityProjection = d3.geo.mercator()
                    .center(coordinate0,coordinate1)
                    .scale(13500)
                    .translate([(width) / 2, (height)/2])
                    .precision(.1);


        var cityPath = d3.geo.path()
            .projection(cityProjection);

        console.log(cityPath);

    	var communes= g2.append("g")
             .attr("id", "communes");

        var color = d3.scale.ordinal()
                .domain(["LDIV","INDIVIDU","LEXD","LFN","LDVD","LUD","LUMP","LUC","LMDM","LUDI","LSOC","LUG","LPG","LDVG","LCOM","LFG","LEXG","LVEC"])
                .range(["#D8D8D8","#FFFFCC","#000000","#000033","#000066","#000099","#0000CC","#FF9900","#FF9933","#FF9966","#CC33FF","#CC33CC","#CC3399","#CC3366","#CC3333","#CC3330","#CC0000","#00CC33"]);

        d3.csv(URLDpt, function(error,resultDpt){
        
            d3.json(dptURL, function(error, communeDpt) {
                        var colorByScore = {};
                        var voteNbr;
                                
                        resultDpt.forEach(function(d) { 
                            if(colorByScore[d.code_insee] == null){

                                var resultCity=resultDpt.filter(function(data) {
                                    return(data.code_insee == d.code_insee)
                                });
                                voteNbr=0;

                                                
                                resultCity.forEach(function(dataCity) {
                                    if (parseInt(dataCity.nb_voix) >= parseInt(voteNbr)){
                                        colorByScore[dataCity.code_insee] = dataCity.parti;
                                        voteNbr = dataCity.nb_voix; 
                                    };
                                });
                                return colorByScore[d.code_insee];
                            };
                        });

                        g2.selectAll("path")
                            .data(communeDpt.features)
                            .transition().duration(1000)
                            .style("fill", function(d) { return color(colorByScore[d.properties.REF_INSEE]); });

                        g2.selectAll("path")
                            .on("mouseover", function(d) {
                                d3.select(this).style("opacity",0.5);

                                var xPosition = d3.event.pageX - 50;
                                var yPosition = d3.event.pageY - 85;

                                console.log(xPosition);
                                console.log(yPosition);


                                //Update the tooltip position and value
                                d3.select("#cityTooltip")
                                    .style("left", xPosition + "px")
                                    .style("top", yPosition + "px") 
                                    .select("#cityNameTooltip")
                                    .text(decodeURIComponent(d.properties.COMMUNE));
                                
                                var parti1,parti2,parti3,voteNbr,votant1,votant2,votant3;
                                
                                resultDpt.forEach(function(data) { 
                                    if(parti1==null){
                                        
                                        var resultCity=resultDpt.filter(function(toUse) {
                                            return(toUse.code_insee==d.properties.REF_INSEE)
                                        });
                                        votant1=0;
                                        votant2=0;
                                        votant3=0;

                                        resultCity.forEach(function(dataCity) {
                                            
                                            if (parseInt(dataCity.nb_voix) >= parseInt(votant1)){
                                                parti3 = parti2;
                                                parti2 = parti1;
                                                parti1 = decodeURIComponent(dataCity.nom) + " (" + dataCity.parti + "): " + dataCity.nb_voix +" votes ("+ dataCity.percents_exprimes + " % )"; 
                                                votant1 = dataCity.nb_voix;
                                                if(parti3 == parti2){parti3 = "";}
                                                if(parti2 == parti1){parti2 = "";}
                                            }
                                            if (parseInt(dataCity.nb_voix) < parseInt(votant1) && parseInt(dataCity.nb_voix) >= parseInt(votant2)){
                                                parti3 =parti2;
                                                parti2 = decodeURIComponent(dataCity.nom) + " (" + dataCity.parti + "): " + dataCity.nb_voix +" votes ("+ dataCity.percents_exprimes + " % )";
                                                votant2 = dataCity.nb_voix;
                                                if(parti3 == parti2){parti3 = "";}

                                            }
                                            if (parseInt(dataCity.nb_voix) < parseInt(votant2) && parseInt(dataCity.nb_voix) >= parseInt(votant3)){
                                                parti3 = decodeURIComponent(dataCity.nom) + " (" + dataCity.parti + "): " + dataCity.nb_voix +" votes ("+ dataCity.percents_exprimes + " % )";
                                                votant3 = dataCity.nb_voix;
                                            }
                                        });
                                    };
                                });

                                d3.select("#cityTooltip")
                                    .select("#firstArrived")
                                    .text(parti1);

                                d3.select("#cityTooltip")
                                    .select("#secondArrived")
                                    .text(parti2);

                                d3.select("#cityTooltip")
                                    .select("#thirdArrived")
                                    .text(parti3);

                                d3.select("#cityTooltip").classed("hidden", false);
                            })
                            .on("mouseout", function(d) {
                                d3.select(this).style("opacity",1)

                                d3.select("#cityTooltip").classed("hidden", true);
                            });

            });
        });
    };
}