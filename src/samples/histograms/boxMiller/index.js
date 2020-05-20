import { boxMullerGaussian } from "../../../distributions/index";

const margin = {
  top: 10,
  right: 30,
  bottom: 30,
  left: 40,
};
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3
  .select("#dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const total = 10000;
const data = d3.range(total).map(boxMullerGaussian(0, 1)).sort(d3.ascending);

const min = Math.min(...data) - 10;
const max = Math.max(...data) + 10;
const x = d3.scaleLinear().domain([min, max]).range([0, width]); // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

draw(data);

function draw(data) {
  const histogram = d3
    .histogram()
    .value((d) => d)
    .domain(x.domain())
    .thresholds(x.ticks(100));
  const bins = histogram(data);

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
}
