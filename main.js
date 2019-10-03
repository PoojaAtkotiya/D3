function onLoadFunc() {

    var rect = d3.select("#canvas")  //use of select - return svg element having id "canvas"
        .append("rect")      //use of append by appending rectangle - return emplty rect
        .attr("x", 25)       //set rectangle attributes - set attr. to empty rect
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", 60)
        .attr("fill", "blue");

    ////Selection and Data joins
    d3.csv("employee.csv").then(function (data) {
        //console.log(data);
        circleData = data;
        //var circleData = [25, 20, 10, 12, 15];
        var svg = d3.select("#chart-area").append("svg")
            .attr("width", 1000)
            .attr("height", 200);

        var circles = svg.selectAll("circle")
            .data(circleData);

        circles.enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return (i * 50) + 100;
            })
            .attr("cy", 100)
            .attr("r", (d) => {
                return d.Age / 2;
            })
            .attr("fill", "grey");
    }).catch(error => {
        console.log(error);
    });



    //Exercise
    var svg1 = d3.select("#ex1").append("svg").attr("width", 400).attr("height", 400);

    //add line
    var line = svg1.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 50).attr("y2", 50).attr("stroke", "black");

    //add ellipse
    var ellipse = svg1.append("ellipse").attr("cx", 160).attr("cy", 160).attr("rx", 60).attr("ry", 120).attr("fill", "lightgreen")

    //project 1 - Bar Chart from Building.json using scaleLinear
    var barSVG = d3.select("#ex2").append("svg").attr("width", 400).attr("height", 500);

    d3.json("building.json").then(function (bData) {
        //console.log(bData);  //not print on console without then()

        bData.forEach(d => {
            d.height = +d.height;
        });

        var y = d3.scaleLinear()
            .domain([0, 828])  //min and max value, domain eg. building height in json
            .range([0, 400]);  //min and max value, range eg. screen size(svg size)

        var rects = barSVG.selectAll("rect")
            .data(bData)
            .enter()
            .append("rect")
            .attr("y", 20)
            .attr("x", (d, i) => {
                return (i * 60);
            })
            .attr("width", 40)
            .attr("height", (d) => {
                return y(d.height);  //will fit height(domain) into given range of SVG
            })
            .attr("fill", "grey");
    });

    //Bar Chart from Building.json using scaleBand

    var margin = { left: 100, right: 10, top: 10, bottom: 150 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    //var barSVGBand = d3.select("#ex3").append("svg").attr("width", 400).attr("height", 400);
    var barSVGBand = d3.select("#ex3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    ////Adding Group inside SVG
    var group = barSVGBand.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // X Label
    group.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("The world's tallest buildings")

    //Y Label
    group.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height(m)")


    d3.json("building.json").then(function (bData) {
        //console.log(bData); 

        //var buildingNames = [];
        var buildingNames = bData.map(function (d) {
            return d.name;
        });;
        bData.forEach(d => {
            d.height = +d.height;
            //buildingNames.push(d.name);
        });
        //buildingNames=["Burj Khalifa","Sanghai Tower","Abraj Al-Bait Clock Tower","Ping An Finance Centre","Lotte World Tower"];

        var x = d3.scaleBand()
            .domain(buildingNames)
            .range([0, width])  //min and max value, range eg. screen size(svg size)
            .paddingInner(0.2) //padding between 2 bar
            .paddingOuter(0.2); //padding outside of first and last bar
        //console.log(x("Burj Khalifa"));

        // var y = d3.scaleLinear()
        //     .domain([0, 828])  //min and max value, domain eg. building height in json
        //     .range([0, 400]);

        // var y = d3.scaleLinear()
        //     .domain([
        //         d3.min(bData, function (b) { return b.height; }),
        //         d3.max(bData, function (b) { return b.height; })])  //min and max value, domain eg. building height in json
        //     .range([0, 400]);

        // console.log("max height = " + d3.max(bData, function (b) { return b.height; }))
        var y = d3.scaleLinear()
            .domain([0, d3.max(bData, function (b) { return b.height; })])  //min and max value, domain eg. building height in json
            .range([height, 0]);
        //.range([0, height]); //changed to above line to start bar from bottom of svg

        //Not working - need to check
        // var y = d3.scaleLinear()
        //     .domain([d3.extent(bData, function (d) { return d.height; })])  //min and max value, domain eg. building height in json
        //     .range([0, 400]);


        var xAxisCall = d3.axisBottom(x);
        group.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisCall)
            .selectAll("text")
            .attr("x", "-5")
            .attr("y", "10")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        var yAxisCall = d3.axisLeft(y)
            .ticks(3)
            .tickFormat((d) => {
                //console.log(d);
                return d + "m";
            });
        group.append("g")
            .attr("class", "y-axis")
            .call(yAxisCall);

        //var rects = barSVGBand.selectAll("rect")
        var rects = group.selectAll("rect")
            .data(bData)
            .enter()
            .append("rect")
            .attr("y", (d) => {         //.attr("y", 0)
                return y(d.height);
            })
            .attr("x", (d) => {
                return x(d.name);
            })
            .attr("width", x.bandwidth)
            .attr("height", (d) => {
                return height - y(d.height); //y(d.height) //will fit height(domain) into given range of SVG
            })
            .attr("fill", "grey");
    });

    //min, max and extent syntax
    var data = [
        { grade: "A", value: 4 },
        { grade: "B", value: 3 },
        { grade: "C", value: 2 }
    ]

    var min = d3.min(data, function (d) {
        return d.value;
    });
    //console.log(min);
    //min = 2

    var max = d3.max(data, function (d) {
        return d.value;
    });
    //console.log(max);
    //max = 4

    var val_extent = d3.extent(data, function (d) {
        return d.value;
    })
    //console.log(val_extent);
    //val_extent =[2,4]

    var grade_map = data.map(function (d) {
        return d.grade;
    });
    //console.log(grade_map);
    //grade_map =["A","B","C"]

}