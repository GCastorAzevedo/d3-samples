/* // https://www.d3-graph-gallery.com/histogram

const margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 40,
  },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3
  .select("#gaussian")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().domain([0, 1000]).range([0, width]); // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv"
).then((data) => {
  const histogram = d3
    .histogram()
    .value((d) => d.price)
    .domain(x.domain())
    .thresholds(x.ticks(100));
  const bins = histogram(data);
  console.log(bins);

  const y = d3.scaleLinear().range([height, 0]);
  y.domain([0, d3.max(bins, (d) => d.length)]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("width", (d) => x(d.x1) - x(d.x0))
    .attr("height", (d) => height - y(d.length))
    .attr("transform", (d) => `translate(${x(d.x0)},${y(d.length)})`)
    .style("fill", "#69b3a2");
});
 */
