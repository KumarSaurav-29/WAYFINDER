import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
  TrendingDown,
  Zap,
  Heart,
  ChevronDown,
  Users,
  Route,
  Accessibility,
} from "lucide-react";

import { optimizeTrips } from "../utils/optimizer";
import DesignInspector from "../components/DesignInspector";

function Results({ tripData, onBack }) {
  const [showInspector, setShowInspector] =
    useState(false);

  const [backendResult, setBackendResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [backendError, setBackendError] =
    useState(false);

  // Stores the currently expanded alternative.
  const [expandedOption, setExpandedOption] =
    useState(null);

  const priority =
    tripData?.priority?.id || "cheapest";

  const tripType =
    tripData?.tripType || "one-way";

  const travelers =
    tripData?.travelers || 1;

  const nights =
    tripData?.nights || 0;

  const stayBudget =
    tripData?.stayBudget || 0;

  const stayType =
    tripData?.stayType || null;

  useEffect(() => {
    async function sendTripToBackend() {
      try {
        setLoading(true);
        setBackendError(false);

        const response = await fetch(
          "http://localhost:5000/api/optimize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              from: tripData?.from,
              to: tripData?.to,
              tripType: tripData?.tripType,
              travelers: tripData?.travelers,
              departure: tripData?.departure,
              returnDate: tripData?.returnDate,
              nights: tripData?.nights,
              stayType: tripData?.stayType,
              stayBudget: tripData?.stayBudget,

              priority:
                tripData?.priority?.id,

              customWeights:
                tripData?.customWeights || null,

              constraints: {
                travelers,
                tripType,
                nights,
                stayBudget,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const data =
  await response.json();

setBackendResult(data);
setBackendError(false);
} catch (error) {
  console.error(
    "WAYFINDER backend connection failed:",
    error
  );

  setBackendError(true);
} finally {
  setLoading(false);
}
}

sendTripToBackend();
}, [tripData]);

  const options = [
    {
      id: 1,
      type: "Bus + Local",
      title: "AC Bus",
      operator: "Intercity Express",
      minutes: 85,
      transportCost: 420,
      localCost: 120,
      stayMultiplier: 0.9,
      emissions: 8.2,
      comfortScore: 0.78,
      reliabilityScore: 0.88,
      accessibilityScore: 0.72,
      transfers: 1,
      tags: [
        "Lowest transport cost",
        "Direct",
      ],
    },
    {
      id: 2,
      type: "Train + Local",
      title: "Intercity Train",
      operator: "Regional Rail",
      minutes: 65,
      transportCost: 520,
      localCost: 100,
      stayMultiplier: 1,
      emissions: 5.4,
      comfortScore: 0.82,
      reliabilityScore: 0.92,
      accessibilityScore: 0.84,
      transfers: 1,
      tags: [
        "Fast",
        "Lower emissions",
      ],
    },

    {
      id: 3,
      type: "Private Cab",
      title: "Private Cab",
      operator: "Direct journey",
      minutes: 55,
      transportCost: 950,
      localCost: 0,
      stayMultiplier: 1.6,
      emissions: 14.8,
      comfortScore: 1,
      reliabilityScore: 0.95,
      accessibilityScore: 0.96,
      transfers: 0,
      tags: [
        "Fastest",
        "Most comfortable",
      ],
    },
  ];

  function getJourneyMultiplier() {
    if (tripType === "one-way") {
      return 1;
    }

    return 2;
  }

  function calculateStayCost(option) {
    if (tripType !== "stay") {
      return 0;
    }

    if (!nights || !stayBudget) {
      return 0;
    }

    return Math.round(
      stayBudget *
      option.stayMultiplier *
      nights
    );
  }

  function calculateLocalCost(option) {
    if (tripType !== "stay") {
      return option.localCost;
    }

    return (
      option.localCost *
      Math.max(nights, 1)
    );
  }

  const constraints = {
    travelers,
    tripType,
    nights,
    stayBudget,
  };

  const processedOptions = options.map(
    (option) => {

      /*
      ========================================================
      COMPLETE TRIP CALCULATION
      ========================================================
  
      WAYFINDER evaluates the journey as a whole.
  
      Transport
          +
      Local travel
          +
      Accommodation
          ↓
      COMPLETE TRIP
      */

      const journeyMultiplier =
        getJourneyMultiplier();


      /*
      --------------------------------------------------------
      TRANSPORT
      --------------------------------------------------------
  
      Public transport:
        cost × journey × travelers
  
      Private cab:
        cost × journey
  
      This prevents a private vehicle from being
      incorrectly multiplied by the number of travelers.
      */

      const baseTransport =
        option.transportCost *
        journeyMultiplier;

      const transportTotal =
        option.title === "Private Cab"
          ? baseTransport
          : baseTransport * travelers;


      /*
      --------------------------------------------------------
      LOCAL TRAVEL
      --------------------------------------------------------
      */

      const localTotal =
        calculateLocalCost(option);


      /*
      --------------------------------------------------------
      ACCOMMODATION
      --------------------------------------------------------
      */

      const stayTotal =
        calculateStayCost(option);


      /*
      ========================================================
      COMPLETE TRIP COST
      ========================================================
      */

      const totalTripCost =
        transportTotal +
        localTotal +
        stayTotal;


      /*
      ========================================================
      COMPLETE JOURNEY TIME
      ========================================================
      */

      const totalJourneyMinutes =
        option.minutes *
        journeyMultiplier;


      /*
      ========================================================
      COMPLETE JOURNEY EMISSIONS
      ========================================================
      */

      const totalJourneyEmissions =
        option.emissions *
        journeyMultiplier;


      /*
      ========================================================
      RETURN OPTIMIZATION DATA
      ========================================================
  
      `cost`, `minutes` and `emissions` remain available
      because the optimization engine uses these fields.
  
      The explicit `total...` fields make the engineering
      model easier to understand and use elsewhere.
      */

      return {
        ...option,

        transportTotal:
          Math.round(transportTotal),

        localTotal:
          Math.round(localTotal),

        stayTotal:
          Math.round(stayTotal),

        cost:
          Math.round(totalTripCost),

        // Preserve the original one-way travel time for display.
        oneWayMinutes:
          option.minutes,

        // The optimizer evaluates the complete journey.
        minutes:
          totalJourneyMinutes,

        emissions:
          totalJourneyEmissions,

        totalTripCost:
          Math.round(totalTripCost),

        totalJourneyMinutes,

        totalJourneyEmissions,
      };
    }
  );

  const localOptimization = optimizeTrips(
    processedOptions,
    priority,
    constraints,
    tripData?.customWeights
  );
  const backendRecommendation =
    backendResult?.recommendation;

  const backendAlternatives =
    backendResult?.alternatives;

  function mapBackendOption(
    backendOption
  ) {
    const localOption =
      processedOptions.find(
        (option) =>
          option.title ===
          backendOption?.title
      );

    if (!backendOption) {
      return localOption;
    }

    return {
      ...localOption,
      ...backendOption,

      // Backend → frontend field mapping
      cost:
        backendOption.totalCost ??
        localOption?.cost ??
        0,

      totalTripCost:
        backendOption.totalCost ??
        localOption?.totalTripCost ??
        0,

      transportTotal:
        backendOption.transportTotal ??
        localOption?.transportTotal ??
        0,

      localTotal:
        backendOption.localTotal ??
        localOption?.localTotal ??
        0,

      stayTotal:
        backendOption.accommodationTotal ??
        localOption?.stayTotal ??
        0,

      oneWayMinutes:
        localOption?.oneWayMinutes ??
        backendOption.minutes ??
        0,

      minutes:
        backendOption.totalMinutes ??
        localOption?.minutes ??
        0,

      totalJourneyMinutes:
        backendOption.totalMinutes ??
        localOption?.totalJourneyMinutes ??
        0,

      emissions:
        backendOption.totalEmissions ??
        localOption?.emissions ??
        0,

      totalJourneyEmissions:
        backendOption.totalEmissions ??
        localOption?.totalJourneyEmissions ??
        0,

      score:
        backendOption.score ??
        localOption?.score ??
        0,

      factorScores:
        backendOption.factorScores ??
        localOption?.factorScores ??
        {},
    };
  }

  const recommended =
    backendRecommendation
      ? mapBackendOption(
        backendRecommendation
      )
      : localOptimization.recommended;

  const alternatives =
    backendAlternatives?.length
      ? backendAlternatives.map(
        mapBackendOption
      )
      : localOptimization.alternatives;

  const priorityNames = {
    cheapest: "Cheapest",
    fastest: "Fastest",
    value: "Best Value",
    eco: "Eco-friendly",
    accessible: "Accessible",
    risk: "Least Risk",
    custom: "Custom",
  };

  const priorityLabel =
    priorityNames[priority] ||
    "Custom";

  function getTripDescription() {
    if (tripType === "one-way") {
      return "One-way journey";
    }

    if (tripType === "round-trip") {
      return "Round-trip journey";
    }

    return `${nights} night stay`;
  }

  function getReason() {
    if (priority === "cheapest") {
      return "This option has the lowest calculated total trip cost across the evaluated alternatives.";
    }

    if (priority === "fastest") {
      return "This option has the shortest estimated complete journey time among the evaluated alternatives.";
    }

    if (priority === "eco") {
      return "This option has the lowest estimated environmental impact across the complete journey.";
    }

    if (priority === "accessible") {
      return "This option provides the strongest accessibility score with fewer difficult transfers.";
    }

    if (priority === "risk") {
      return "This option scores highest on reliability and minimizes uncertainty across the journey.";
    }

    if (priority === "value") {
      return "This option provides the strongest balance between cost, travel time, comfort and convenience.";
    }

    return "This option achieved the highest score using WAYFINDER's current multi-factor evaluation.";
  }

  const cheapestOption =
    [...alternatives].sort(
      (a, b) => a.cost - b.cost
    )[0];

  const potentialSaving =
    cheapestOption &&
      recommended &&
      cheapestOption.id !==
      recommended.id
      ? Math.max(
        0,
        recommended.cost -
        cheapestOption.cost
      )
      : 0;

  const fastestOption =
    [...alternatives].sort(
      (a, b) =>
        a.totalJourneyMinutes -
        b.totalJourneyMinutes
    )[0];

  const timeDifference =
    fastestOption &&
      recommended &&
      fastestOption.id !==
      recommended.id
      ? Math.max(
        0,
        recommended.totalJourneyMinutes -
        fastestOption.totalJourneyMinutes
      )
      : 0;

  const wayfinderScore =
    Math.round(
      Math.max(
        0,
        Math.min(
          100,
          recommended?.score || 0
        )
      )
    );

  function formatMinutes(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours =
      Math.floor(minutes / 60);

    const remaining =
      minutes % 60;

    if (remaining === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remaining}m`;
  }

  /*
   * NEW:
   *
   * Generates a simple explanation for why
   * each alternative scored the way it did.
   */
  function getAlternativeReason(
    option
  ) {
    const scores =
      option.factorScores || {};

    const strongestFactor =
      Object.entries(scores).sort(
        (a, b) => b[1] - a[1]
      )[0];

    const factorNames = {
      cost: "cost efficiency",
      time: "travel time",
      sustainability:
        "environmental performance",
      comfort: "comfort",
      reliability: "reliability",
      accessibility:
        "accessibility",
    };

    if (!strongestFactor) {
      return "Evaluated against the selected user requirement.";
    }

    return `Strongest performance comes from ${factorNames[strongestFactor[0]] || strongestFactor[0]}.`;
  }

  function toggleAlternative(id) {
    setExpandedOption(
      expandedOption === id
        ? null
        : id
    );
  }

  if (loading) {
  return (
    <main className="results-loading">
      <div className="results-loading-inner">
        <div className="results-loading-mark">
          <Route size={22} />
        </div>

        <span className="section-label">
          WAYFINDER / OPTIMIZATION
        </span>

        <h2>
          Evaluating your journey
        </h2>

        <p>
          Comparing alternatives against your
          requirements and constraints.
        </p>

        <div className="loading-line">
          <div />
        </div>
      </div>
    </main>
  );
}

if (backendError) {
  return (
    <main className="results-loading">
      <div className="results-loading-inner">

        <div className="results-loading-mark">
          <ShieldCheck size={22} />
        </div>

        <span className="section-label">
          WAYFINDER / CONNECTION ERROR
        </span>

        <h2>
          Optimization service unavailable
        </h2>

        <p>
          WAYFINDER could not connect to the optimization
          engine. Please make sure the backend server is
          running and try again.
        </p>

        <button
          type="button"
          className="priority-continue"
          onClick={() => window.location.reload()}
        >
          Retry optimization
          <ArrowRight size={18} />
        </button>

      </div>
    </main>
  );
}

  return (
    <main className="results-page">
      <div className="planner-topbar">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="planner-title">
          <span>WAYFINDER</span>
          <small>OPTIMIZATION</small>
        </div>

        <div className="step-indicator">
          <span>01</span>
          <span>/</span>
          <span>02</span>
          <span>/</span>
          <span className="active">
            03
          </span>
        </div>
      </div>

      <section className="results-content">
        <div className="results-heading">
          <div>
            <span className="section-label">
              03 / OPTIMIZED SOLUTION
            </span>

            <h1>
              Your trip,
              <br />
              <em>designed.</em>
            </h1>
          </div>

          <div className="route-summary">
            <div>
              <MapPin size={15} />
              <span>
                {tripData?.from}
              </span>
            </div>

            <ArrowRight size={15} />

            <div>
              <MapPin size={15} />
              <span>
                {tripData?.to}
              </span>
            </div>
          </div>
        </div>

        <div className="trip-summary-strip">
          <span>
            {getTripDescription()}
          </span>

          <span>
            {travelers} traveler
            {travelers !== 1
              ? "s"
              : ""}
          </span>

          {tripType ===
            "stay" && (
              <span>
                {stayType
                  ? `${stayType} accommodation`
                  : "Accommodation included"}
              </span>
            )}
        </div>

        <section className="recommendation-panel">
          <div className="recommendation-badge">
            <Check size={14} />
            RECOMMENDED FOR YOU
          </div>

          <div className="recommendation-main">
            <div className="recommendation-copy">
              <span className="result-type">
                {recommended.type}
              </span>

              <h2>
                {recommended.title}
              </h2>

              <p>
                {recommended.operator}
              </p>

              <div className="result-tags">
                {recommended.tags.map(
                  (tag) => (
                    <span
                      key={tag}
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="recommendation-total">
              <small>
                TOTAL TRIP
              </small>

              <strong>
                ₹
                {recommended.cost.toLocaleString()}
              </strong>

              <span>
                {formatMinutes(
                  recommended.oneWayMinutes
                )}{" "}
                one-way
              </span>

              {tripType !==
                "one-way" && (
                  <small className="trip-time-note">
                    {formatMinutes(
                      recommended.totalJourneyMinutes
                    )}{" "}
                    complete journey
                  </small>
                )}
            </div>
          </div>

          <div className="why-recommended">
            <div className="why-icon">
              <Star size={17} />
            </div>

            <div>
              <small>
                WHY THIS ITINERARY?
              </small>

              <p>
                You selected{" "}
                <strong>
                  {priorityLabel}
                </strong>
                .{" "}
                {getReason()}
              </p>
            </div>
          </div>
        </section>

        <div className="engineering-decision-card">
          <div className="engineering-decision-header">
            <div>
              <span className="section-label">
                ENGINEERING DESIGN / DECISION
              </span>
              <h3>How WAYFINDER reached this solution</h3>
            </div>

            <div className="engineering-decision-badge">
              <Check size={14} />
              OPTIMIZED
            </div>
          </div>

          <div className="engineering-flow">
            <div className="engineering-step">
              <span>01</span>
              <strong>User Requirement</strong>
              <small>
                {tripData?.priority?.title || "Cheapest"}
              </small>
            </div>

            <ArrowRight size={16} />

            <div className="engineering-step">
              <span>02</span>
              <strong>Criteria</strong>
              <small>
                Cost · Time · Comfort
              </small>
            </div>

            <ArrowRight size={16} />

            <div className="engineering-step">
              <span>03</span>
              <strong>Constraints</strong>
              <small>
                {constraints.travelers} traveler
                {constraints.travelers !== 1 ? "s" : ""} ·{" "}
                {constraints.tripType === "one-way"
                  ? "One-way"
                  : "Round trip"}
              </small>
            </div>

            <ArrowRight size={16} />

            <div className="engineering-step">
              <span>04</span>
              <strong>Evaluate</strong>
              <small>
                Weighted scoring
              </small>
            </div>

            <ArrowRight size={16} />

            <div className="engineering-step engineering-step-final">
              <span>05</span>
              <strong>Optimum Design</strong>
              <small>
                {recommended?.title}
              </small>
            </div>
          </div>

          <div className="constraint-impact-strip">
            <div className="constraint-impact-title">
              <ShieldCheck size={15} />
              <span>CONSTRAINTS APPLIED</span>
            </div>

            <div className="constraint-impact-items">
              <span>
                {travelers} traveler
                {travelers !== 1 ? "s" : ""}
              </span>

              <span>
                {tripType === "one-way"
                  ? "One-way"
                  : tripType === "round-trip"
                    ? "Round trip"
                    : "Trip + stay"}
              </span>

              {tripType === "stay" && (
                <span>
                  {nights} night
                  {nights !== 1 ? "s" : ""}
                </span>
              )}

              <span>
                Accessibility + Reliability + Comfort
              </span>
            </div>
          </div>
        </div>

        <section className="insight-grid">
          <div className="insight-card">
            <div className="insight-icon">
              <TrendingDown
                size={18}
              />
            </div>

            <div>
              <span>
                {potentialSaving >
                  0
                  ? "POTENTIAL SAVING"
                  : "LOWEST COST"}
              </span>

              <strong>
                ₹
                {(
                  potentialSaving >
                    0
                    ? potentialSaving
                    : recommended.cost
                ).toLocaleString()}
              </strong>

              <p>
                {potentialSaving >
                  0
                  ? "by choosing the cheapest option"
                  : "among evaluated options"}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <Zap size={18} />
            </div>

            <div>
              <span>
                {timeDifference >
                  0
                  ? "TIME DIFFERENCE"
                  : "FASTEST OPTION"}
              </span>

              <strong>
                {timeDifference >
                  0
                  ? `${timeDifference} min`
                  : formatMinutes(
                    fastestOption?.totalJourneyMinutes ||
                    recommended.totalJourneyMinutes
                  )}
              </strong>

              <p>
                {timeDifference >
                  0
                  ? "slower than the fastest option"
                  : "among evaluated options"}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <Leaf size={18} />
            </div>

            <div>
              <span>
                COMPLETE TRIP EMISSIONS
              </span>

              <strong>
                {Number(
                  recommended.totalJourneyEmissions ||
                  recommended.emissions
                ).toFixed(1)}{" "}
                kg
              </strong>

              <p>
                estimated CO₂ impact
              </p>
            </div>
          </div>

          <div className="insight-card score-card">
            <div className="score-ring">
              <strong>
                {wayfinderScore}
              </strong>

              <span>
                /100
              </span>
            </div>

            <div>
              <span>
                WAYFINDER SCORE
              </span>

              <strong>
                Best fit
              </strong>

              <p>
                based on your priority
              </p>
            </div>
          </div>
        </section>

        {priority === "eco" && (
          <section className="sustainability-section">
            <div className="results-section-header">
              <div>
                <span className="section-label">
                  SUSTAINABLE DESIGN / ECO DESIGN
                </span>

                <h3>
                  Environmental impact of your journey
                </h3>
              </div>

              <span className="sustainability-badge">
                <Leaf size={13} />
                CO₂ ESTIMATE
              </span>
            </div>

            <div className="sustainability-content">
              <div className="sustainability-primary">
                <div className="sustainability-icon">
                  <Leaf size={22} />
                </div>

                <div>
                  <span>RECOMMENDED JOURNEY</span>

                  <strong>
                    {Number(
                      recommended.totalJourneyEmissions ||
                      recommended.emissions ||
                      0
                    ).toFixed(1)} kg CO₂
                  </strong>

                  <p>
                    Estimated environmental impact for the
                    complete journey.
                  </p>
                </div>
              </div>

              <div className="sustainability-comparison">
                {alternatives.map((option) => {
                  const emissions = Number(
                    option.totalJourneyEmissions ||
                    option.emissions ||
                    0
                  );

                  const recommendedEmissions =
                    Number(
                      recommended.totalJourneyEmissions ||
                      recommended.emissions ||
                      0
                    );

                  const difference =
                    emissions - recommendedEmissions;

                  return (
                    <div
                      className={`sustainability-option ${option.id === recommended.id
                        ? "selected"
                        : ""
                        }`}
                      key={option.id}
                    >
                      <div>
                        <strong>
                          {option.title}
                        </strong>

                        <span>
                          {emissions.toFixed(1)} kg CO₂
                        </span>
                      </div>

                      <div className="sustainability-bar">
                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              (emissions / 30) * 100
                            )}%`,
                          }}
                        />
                      </div>

                      <small>
                        {option.id === recommended.id
                          ? "Selected design"
                          : difference > 0
                            ? `+${difference.toFixed(
                              1
                            )} kg vs selected`
                            : `${Math.abs(
                              difference
                            ).toFixed(
                              1
                            )} kg lower`}
                      </small>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sustainability-note">
              <Leaf size={15} />

              <p>
                <strong>Eco Design principle:</strong>{" "}
                environmental impact is treated as a measurable
                design criterion when evaluating alternative
                travel solutions.
              </p>
            </div>
          </section>
        )}

        <section className="breakdown-section">
          <div className="results-section-header">
            <div>
              <span className="section-label">
                COST BREAKDOWN
              </span>

              <h3>
                Where your money goes
              </h3>
            </div>

            <strong>
              ₹
              {recommended.cost.toLocaleString()}
            </strong>
          </div>

          <div className="breakdown-grid">
            <BreakdownItem
              label={
                tripType ===
                  "one-way"
                  ? "Transport"
                  : "Transport · Out + Return"
              }
              value={
                recommended.transportTotal
              }
            />

            <BreakdownItem
              label="Local travel"
              value={
                recommended.localTotal
              }
            />

            <BreakdownItem
              label={
                tripType ===
                  "stay"
                  ? `Stay · ${nights} night${nights !==
                    1
                    ? "s"
                    : ""
                  }`
                  : "Stay"
              }
              value={
                recommended.stayTotal
              }
            />
          </div>
        </section>

        <section className="alternatives-section">
          <div className="results-section-header">
            <div>
              <span className="section-label">
                ALTERNATIVES
              </span>

              <h3>
                Compare your options
              </h3>
            </div>

            <span className="alternative-count">
              {alternatives.length}{" "}
              options evaluated
            </span>
          </div>

          <div className="alternative-list">
            {alternatives.map(
              (option, index) => {
                const score =
                  Math.round(
                    option.score || 0
                  );

                const isExpanded =
                  expandedOption ===
                  option.id;

                return (
                  <article
                    key={option.id}
                    className={`alternative-card ${index === 0
                      ? "top-option"
                      : ""
                      } ${isExpanded
                        ? "expanded"
                        : ""
                      }`}
                  >
                    {/* MAIN CLICKABLE AREA */}
                    <button
                      className="alternative-main"
                      onClick={() =>
                        toggleAlternative(
                          option.id
                        )
                      }
                      aria-expanded={
                        isExpanded
                      }
                    >
                      <div className="alternative-rank">
                        0
                        {index + 1}
                      </div>

                      <div className="alternative-info">
                        <div className="alternative-title-row">
                          <h4>
                            {option.title}
                          </h4>

                          {index ===
                            0 && (
                              <span className="best-label">
                                BEST FIT
                              </span>
                            )}
                        </div>

                        <p>
                          {option.operator}
                        </p>

                        <div className="alternative-tags">
                          {option.tags.map(
                            (tag) => (
                              <span
                                key={
                                  tag
                                }
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="alternative-stat">
                        <Clock3 size={14} />

                        <span>
                          {formatMinutes(
                            option.totalJourneyMinutes
                          )}
                        </span>
                      </div>

                      <div className="alternative-stat">
                        <Leaf
                          size={14}
                        />

                        <span>
                          {Number(
                            option.totalJourneyEmissions ||
                            option.emissions
                          ).toFixed(
                            1
                          )}{" "}
                          kg
                        </span>
                      </div>

                      <div className="alternative-score">
                        <div className="alternative-score-header">
                          <span>
                            WAYFINDER
                          </span>

                          <strong>
                            {score}
                          </strong>
                        </div>

                        <div className="score-bar">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${score}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="alternative-price">
                        <small>
                          TOTAL
                        </small>

                        <strong>
                          ₹
                          {option.cost.toLocaleString()}
                        </strong>
                      </div>

                      <ChevronDown
                        size={17}
                        className={`alternative-chevron ${isExpanded
                          ? "rotated"
                          : ""
                          }`}
                      />
                    </button>

                    {/* EXPANDED DETAILS */}
                    {isExpanded && (
                      <div className="alternative-details">
                        <div className="alternative-detail-heading">
                          <div>
                            <span>
                              OPTION ANALYSIS
                            </span>

                            <h5>
                              Why this option?
                            </h5>
                          </div>

                          <p>
                            {getAlternativeReason(
                              option
                            )}
                          </p>
                        </div>

                        <div className="detail-metrics">
                          <DetailMetric
                            icon={
                              <TrendingDown
                                size={15}
                              />
                            }
                            label="Transport"
                            value={`₹${option.transportTotal.toLocaleString()}`}
                          />

                          <DetailMetric
                            icon={
                              <Route
                                size={15}
                              />
                            }
                            label="Local travel"
                            value={`₹${option.localTotal.toLocaleString()}`}
                          />

                          <DetailMetric
                            icon={
                              <Clock3
                                size={15}
                              />
                            }
                            label="Complete journey"
                            value={formatMinutes(
                              option.totalJourneyMinutes
                            )}
                          />

                          <DetailMetric
                            icon={
                              <Leaf
                                size={15}
                              />
                            }
                            label="CO₂ impact"
                            value={`${Number(
                              option.totalJourneyEmissions ||
                              option.emissions
                            ).toFixed(
                              1
                            )} kg`}
                          />

                          <DetailMetric
                            icon={
                              <Users
                                size={15}
                              />
                            }
                            label="Travelers"
                            value={`${travelers}`}
                          />

                          <DetailMetric
                            icon={
                              <Accessibility
                                size={15}
                              />
                            }
                            label="Transfers"
                            value={`${option.transfers}`}
                          />
                        </div>

                        <div className="detail-factor-grid">
                          <DetailFactor
                            label="Comfort"
                            value={
                              option
                                .factorScores
                                ?.comfort
                            }
                          />

                          <DetailFactor
                            label="Reliability"
                            value={
                              option
                                .factorScores
                                ?.reliability
                            }
                          />

                          <DetailFactor
                            label="Accessibility"
                            value={
                              option
                                .factorScores
                                ?.accessibility
                            }
                          />

                          <DetailFactor
                            label="Sustainability"
                            value={
                              option
                                .factorScores
                                ?.sustainability
                            }
                          />
                        </div>

                        <div className="detail-total">
                          <div>
                            <span>
                              COMPLETE TRIP
                            </span>

                            <small>
                              Transport + local
                              travel
                              {tripType ===
                                "stay" &&
                                " + accommodation"}
                            </small>
                          </div>

                          <strong>
                            ₹
                            {option.cost.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>

          <div className="factor-comparison">
            <div className="factor-comparison-header">
              <div>
                <span className="section-label">
                  DECISION FACTORS
                </span>

                <h3>
                  What influenced the ranking?
                </h3>
              </div>

              <span>
                {priorityLabel} priority
              </span>
            </div>

            <div className="factor-grid">
              <FactorItem
                label="Cost"
                value={
                  recommended.factorScores
                    ?.cost
                }
                icon="₹"
              />

              <FactorItem
                label="Travel time"
                value={
                  recommended.factorScores
                    ?.time
                }
                icon="T"
              />

              <FactorItem
                label="Sustainability"
                value={
                  recommended.factorScores
                    ?.sustainability
                }
                icon="E"
              />

              <FactorItem
                label="Comfort"
                value={
                  recommended.factorScores
                    ?.comfort
                }
                icon="C"
              />

              <FactorItem
                label="Reliability"
                value={
                  recommended.factorScores
                    ?.reliability
                }
                icon="R"
              />

              <FactorItem
                label="Accessibility"
                value={
                  recommended.factorScores
                    ?.accessibility
                }
                icon="A"
              />
            </div>
          </div>
          {priority === "eco" && (
            <div className="eco-design-callout">
              <div className="eco-design-icon">
                <Leaf size={17} />
              </div>

              <div className="eco-design-content">
                <span className="section-label">
                  SUSTAINABLE DESIGN / ECO DESIGN
                </span>

                <strong>
                  Environmental impact is the primary design criterion.
                </strong>

                <p>
                  WAYFINDER compares alternatives using estimated
                  emissions and prioritizes the journey with the
                  lowest environmental impact.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="design-process-section">
          <div className="results-section-header">
            <div>
              <span className="section-label">
                ENGINEERING DESIGN PROCESS
              </span>

              <h3>
                From requirement to optimum solution
              </h3>
            </div>

            <span className="design-process-status">
              <Check size={13} />
              DECISION COMPLETE
            </span>
          </div>

          <div className="design-process-track">
            <div className="design-process-node">
              <span>01</span>
              <div>
                <strong>Identify</strong>
                <small>User need</small>
              </div>
            </div>

            <ArrowRight size={15} />

            <div className="design-process-node">
              <span>02</span>
              <div>
                <strong>Define</strong>
                <small>{priorityLabel}</small>
              </div>
            </div>

            <ArrowRight size={15} />

            <div className="design-process-node">
              <span>03</span>
              <div>
                <strong>Generate</strong>
                <small>{alternatives.length} alternatives</small>
              </div>
            </div>

            <ArrowRight size={15} />

            <div className="design-process-node">
              <span>04</span>
              <div>
                <strong>Evaluate</strong>
                <small>Weighted criteria</small>
              </div>
            </div>

            <ArrowRight size={15} />

            <div className="design-process-node active">
              <span>05</span>
              <div>
                <strong>Select</strong>
                <small>{recommended?.title}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="constraints-section">
          <div className="results-section-header">
            <div>
              <span className="section-label">
                DESIGN CONSTRAINTS
              </span>

              <h3>
                Conditions considered during optimization
              </h3>
            </div>

            <span className="constraints-badge">
              <ShieldCheck size={13} />
              ACTIVE
            </span>
          </div>

          <div className="constraints-grid">
            <div className="constraint-item">
              <span>TRAVELERS</span>
              <strong>
                {travelers}
              </strong>
              <small>
                {travelers === 1
                  ? "person"
                  : "people"}
              </small>
            </div>

            <div className="constraint-item">
              <span>TRIP TYPE</span>
              <strong>
                {tripType === "one-way"
                  ? "One-way"
                  : tripType === "round-trip"
                    ? "Round trip"
                    : "Trip + stay"}
              </strong>
              <small>
                Journey structure
              </small>
            </div>

            <div className="constraint-item">
              <span>DEPARTURE</span>
              <strong>
                {tripData?.departure || "Not set"}
              </strong>
              <small>
                Travel date
              </small>
            </div>

            <div className="constraint-item">
              <span>RETURN</span>
              <strong>
                {tripType === "one-way"
                  ? "—"
                  : tripData?.returnDate || "Not set"}
              </strong>
              <small>
                Return requirement
              </small>
            </div>

            {tripType === "stay" && (
              <>
                <div className="constraint-item">
                  <span>STAY</span>
                  <strong>
                    {nights} night
                    {nights !== 1 ? "s" : ""}
                  </strong>
                  <small>
                    Accommodation duration
                  </small>
                </div>

                <div className="constraint-item">
                  <span>STAY BUDGET</span>
                  <strong>
                    ₹{stayBudget.toLocaleString()}
                  </strong>
                  <small>
                    Maximum planned budget
                  </small>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="decision-summary">
          <div className="decision-summary-icon">
            <Heart size={19} />
          </div>

          <div>
            <span>
              HUMAN-CENTERED DECISION
            </span>

            <h3>
              Optimized around what matters to you.
            </h3>

            <p>
              WAYFINDER did not choose a universally
              "best" journey. It evaluated the available
              alternatives against your selected
              requirement and constraints.
            </p>
          </div>
        </section>

        <section className="inspector">
          <div className="inspector-icon">
            <ShieldCheck size={19} />
          </div>

          <div className="inspector-copy">
            <span>
              DESIGN INSPECTOR
            </span>

            <h3>
              How WAYFINDER made this decision
            </h3>

            <p>
              User requirement → alternatives →
              constraints → evaluation → optimum solution.
            </p>
          </div>

          <button
            className="inspector-button"
            onClick={() =>
              setShowInspector(true)
            }
          >
            Inspect decision
            <ArrowRight size={15} />
          </button>
        </section>
      </section>

      {showInspector && (
        <DesignInspector
          tripData={tripData}
          recommended={
            recommended
          }
          alternatives={
            alternatives
          }
          onClose={() =>
            setShowInspector(false)
          }
        />
      )}
    </main>
  );
}

function BreakdownItem({
  label,
  value,
}) {
  return (
    <div className="breakdown-item">
      <span>{label}</span>

      <strong>
        ₹{value.toLocaleString()}
      </strong>
    </div>
  );
}

function FactorItem({
  label,
  value,
  icon,
}) {
  const score =
    Math.round(value || 0);

  return (
    <div className="factor-item">
      <div className="factor-item-top">
        <div className="factor-icon">
          {icon}
        </div>

        <span>{label}</span>

        <strong>
          {score}
        </strong>
      </div>

      <div className="factor-bar">
        <div
          className="factor-bar-fill"
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}) {
  return (
    <div className="detail-metric">
      <div className="detail-metric-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function DetailFactor({
  label,
  value,
}) {
  const score =
    Math.round(value || 0);

  return (
    <div className="detail-factor">
      <div>
        <span>{label}</span>
        <strong>{score}</strong>
      </div>

      <div className="detail-factor-bar">
        <div
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}

export default Results;

