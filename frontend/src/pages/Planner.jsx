import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  ArrowDownUp,
  Minus,
  Plus,
  Hotel,
  Wallet,
  ArrowLeftRight,
  Route,
  Sparkles,
  Moon,
} from "lucide-react";

function Planner({ onContinue }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [tripType, setTripType] = useState("one-way");
  const [travelers, setTravelers] = useState(2);

  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [nights, setNights] = useState(1);
  const [stayType, setStayType] = useState("budget");
  const [stayBudget, setStayBudget] = useState(1000);

  const [error, setError] = useState("");

  function swapLocations() {
    setFrom(to);
    setTo(from);
  }

  function changeTravelers(amount) {
    setTravelers((current) => {
      const next = current + amount;

      if (next < 1) return 1;
      if (next > 10) return 10;

      return next;
    });
  }

  function handleTripType(type) {
    setTripType(type);

    if (type === "one-way") {
      setReturnDate("");
      setNights(0);
      setStayType("budget");
      setStayBudget(1000);
    }

    if (type === "round-trip") {
      setNights(0);
      setStayType("budget");
      setStayBudget(1000);
    }

    if (type === "stay") {
      setNights(1);
    }
  }

  function handleContinue() {
    setError("");

    if (!from.trim()) {
      setError("Please enter your starting point.");
      return;
    }

    if (!to.trim()) {
      setError("Please enter your destination.");
      return;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setError("Starting point and destination cannot be the same.");
      return;
    }

    if (!departure) {
      setError("Please select a departure date.");
      return;
    }

    if (tripType !== "one-way" && !returnDate) {
      setError("Please select a return date.");
      return;
    }

    if (
      tripType !== "one-way" &&
      returnDate &&
      departure &&
      returnDate < departure
    ) {
      setError("Return date cannot be before departure.");
      return;
    }

    if (tripType === "stay" && nights < 1) {
      setError("Please select at least one night.");
      return;
    }

    if (tripType === "stay" && stayBudget < 300) {
      setError("Stay budget should be at least ₹300 per night.");
      return;
    }

    const tripData = {
      from: from.trim(),
      to: to.trim(),
      tripType,
      travelers,
      departure,
      returnDate,

      nights: tripType === "stay" ? nights : 0,

      stayType:
        tripType === "stay"
          ? stayType
          : null,

      stayBudget:
        tripType === "stay"
          ? stayBudget
          : 0,
    };

    console.log("WAYFINDER TRIP DATA:", tripData);

    onContinue(tripData);
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  function getTripTypeLabel() {
    if (tripType === "one-way") {
      return "ONE-WAY";
    }

    if (tripType === "round-trip") {
      return "ROUND TRIP";
    }

    return "TRIP + STAY";
  }

  function getTripFlow() {
    if (tripType === "one-way") {
      return "Travel to your destination";
    }

    if (tripType === "round-trip") {
      return "Travel there and return home";
    }

    return `Travel there · ${nights} night${
      nights !== 1 ? "s" : ""
    } · return home`;
  }

  function getTripTypeDescription() {
    if (tripType === "one-way") {
      return "Best when you only need to reach your destination.";
    }

    if (tripType === "round-trip") {
      return "We'll compare the complete journey there and back.";
    }

    return "We'll optimize transport, accommodation and your return journey together.";
  }

  function getTripDuration() {
    if (!departure || !returnDate || tripType === "one-way") {
      return null;
    }

    const start = new Date(`${departure}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);

    const difference = end - start;
    const days = Math.round(
      difference / (1000 * 60 * 60 * 24)
    ) + 1;

    if (days <= 0) {
      return null;
    }

    return {
      days,
      nights: days - 1,
    };
  }

  function getStayTotal() {
    if (tripType !== "stay" || !nights || !stayBudget) {
      return 0;
    }

    return nights * stayBudget;
  }

  function formatPreviewDate(date) {
    if (!date) {
      return "Not selected";
    }

    const value = new Date(`${date}T00:00:00`);

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="planner-page">

      {/* TOP BAR */}
      <div className="planner-topbar">

        <button
          className="back-button"
          onClick={() => window.location.reload()}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="planner-title">
          <span>WAYFINDER</span>
          <small>TRIP PLANNER</small>
        </div>

        <div className="step-indicator">
          <span className="active">01</span>
          <span>/</span>
          <span>03</span>
        </div>

      </div>

      {/* CONTENT */}
      <section className="planner-content">

        <div className="planner-heading">

          <span className="section-label">
            PLAN YOUR JOURNEY
          </span>

          <h1>
            Where are you
            <br />
            <em>going?</em>
          </h1>

          <p>
            Tell us about your journey. We'll figure out
            the best way to make it happen.
          </p>

        </div>

        {/* =========================================
            LIVE TRIP BRIEF
            ========================================= */}

        <div className="live-trip-brief">

          <div className="live-brief-header">

            <div>
              <span className="section-label">
                YOUR REQUIREMENT
              </span>

              <h2>
                Plan a trip that fits you.
              </h2>
            </div>

            <div className="live-brief-status">
              <Sparkles size={13} />
              LIVE
            </div>

          </div>

          <div className="live-route">

            <div className="live-location">

              <span className="live-location-marker">
                A
              </span>

              <div>
                <small>FROM</small>

                <strong>
                  {from.trim() || "Your starting point"}
                </strong>
              </div>

            </div>

            <div className="live-route-line">
              <span></span>
            </div>

            <div className="live-location">

              <span className="live-location-marker destination">
                B
              </span>

              <div>
                <small>TO</small>

                <strong>
                  {to.trim() || "Your destination"}
                </strong>
              </div>

            </div>

          </div>

          <div className="live-trip-meta">

            <div className="live-meta-item">

              <Route size={14} />

              <div>
                <small>TRIP</small>
                <strong>{getTripTypeLabel()}</strong>
              </div>

            </div>

            <div className="live-meta-item">

              <Users size={14} />

              <div>
                <small>TRAVELERS</small>

                <strong>
                  {travelers}
                </strong>
              </div>

            </div>

            <div className="live-meta-item">

              <CalendarDays size={14} />

              <div>
                <small>DEPARTURE</small>

                <strong>
                  {formatPreviewDate(departure)}
                </strong>
              </div>

            </div>

            {tripType !== "one-way" && (
              <div className="live-meta-item">

                <ArrowLeftRight size={14} />

                <div>
                  <small>RETURN</small>

                  <strong>
                    {formatPreviewDate(returnDate)}
                  </strong>
                </div>

              </div>
            )}

            {tripType === "stay" && (
              <div className="live-meta-item">

                <Moon size={14} />

                <div>
                  <small>STAY</small>

                  <strong>
                    {nights} night
                    {nights !== 1 ? "s" : ""}
                  </strong>
                </div>

              </div>
            )}

          </div>

          <div className="live-trip-flow">

            <div className="flow-dot"></div>

            <span>
              {getTripFlow()}
            </span>

            {getTripDuration() && (
              <div className="live-duration">

                <strong>
                  {getTripDuration().days} DAY
                  {getTripDuration().days !== 1 ? "S" : ""}
                </strong>

                <span>·</span>

                <strong>
                  {getTripDuration().nights} NIGHT
                  {getTripDuration().nights !== 1 ? "S" : ""}
                </strong>

              </div>
            )}

          </div>

        </div>

        {/* FORM */}
        <div className="trip-form">

          {/* FROM */}
          <div className="input-block">

            <label>FROM</label>

            <div className="location-input">

              <MapPin size={19} />

              <input
                type="text"
                placeholder="Starting point"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />

            </div>

          </div>

          {/* SWAP */}
          <div className="swap-line">

            <div></div>

            <button
              type="button"
              className="swap-button"
              onClick={swapLocations}
              title="Swap locations"
            >
              <ArrowDownUp size={17} />
            </button>

            <div></div>

          </div>

          {/* TO */}
          <div className="input-block">

            <label>TO</label>

            <div className="location-input">

              <MapPin size={19} />

              <input
                type="text"
                placeholder="Destination"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />

            </div>

          </div>

          {/* TRIP TYPE + TRAVELERS */}
          <div className="form-row">

            {/* TRIP TYPE */}
            <div className="input-block half">

              <label>TRIP TYPE</label>

              <div className="option-group">

                <button
                  type="button"
                  className={`option ${
                    tripType === "one-way"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleTripType("one-way")
                  }
                >
                  One way
                </button>

                <button
                  type="button"
                  className={`option ${
                    tripType === "round-trip"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleTripType("round-trip")
                  }
                >
                  Round trip
                </button>

                <button
                  type="button"
                  className={`option ${
                    tripType === "stay"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleTripType("stay")
                  }
                >
                  + Stay
                </button>

              </div>

              <div className="trip-type-description">

                <span className="trip-type-description-dot"></span>

                <span>
                  {getTripTypeDescription()}
                </span>

              </div>

            </div>

            {/* TRAVELERS */}
            <div className="input-block half">

              <label>TRAVELERS</label>

              <div className="traveler-control">

                <Users size={18} />

                <span>
                  {travelers}{" "}
                  {travelers === 1
                    ? "traveler"
                    : "travelers"}
                </span>

                <div className="traveler-buttons">

                  <button
                    type="button"
                    onClick={() =>
                      changeTravelers(-1)
                    }
                    disabled={travelers === 1}
                  >
                    <Minus size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeTravelers(1)
                    }
                    disabled={travelers === 10}
                  >
                    <Plus size={14} />
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* DATES */}
          <div className="form-row">

            {/* DEPARTURE */}
            <div className="input-block half">

              <label>DEPARTURE</label>

              <div className="location-input">

                <CalendarDays size={18} />

                <input
                  type="date"
                  value={departure}
                  min={today}
                  onChange={(e) =>
                    setDeparture(e.target.value)
                  }
                />

              </div>

            </div>

            {/* RETURN */}
            <div className="input-block half">

              <label>

                RETURN

                {tripType === "one-way" && (
                  <span className="optional-label">
                    OPTIONAL
                  </span>
                )}

              </label>

              <div
                className={`location-input ${
                  tripType === "one-way"
                    ? "disabled-input"
                    : ""
                }`}
              >

                <CalendarDays size={18} />

                <input
                  type="date"
                  value={returnDate}
                  min={departure || today}
                  disabled={tripType === "one-way"}
                  onChange={(e) =>
                    setReturnDate(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* STAY DETAILS */}
          {tripType === "stay" && (

            <div className="stay-options">

              <div className="stay-heading">

                <Hotel size={18} />

                <div>

                  <strong>
                    STAY DETAILS
                  </strong>

                  <span>
                    Help us optimize your complete trip
                  </span>

                </div>

              </div>

              {/* NIGHTS + ACCOMMODATION */}
              <div className="form-row">

                {/* NIGHTS */}
                <div className="input-block half">

                  <label>
                    NUMBER OF NIGHTS
                  </label>

                  <div className="traveler-control">

                    <CalendarDays size={18} />

                    <span>
                      {nights}{" "}
                      {nights === 1
                        ? "night"
                        : "nights"}
                    </span>

                    <div className="traveler-buttons">

                      <button
                        type="button"
                        onClick={() =>
                          setNights((n) =>
                            Math.max(1, n - 1)
                          )
                        }
                        disabled={nights === 1}
                      >
                        <Minus size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setNights((n) =>
                            Math.min(14, n + 1)
                          )
                        }
                        disabled={nights === 14}
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                  </div>

                </div>

                {/* ACCOMMODATION */}
                <div className="input-block half">

                  <label>
                    ACCOMMODATION
                  </label>

                  <div className="option-group">

                    <button
                      type="button"
                      className={`option ${
                        stayType === "budget"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setStayType("budget")
                      }
                    >
                      Budget
                    </button>

                    <button
                      type="button"
                      className={`option ${
                        stayType === "standard"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setStayType("standard")
                      }
                    >
                      Standard
                    </button>

                    <button
                      type="button"
                      className={`option ${
                        stayType === "premium"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setStayType("premium")
                      }
                    >
                      Premium
                    </button>

                  </div>

                </div>

              </div>

              {/* STAY BUDGET */}
              <div className="input-block">

                <label>
                  APPROXIMATE STAY BUDGET / NIGHT
                </label>

                <div className="location-input">

                  <Wallet size={18} />

                  <span>₹</span>

                  <input
                    type="number"
                    min="300"
                    max="20000"
                    value={stayBudget}
                    onChange={(e) =>
                      setStayBudget(
                        Number(e.target.value)
                      )
                    }
                  />

                  <span className="budget-suffix">
                    / night
                  </span>

                </div>

                {getStayTotal() > 0 && (
                  <div className="stay-budget-summary">

                    <div className="stay-budget-summary-label">
                      ESTIMATED STAY COST
                    </div>

                    <div className="stay-budget-summary-value">

                      <strong>
                        ₹{getStayTotal().toLocaleString("en-IN")}
                      </strong>

                      <span>
                        ₹{stayBudget.toLocaleString("en-IN")} × {nights} night
                        {nights !== 1 ? "s" : ""}
                      </span>

                    </div>

                  </div>
                )}

              </div>

            </div>

          )}

          {/* ERROR */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* CONTINUE */}
          <button
            type="button"
            className="continue-button"
            onClick={handleContinue}
          >
            Continue

            <ArrowRight size={18} />

          </button>

        </div>

      </section>

    </main>
  );
}

export default Planner;