export function optimizeTrips(
  options,
  priority,
  constraints = {},
  customWeights = null
) {
  if (!options || options.length === 0) {
    return {
      recommended: null,
      alternatives: [],
    };
  }

  const costs = options.map((item) => item.cost);
  const times = options.map((item) => item.minutes);
  const emissions = options.map((item) => item.emissions);

  const weights =
    priority === "custom" && customWeights
      ? {
        cost: Number(customWeights.cost || 0) / 100,
        time: Number(customWeights.time || 0) / 100,
        sustainability:
          Number(customWeights.sustainability || 0) / 100,
        comfort:
          Number(customWeights.comfort || 0) / 100,
        reliability:
          Number(customWeights.reliability || 0) / 100,
        accessibility:
          Number(customWeights.accessibility || 0) / 100,
      }
      : getWeights(priority);

  const scored = options.map((option) => {
    const costScore = normalize(option.cost, costs, true);
    const timeScore = normalize(option.minutes, times, true);
    const sustainabilityScore = normalize(
      option.emissions,
      emissions,
      true
    );

    const comfortScore = clampScore(option.comfortScore);
    const reliabilityScore = clampScore(
      option.reliabilityScore
    );
    const accessibilityScore = clampScore(
      option.accessibilityScore
    );

    let rawScore =
      costScore * weights.cost +
      timeScore * weights.time +
      sustainabilityScore * weights.sustainability +
      comfortScore * weights.comfort +
      reliabilityScore * weights.reliability +
      accessibilityScore * weights.accessibility;

    /*
      CONSTRAINT ADJUSTMENTS
    */

    // More travelers → accessibility becomes more important
    if (Number(constraints.travelers) >= 4) {
      rawScore += accessibilityScore * 0.05;
    }

    // Round trip → reliability matters slightly more
    if (constraints.tripType === "round-trip") {
      rawScore += reliabilityScore * 0.03;
    }

    // Trip + stay → comfort matters slightly more
    if (constraints.tripType === "stay") {
      rawScore += comfortScore * 0.03;
    }

    const score = Number(
      Math.max(0, Math.min(100, rawScore)).toFixed(2)
    );

    return {
      ...option,
      score,

      factorScores: {
        cost: Number(costScore.toFixed(1)),
        time: Number(timeScore.toFixed(1)),
        sustainability: Number(
          sustainabilityScore.toFixed(1)
        ),
        comfort: Number(comfortScore.toFixed(1)),
        reliability: Number(
          reliabilityScore.toFixed(1)
        ),
        accessibility: Number(
          accessibilityScore.toFixed(1)
        ),
      },

      weights,

      constraintImpact: {
        travelers:
          Number(constraints.travelers || 1) >= 4
            ? "Accessibility prioritized for larger groups"
            : null,

        tripType:
          constraints.tripType === "round-trip"
            ? "Reliability considered for return journey"
            : constraints.tripType === "stay"
              ? "Comfort considered for extended journey"
              : null,
      },
    };
  });

  const sorted = [...scored].sort(
    (a, b) => b.score - a.score
  );

  const ranked = sorted.map((option, index) => ({
    ...option,
    rank: index + 1,
  }));

  return {
    recommended: ranked[0] || null,
    alternatives: ranked,
  };
}

export function getWeights(priority) {
  switch (priority) {
    case "cheapest":
      return {
        cost: 1,
        time: 0,
        sustainability: 0,
        comfort: 0,
        reliability: 0,
        accessibility: 0,
      };

    case "fastest":
      return {
        cost: 0,
        time: 1,
        sustainability: 0,
        comfort: 0,
        reliability: 0,
        accessibility: 0,
      };

    case "eco":
      return {
        cost: 0,
        time: 0,
        sustainability: 1,
        comfort: 0,
        reliability: 0,
        accessibility: 0,
      };

    case "accessible":
      return {
        cost: 0.10,
        time: 0.10,
        sustainability: 0.10,
        comfort: 0.25,
        reliability: 0.15,
        accessibility: 0.30,
      };

    case "risk":
      return {
        cost: 0.10,
        time: 0.10,
        sustainability: 0.05,
        comfort: 0.10,
        reliability: 0.55,
        accessibility: 0.10,
      };

    case "value":
      return {
        cost: 0.35,
        time: 0.25,
        sustainability: 0.15,
        comfort: 0.25,
        reliability: 0,
        accessibility: 0,
      };

    case "custom":
      return {
        cost: 0.30,
        time: 0.20,
        sustainability: 0.15,
        comfort: 0.20,
        reliability: 0.10,
        accessibility: 0.05,
      };

    default:
      return {
        cost: 1,
        time: 0,
        sustainability: 0,
        comfort: 0,
        reliability: 0,
        accessibility: 0,
      };
  }
}

function normalize(value, values, inverse = false) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return 100;
  }

  const normalized =
    ((value - min) / (max - min)) * 100;

  return inverse
    ? 100 - normalized
    : normalized;
}

function clampScore(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return (
    Math.max(0, Math.min(1, numericValue)) * 100
  );
}