const fs = require('fs');
var margin = { left: 100, right: 10, top: 10, botton: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.botton;

var flag = true;

////add transition
var t = d3.transition().duration(750);

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("height", height + margin.left + margin.right)
    .attr("width", width + margin.top + margin.botton);

var group = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.3);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxisGroup = group.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + height + ")")


var yAxisGroup = group.append("g")
    .attr("class", "y-axis");

//y lable
var yAxisCall = yLabel = group.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .text("Revenue")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle");

group.append("text")
    .attr("class", "y axis-label")
    .attr("x", width / 2)
    .attr("y", height + 70)
    .text("Month")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle");



var data1 = fs.readFileSync('revenues.json');
console.log(data1.toString());
d3.json("data/revenues.json").then((data) => {
    //console.log(data);

    d3.interval(function () {
        var newData = flag ? data : data.slice(1);
        update(newData);
        flag = !flag;
    }, 1000);

    update(data);

});

function update(data) {

    var value = flag ? "revenue" : "profit";

    x.domain(data.map((d) => { return d.month; }));
    y.domain([0, d3.max(data, d => { return d[value]; })]);

    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall)
    // .selectAll("text")
    // .attr("x", -5)
    // .attr("y", 10)
    // .attr("text-anchor", "end")
    // .attr("transform", "rotate(-40)");

    var yAxisCall = d3.axisLeft(y);
    yAxisGroup.transition(t).call(yAxisCall);

    //JOIN new data with old element
    var rects = group.selectAll("rect")
        .data(data, function (d) {
            return d.month;
        });

    //EXIT old elements not present in new data.
    rects.exit()
        .attr("fill", "red")
        .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();


    /*//UPDATE old elements present in new data
    rects.transition(t)
        .attr("x", d => { return x(d.month); })
        .attr("y", d => { return y(d[value]); })
        .attr("width", x.bandwidth)
        .attr("height", d => { return height - y(d[value]); });


    //ENTER new elements present in new data.
    rects.enter()
        .append("rect")
        .attr("x", d => {
            //console.log(x(d.month));
            return x(d.month);
        })
        .attr("y", y(0))
        .attr("width", x.bandwidth)
        .attr("height", 0)
        .attr("fill", "grey")
        .transition(t)
        .attr("y", d => {
            // console.log(y(d.revenue));
            return y(d[value]);
        })
        .attr("height", d => { return height - y(d[value]); });*/

    rects.enter()
        .append("rect")
        .attr("x", d => {
            //console.log(x(d.month));
            return x(d.month);
        })
        .attr("y", y(0))
        .attr("width", x.bandwidth)
        .attr("height", 0)
        .attr("fill", "grey")
        .merge(rects)
        .transition(t)
        .attr("x", d => { return x(d.month); })
        .attr("y", d => {
            return y(d[value]);
        })
        .attr("height", d => { return height - y(d[value]); })
        .attr("width", x.bandwidth);

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
}