/* 
  Bernoulle distribution with parameter p
  return i = 1 or 0 with probabilities p and 1 - p, respectively
  test:
    function precision(n=1000000) {
      const a = [...Array(n).keys()].map(bernoulle(p));
      mean = a.reduce((sum, next) => sum + next)/a.length }
      return Math.abs(p - mean)
    }
*/
export function bernoulli(p = 0.5) {
  if (p > 1 || p < 0) {
    throw Error(`p should be a probability between 0 and 1`);
  }
  return () => {
    Number(Math.random() <= p);
  };
}

/*
  Generate categorical distribution from weights normalized
  p_i ~ i-th weight
  return i = 1, 2, ... k, where k = weights.length
  and k has probability proportional to w_i > 0

  test:
    const a = [...Array(30).keys()].map(multinoulli(1, 2, 3, 4, 5));
    console.log(a);
*/
export function multinoulli(...weights) {
  if (weights.some((value) => value < 0)) {
    throw Error(`Probability weights should be positive!`);
  }
  const total = weights.reduce((partialSum, value) => partialSum + value);
  const probabilities = weights.map((w) => parseFloat(w) / parseFloat(total));
  const bins = probabilities.reduce(
    (prev, next, i) => prev.concat(prev[i] + next),
    [0]
  );
  return () => {
    const m = Math.random();
    return bins.findIndex((value) => value > m);
  };
}

export function biGaussian(m1 = 0, m2 = 0, s1 = 1, s2 = 1, p = 0.5) {
  const gaussian1 = d3.randomNormal(m1, s1);
  const gaussian2 = d3.randomNormal(m2, s2);
  return () => (bernoulli(p) ? gaussian1() : gaussian2());
}

export function mixtureModel(models, weights) {
  console.log(weights);
  if (weights && weights.length < models.length) {
    weights = [...Array(models.length).keys()].map(() => 1);
  }
  console.log(models.length, weights.length, models[0](), models[1](), weights);
  const selectModel = multinoulli(...weights);
  return () => {
    return models[selectModel() - 1]();
  };
}
