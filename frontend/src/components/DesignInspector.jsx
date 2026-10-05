import {
  X,
  Check,
  Target,
  SlidersHorizontal,
  Trophy,
  ArrowDown,
} from "lucide-react";

import { getWeights } from "../utils/optimizer";

function DesignInspector({
  tripData,
  recommended,
  alternatives,
  onClose,
}) {
  const priority =
    tripData?.priority?.id || "cheapest";

  const priorityNames = {
    cheapest: "Cheapest",
    fastest: "Fastest",
    value: "Best Value",
    eco: "Eco-friendly",
    accessible: "Accessible",
    risk: "Least Risk",
    custom: "Custom",
  };

  const priorityName =
    priorityNames[priority] || "Cheapest";


  /*
  ============================================================
  OFFICIAL WAYFINDER WEIGHTS
  ============================================================

  The Design Inspector uses the EXACT same weights
  as the optimization engine.

  This prevents the explanation shown to the user
  from contradicting the actual recommendation.
  */

  const optimizerWeights =
    getWeights(priority);


  /*
  ============================================================
  DISPLAY WEIGHTS
  ============================================================

  Optimizer stores weights as decimals:

  0.35 = 35%

  Convert them into percentages for the Inspector UI.
  */

  const weights = {
    Cost:
      Math.round(
        optimizerWeights.cost * 100
      ),

    Time:
      Math.round(
        optimizerWeights.time * 100
      ),

    Comfort:
      Math.round(
        optimizerWeights.comfort * 100
      ),

    Sustainability:
      Math.round(
        optimizerWeights.sustainability * 100
      ),

    Reliability:
      Math.round(
        optimizerWeights.reliability * 100
      ),

    Accessibility:
      Math.round(
        optimizerWeights.accessibility * 100
      ),
  };


  return (
    <div className="inspector-overlay">

      <div className="inspector-panel">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="inspector-header">

          <div>

            <span className="inspector-eyebrow">
              WAYFINDER / DESIGN INSPECTOR
            </span>

            <h2>
              Why this
              <em> solution?</em>
            </h2>

          </div>


          <button
            className="inspector-close"
            onClick={onClose}
            aria-label="Close design inspector"
          >
            <X size={19} />
          </button>

        </div>


        {/* ==================================================
            01 / USER REQUIREMENT
        ================================================== */}

        <div className="inspector-section">

          <div className="inspector-section-title">

            <div className="inspector-number">
              01
            </div>

            <div>

              <span>
                USER REQUIREMENT
              </span>

              <h3>
                What matters to the user?
              </h3>

            </div>

          </div>


          <div className="inspector-requirement">

            <Target size={19} />

            <div>

              <strong>
                {priorityName}
              </strong>

              <p>
                WAYFINDER will prioritize this
                requirement when evaluating
                possible solutions.
              </p>

            </div>

          </div>

        </div>


        <ArrowDown
          className="inspector-down"
          size={17}
        />


        {/* ==================================================
            02 / EVALUATION CRITERIA
        ================================================== */}

        <div className="inspector-section">

          <div className="inspector-section-title">

            <div className="inspector-number">
              02
            </div>

            <div>

              <span>
                EVALUATION CRITERIA
              </span>

              <h3>
                How alternatives are judged
              </h3>

            </div>

          </div>


          <div className="criteria-list">

            {Object.entries(weights).map(
              ([name, weight]) => (

                <div
                  className="criteria-row"
                  key={name}
                >

                  <div className="criteria-name">

                    <span>
                      {name}
                    </span>

                    <strong>
                      {weight}%
                    </strong>

                  </div>


                  <div className="criteria-bar">

                    <div
                      style={{
                        width: `${weight}%`,
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>


          <div className="criteria-note">

            <SlidersHorizontal size={14} />

            <span>
              Weights are generated from your
              selected requirement and are used
              by the same optimization model that
              produced the recommendation.
            </span>

          </div>

        </div>


        <ArrowDown
          className="inspector-down"
          size={17}
        />


        {/* ==================================================
            03 / ALTERNATIVES
        ================================================== */}

        <div className="inspector-section">

          <div className="inspector-section-title">

            <div className="inspector-number">
              03
            </div>

            <div>

              <span>
                ALTERNATIVES
              </span>

              <h3>
                Possible solutions considered
              </h3>

            </div>

          </div>


          <div className="inspector-alternatives">

            {alternatives.map(
              (option, index) => (

                <div
                  key={option.id}
                  className={`inspector-option ${
                    option.id === recommended?.id
                      ? "winner"
                      : ""
                  }`}
                >

                  <div className="option-position">
                    0{index + 1}
                  </div>


                  <div className="option-main">

                    <strong>
                      {option.title}
                    </strong>

                    <span>
                      {option.type}
                    </span>

                  </div>


                  <div className="option-score">

                    <small>
                      SCORE
                    </small>

                    <strong>
                      {Math.round(
                        option.score || 0
                      )}
                    </strong>

                  </div>


                  {option.id ===
                    recommended?.id && (

                    <div className="winner-icon">
                      <Check size={15} />
                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </div>


        <ArrowDown
          className="inspector-down"
          size={17}
        />


        {/* ==================================================
            04 / OPTIMUM DESIGN
        ================================================== */}

        <div className="inspector-final">

          <div className="final-icon">
            <Trophy size={21} />
          </div>


          <div>

            <span>
              04 / OPTIMUM DESIGN
            </span>

            <h3>
              {recommended?.title}
            </h3>

            <p>
              Selected because it achieved the
              highest weighted score for the
              user's chosen requirement:

              <strong>
                {" "}
                {priorityName}
              </strong>.
            </p>

          </div>

        </div>


        {/* ==================================================
            ENGINEERING LOGIC
        ================================================== */}

        <div className="engineering-note">

          <SlidersHorizontal size={16} />

          <p>

            <strong>
              Engineering design logic:
            </strong>{" "}

            user requirements were converted into
            measurable criteria, alternatives were
            evaluated against those criteria, and
            the highest-scoring feasible alternative
            was selected.

          </p>

        </div>


      </div>

    </div>
  );
}

export default DesignInspector;