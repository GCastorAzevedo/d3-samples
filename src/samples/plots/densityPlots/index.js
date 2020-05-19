import { mixtureModel } from "../../../distributions";

function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
  };
}

/* 
  Epanechnikov kernel with bandwidth h = k, integer
*/
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

const distribution = mixtureModel(
  [
    d3.randomNormal(-10, 2),
    d3.randomNormal(0, 3),
    d3.randomNormal(10, 1.5),
    d3.randomNormal(30, 0.001),
  ],
  [3.5, 2.5, 4.1, 10]
);
const data = d3.range(10000).map(distribution);
const margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 50,
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
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().domain([min, max]).range([0, width]);

svg
  .append("g")
  .attr("transform", `translate(${0}, ${height})`)
  .call(d3.axisBottom(x));

const y = d3.scaleLinear().range([height, 0]).domain([0, 0.1]);

svg.append("g").call(d3.axisLeft(y));

const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
const density = kde(data.map((d) => d));

svg
  .append("path")
  .attr("class", "densityEstimator")
  .datum(density)
  .attr("fill", "#69b3a2")
  .attr("opacity", ".8")
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
