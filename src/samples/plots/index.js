import { gaussian, mixture } from "../../distributions";

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

const y = d3.scaleLinear().domain([0, 0.4]).range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

const g1 = gaussian(0, 3);
const sample1 = x.ticks(100).map((xi) => [xi, g1(xi)]);
const g2 = gaussian(8, 1);
const sample2 = x.ticks(100).map((xi) => [xi, g2(xi)]);
const m = mixture([g1, g2], [2, 0.5]);
const sample3 = x.ticks(100).map((xi) => [xi, m(xi)]);

svg
  .append("path")
  .attr("class", "gaussianPlot")
  .datum(sample1)
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

svg
  .append("path")
  .attr("class", "gaussianPlot")
  .datum(sample2)
  .attr("fill", colors.turquoise)
  .attr("opacity", ".6")
  .attr("stroke", "#000")
  .attr("stroke-width", 1)
  .attr("stroke-linejoin", "round")
  .attr(
    "d",
    d3
      .line()
      .curve(d3.curveBasis)
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
  );

svg
  .append("path")
  .attr("class", "gaussianPlot")
  .datum(sample3)
  .attr("fill", colors.orange)
  .attr("opacity", ".4")
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

/* 
// Handmade legend
svg.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
svg.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "#404080")
svg.append("text").attr("x", 320).attr("y", 30).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 320).attr("y", 60).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

</script> */
