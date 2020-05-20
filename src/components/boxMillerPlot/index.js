import { boxMullerGaussian } from "../../distributions/index";

const colors = {
  orange: "#eba307",
  turquoise: "#3babbf",
  violet: "#a12869",
  pinkViolet: "#a53bbf",
};
const margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 50,
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

const x = d3.scaleLinear().domain([-10, 15]).range([0, width]);
svg
  .append("g")
  .attr("transform", `translate(${0},${height})`)
  .call(d3.axisBottom(x));

const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

const f = boxMullerGaussian();
const data = x.ticks(100).map((xi) => [xi, f(xi)]);

svg
  .append("path")
  .attr("class", "gaussianPlot")
  .datum(data)
  .attr("fill", colors.violet)
  .attr("opacity", ".75")
  .attr("stroke", "#000")
  .attr("stroke.width", 1)
  .attr("stroke-linejoin", "round")
  .attr(
    "d",
    d3
      .line()
      .curve(d3.curveBasis)
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
  );
