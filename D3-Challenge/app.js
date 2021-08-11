var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function (ourData) {

  // Parse Data/Cast as numbers
  // ==============================
  ourData.forEach(function (data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([37000, d3.max(ourData, d => d.income)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(ourData, d => d.obesity)])
    .range([height, 0]);

  // Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(ourData)
    .enter();

  circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", ".5")
    .on("click", function (data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

    // append our state abbreviations and mouseovers
  circlesGroup.append("text")
    // .attr("class", function(d) {return `stateabbr ${d.abbr}`} )
    .attr("class", function (d) { return `statespot` })
    .text(function (d) { return d.abbr })
    .attr("dx", d => xLinearScale(d.income))
    // subtract just a bit to adjust where the text is drawn
    .attr("dy", d => yLinearScale(d.obesity - 0.2))
    .on("click", function (data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });



  // Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`);
    });

  // Create tooltips in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Income");
}).catch(function (error) {
  console.log(error);
});
