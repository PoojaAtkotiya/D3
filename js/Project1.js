var margin = { left: 100, right: 10, top: 10, botton: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.botton;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("height", height + margin.left + margin.right)
    .attr("width", width + margin.top + margin.botton);

var group = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.json("data/revenues.json").then((data) => {
    console.log(data);
    var x = d3.scaleBand()
        .domain(data.map((d) => { return d.month; }))
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.3);

    var xAxisCall = d3.axisBottom(x)
    group.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(xAxisCall)
        .selectAll("text")
        .attr("x", -5)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => { return d.revenue; })])
        .range([height, 0]);

    var yAxisCall = d3.axisLeft(y);
    group.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall)


    group.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => {
            //console.log(x(d.month));
            return x(d.month);
        })
        .attr("y", d => {
            // console.log(y(d.revenue));
            return y(d.revenue);
        })
        .attr("width", x.bandwidth)
        .attr("height", d => { return height - y(d.revenue); })
        .attr("fill", "grey");

    //var line = group.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 50).attr("y2", 50).attr("stroke", "black");

    var lineX = d3.scaleTime().range([0, width]);
    var lineY = d3.scaleLinear().range([height, 0]);
    
    var line = d3.line()
        .x(d => { return x(d.month) })
        .y(d => { return y(d.revenue) });

       
    group.selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => {
            //console.log(x(d.month));
            //return x(d.month);
            return 0;
        })
        .attr("y1", d => {
            // console.log(y(d.revenue));
            // return y(d.revenue);
            return 0;
        })
        .attr("x2", 50).attr("y2", 50)
        .attr("stroke", "black");

});