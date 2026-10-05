import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  IndianRupee,
  Clock3,
  Heart,
  Accessibility,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Route,
  Sparkles,
} from "lucide-react";

function Priorities({ tripData, onBack, onContinue }) {
  const [selected, setSelected] = useState("cheapest");

  const [customWeights, setCustomWeights] = useState({
    cost: 30,
    time: 20,
    sustainability: 15,
    comfort: 20,
    reliability: 10,
    accessibility: 5,
  });

  const priorities = [
    {
      id: "cheapest",
      icon: <IndianRupee size={21} />,
      title: "Cheapest",
      description:
        "Minimize the total cost of the complete trip.",
      detail:
        "Transport + stay + local travel",
      objective:
        "Minimize total trip cost",
    },

    {
      id: "fastest",
      icon: <Clock3 size={21} />,
      title: "Fastest",
      description:
        "Reach your destination in the least possible time.",
      detail:
        "Travel time + waiting + transfers",
      objective:
        "Minimize total travel time",
    },

    {
      id: "value",
      icon: <Heart size={21} />,
      title: "Best Value",
      description:
        "Balance cost, time, comfort and convenience.",
      detail:
        "A balanced overall experience",
      objective:
        "Balance multiple factors",
    },

    {
      id: "eco",
      icon: <Leaf size={21} />,
      title: "Eco-friendly",
      description:
        "Prefer options with lower environmental impact.",
      detail:
        "Estimated emissions + transport mode",
      objective:
        "Minimize environmental impact",
    },

    {
      id: "accessible",
      icon: <Accessibility size={21} />,
      title: "Accessible",
      description:
        "Prioritize easier and more accessible travel.",
      detail:
        "Transfers + walking + accessibility",
      objective:
        "Maximize accessibility",
    },

    {
      id: "risk",
      icon: <ShieldCheck size={21} />,
      title: "Least Risk",
      description:
        "Prefer reliable and lower-risk alternatives.",
      detail:
        "Transfers + reliability + uncertainty",
      objective:
        "Maximize reliability",
    },

    {
      id: "custom",
      icon: <SlidersHorizontal size={21} />,
      title: "Custom",
      description:
        "Decide exactly how your journey should be optimized.",
      detail:
        "Set your own priorities",
      objective:
        "Use a personalized weighting",
    },
  ];

  const selectedPriority = priorities.find(
    (item) => item.id === selected
  );

  function updateCustomWeight(key, value) {
    setCustomWeights((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  }

  function handleContinue() {
    onContinue({
      ...tripData,
      priority: selectedPriority,
      customWeights:
        selected === "custom"
          ? customWeights
          : null,
    });
  }

  function getTripTypeLabel() {
    if (!tripData?.tripType) {
      return "TRIP";
    }

    if (tripData.tripType === "one-way") {
      return "ONE-WAY";
    }

    if (tripData.tripType === "round-trip") {
      return "ROUND TRIP";
    }

    return "TRIP + STAY";
  }

  return (
    <main className="priorities-page">

      {/* TOP BAR */}
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
          <small>TRIP PLANNER</small>
        </div>

        <div className="step-indicator">

          <span>01</span>

          <span>/</span>

          <span className="active">02</span>

          <span>/</span>

          <span>03</span>

        </div>

      </div>


      {/* CONTENT */}
      <section className="priorities-content">

        {/* HEADING */}
        <div className="priorities-heading">

          <div>

            <span className="section-label">
              02 / USER REQUIREMENTS
            </span>

            <h1>
              What matters
              <br />
              <em>most to you?</em>
            </h1>

          </div>

          <p>
            There is no universally “best” journey.
            WAYFINDER optimizes the trip around what
            matters to you.
          </p>

        </div>


        {/* TRIP CONTEXT */}
        <div className="priority-trip-context">

          <div className="priority-context-route">

            <Route size={15} />

            <span>
              {tripData?.from || "Starting point"}
            </span>

            <ArrowRight size={13} />

            <span>
              {tripData?.to || "Destination"}
            </span>

          </div>

          <div className="priority-context-meta">

            <span>
              <Users size={12} />
              {tripData?.travelers || 1}
              {" "}
              {tripData?.travelers === 1
                ? "TRAVELER"
                : "TRAVELERS"}
            </span>

            <span>
              {getTripTypeLabel()}
            </span>

          </div>

        </div>


        {/* REQUIREMENT HEADER */}
        <div className="priority-selection-header">

          <div>

            <span className="section-label">
              SELECT AN OBJECTIVE
            </span>

            <h2>
              Define what “best” means for you.
            </h2>

          </div>

          <div className="priority-live-indicator">
            <Sparkles size={12} />
            LIVE OPTIMIZATION
          </div>

        </div>


        {/* REQUIREMENTS */}
        <div className="requirements-grid">

          {priorities.map((priority) => (

            <button
              key={priority.id}
              type="button"
              className={`requirement-card ${
                selected === priority.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSelected(priority.id)
              }
            >

              <div className="requirement-top">

                <div className="requirement-icon">
                  {priority.icon}
                </div>

                <div className="requirement-radio">
                  <span></span>
                </div>

              </div>

              <div className="requirement-info">

                <h3>
                  {priority.title}
                </h3>

                <p>
                  {priority.description}
                </p>

                <small>
                  {priority.detail}
                </small>

              </div>

            </button>

          ))}

        </div>


        {/* CUSTOM WEIGHTS */}
        {selected === "custom" && (
          <div className="custom-weights-panel">

            <div className="custom-weights-header">

              <div>

                <span className="section-label">
                  CUSTOM REQUIREMENTS
                </span>

                <h3>
                  Define your own optimization weights.
                </h3>

              </div>

              <span className="custom-weight-total">
                {Object.values(customWeights).reduce(
                  (sum, value) =>
                    sum + Number(value),
                  0
                )}
                %
              </span>

            </div>


            <div className="custom-weight-grid">

              {[
                ["cost", "Cost"],
                ["time", "Travel time"],
                ["sustainability", "Sustainability"],
                ["comfort", "Comfort"],
                ["reliability", "Reliability"],
                ["accessibility", "Accessibility"],
              ].map(([key, label]) => (

                <div
                  className="custom-weight-item"
                  key={key}
                >

                  <div className="custom-weight-top">

                    <span>
                      {label}
                    </span>

                    <strong>
                      {customWeights[key]}%
                    </strong>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customWeights[key]}
                    onChange={(event) =>
                      updateCustomWeight(
                        key,
                        event.target.value
                      )
                    }
                  />

                </div>

              ))}

            </div>

          </div>
        )}


        {/* LIVE OPTIMIZATION PREVIEW */}
        <div className="priority-optimization-preview">

          <div className="optimization-preview-left">

            <div className="optimization-preview-icon">
              <Sparkles size={16} />
            </div>

            <div>

              <span className="section-label">
                WAYFINDER WILL OPTIMIZE FOR
              </span>

              <strong>
                {selectedPriority?.objective}
              </strong>

            </div>

          </div>

          <div className="optimization-preview-arrow">
            <ArrowRight size={16} />
          </div>

        </div>


        {/* SUMMARY */}
        <div className="priority-summary">

          <div>

            <span>
              YOUR PRIMARY REQUIREMENT
            </span>

            <strong>
              {selectedPriority?.title}
            </strong>

          </div>

          <div className="summary-arrow">
            <ArrowRight size={18} />
          </div>

        </div>


        {/* CONTINUE */}
        <button
          type="button"
          className="priority-continue"
          onClick={handleContinue}
        >

          Continue with{" "}

          <strong>
            {selectedPriority?.title}
          </strong>

          <ArrowRight size={18} />

        </button>

      </section>

    </main>
  );
}

export default Priorities;