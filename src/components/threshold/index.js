import { mixtureModel } from "../../distributions";

const distribution = mixtureModel(
  [d3.randomNormal(-10, 2), d3.randomNormal(0, 3), d3.randomNormal(10, 1.5)],
  [3.5, 2.5, 4.1]
);
const data = d3.range(10000).map(distribution);
const margin = {
  top: 10,
  right: 30,
  bottom: 40,
  left: 40,
};
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

data.sort(d3.ascending);
const limitMargin = 10;
const min = Math.min(...data) - limitMargin;
const max = Math.max(...data) + limitMargin;

const svg = d3
  .select("#dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.right})`);

const x = d3.scaleLinear().domain([min, max]).range([0, width]);

svg
  .append("g")
  .attr("transform", `translate(${0}, ${height})`)
  .call(d3.axisBottom(x));

const acessor = (d) => d;
const histogram = d3
  .histogram()
  .value(acessor)
  .domain(x.domain())
  .thresholds(x.ticks(60));

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
  .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
  .attr("height", (d) => height - y(d.length))
  .attr("transform", (d) => `translate(${x(d.x0)},${y(d.length)})`)
  .style("fill", (d) => {
    if (d.x0 < 5) {
      return "orange";
    } else {
      return "#69b3a2";
    }
  });

svg
  .append("line")
  .attr("x1", x(5))
  .attr("x2", x(5))
  .attr("y1", y(0))
  .attr("y2", y(1000))
  .attr("stroke", "grey")
  .attr("stroke-dasharray", "4");

svg
  .append("text")
  .attr("x", x(-11))
  .attr("y", y(920))
  .text("class threshold: 5")
  .style("font-size", "15px");
