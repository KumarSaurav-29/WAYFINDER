import { useState } from "react";
import Planner from "./pages/Planner";
import Priorities from "./pages/Priorities";
import Results from "./pages/Results";

function App() {

  const [page, setPage] = useState("planner");

  const [tripData, setTripData] = useState(null);


  function handlePlannerContinue(data) {

    setTripData(data);

    setPage("priorities");

  }


  function handlePriorityContinue(data) {

    setTripData(data);

    setPage("results");

  }


  if (page === "priorities") {

    return (
      <Priorities
        tripData={tripData}
        onBack={() => setPage("planner")}
        onContinue={handlePriorityContinue}
      />
    );

  }


  if (page === "results") {

    return (
      <Results
        tripData={tripData}
        onBack={() => setPage("priorities")}
      />
    );

  }


  return (
    <Planner
      onContinue={handlePlannerContinue}
    />
  );

}

export default App;