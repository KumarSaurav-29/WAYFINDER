# WAYFINDER

## A Human-Centered Mobility Decision System

WAYFINDER is a multi-criteria travel decision system designed to help users identify a suitable journey based on their individual requirements, priorities, and constraints.

Instead of assuming that one travel option is universally best, WAYFINDER evaluates multiple alternatives using criteria such as cost, travel time, sustainability, comfort, reliability, and accessibility.

The system converts user preferences into measurable engineering criteria and uses weighted optimization to rank available alternatives.

---

## Project Overview

Travel planning often requires users to compare multiple factors across different transportation options.

A cheaper option may take longer, while a faster option may cost more. Another option may provide better comfort, accessibility, reliability, or environmental performance.

WAYFINDER approaches this problem as an **Engineering Design and Decision-Making Problem**.

The system follows the design flow:

**User Need → User Requirement → Constraints → Alternatives → Evaluation → Optimization → Optimum Design**

The final recommendation is therefore based on the user's selected requirements rather than a fixed definition of the "best" journey.

---

## Key Features

### Multi-Criteria Travel Optimization

WAYFINDER evaluates travel alternatives using:

- Cost
- Travel Time
- Sustainability
- Comfort
- Reliability
- Accessibility

### Multiple Travel Priorities

Users can select:

- Cheapest
- Fastest
- Best Value
- Eco-friendly
- Accessible
- Least Risk
- Custom

### Custom Weighting

Users can define their own importance for different criteria.

Example:

| Criterion | Weight |
|---|---:|
| Cost | 30% |
| Travel Time | 20% |
| Sustainability | 15% |
| Comfort | 20% |
| Reliability | 10% |
| Accessibility | 5% |

The weights are converted into optimization parameters and influence the final ranking.

---

## Trip Planning

The Planner allows users to configure:

- Origin
- Destination
- Trip type
- Number of travelers
- Departure date
- Return date
- Number of stay nights
- Stay type
- Stay budget

Supported trip types:

- One-way
- Round-trip
- Trip + Stay

---

## Optimization Methodology

WAYFINDER follows a structured optimization process.

```text
Travel Alternatives
        ↓
Calculate Metrics
        ↓
Normalize Scores
        ↓
Apply User-Selected Weights
        ↓
Calculate Overall Score
        ↓
Rank Alternatives
        ↓
Select Optimum Solution
```

Different criteria are normalized so that values such as cost, time, and estimated emissions can be compared using a common scoring model.

The weighted criteria are then combined to calculate an overall score for each alternative.

The highest-scoring feasible alternative is presented as the recommended solution.

---

## Engineering Design Approach

WAYFINDER applies concepts from Engineering Design and Modelling.

### Human-Centered Design

The system begins by understanding the user's needs, preferences, and constraints.

### Design Thinking

The project follows a simplified Design Thinking approach:

```text
Empathize
   ↓
Define
   ↓
Ideate
   ↓
Prototype
   ↓
Evaluate
```

### User Journey Mapping

The user's interaction follows:

```text
Plan
 ↓
Configure
 ↓
Prioritize
 ↓
Evaluate
 ↓
Decide
 ↓
Review
```

### Design Constraints

The optimization considers constraints such as:

- Number of travelers
- Trip type
- Departure date
- Return date
- Stay duration
- Stay budget

### Optimum Design

The optimum journey is selected based on:

**User Requirement → Evaluation Criteria → Constraints → Alternative Scores → Weighted Overall Score → Ranking**

---

## Sustainable Design

Sustainability is included as one of the engineering evaluation criteria.

WAYFINDER uses estimated environmental impact to compare alternatives.

When the user selects **Eco-friendly**, sustainability becomes the primary design criterion.

The system can therefore demonstrate how environmental impact can be incorporated into an engineering decision-making process.

---

## Design Inspector

The **Design Inspector** is a key feature of WAYFINDER.

Instead of showing only the final recommendation, it explains the reasoning behind the decision.

It exposes:

- User requirement
- Selected priority
- Evaluation criteria
- Design constraints
- Alternative solutions
- Factor scores
- Weighted evaluation
- Final ranking
- Optimum design

This makes the optimization process more transparent and explainable.

---

## System Architecture

```text
┌─────────────────────────┐
│       USER INPUT        │
│ Route • Trip • Priority │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│     REACT FRONTEND      │
│ Planner • Priorities    │
│ Results • Inspector     │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│     REST API / SERVER   │
│      Node + Express     │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│   OPTIMIZATION ENGINE   │
│ Normalize • Weight      │
│ Evaluate • Rank         │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│   OPTIMIZED SOLUTION    │
│ Recommendation + Reason │
└─────────────────────────┘
```

---

## Technical Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS
- Lucide React

### Backend

- Node.js
- Express.js
- REST API
- CORS

### Optimization

- JavaScript-based optimization engine
- Score normalization
- Weighted decision model
- Alternative ranking
- Constraint-aware evaluation

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

---

## Project Structure

```text
WAYFINDER/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── DesignInspector.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Planner.jsx
│   │   │   ├── Priorities.jsx
│   │   │   └── Results.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── optimizer.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Example Travel Alternatives

The current prototype demonstrates optimization using alternatives such as:

### AC Bus + Local

- Lower transport cost
- Direct journey
- Moderate comfort
- Moderate estimated emissions

### Intercity Train + Local

- Faster than the bus
- Lower estimated emissions
- Higher reliability
- Good accessibility

### Private Cab

- Fastest journey
- Direct travel
- Highest comfort
- Higher cost
- Higher estimated emissions

These alternatives are used to demonstrate the decision-making and optimization process.

---

## Current Limitations

The current version is a prototype and has several limitations:

- Uses predefined/estimated travel data
- Does not use live transportation prices
- Limited number of travel alternatives
- No real-time traffic information
- No live hotel availability
- No live surge pricing
- Environmental values are prototype estimates

The current implementation is intended to demonstrate the **engineering design and optimization framework**.

---

## Future Scope

WAYFINDER can be extended with:

- Real-time transportation APIs
- Hotel and accommodation APIs
- Live traffic information
- Real-time pricing
- Real-time availability
- More transportation alternatives
- Advanced accessibility parameters
- Multimodal journey planning
- Personalized user profiles
- Machine-learning-based travel prediction
- Mobile application
- Dynamic optimization

### Future Vision

**Prototype Decision System → Real-Time Mobility Intelligence Platform**

---

## Academic Relevance

WAYFINDER demonstrates several Engineering Design and Modelling concepts:

- Human-Centered Design
- Design Thinking
- User Requirements
- User Journey Mapping
- Engineering Design Process
- Design Constraints
- Alternative Generation
- Multi-Criteria Evaluation
- Optimum Design
- Sustainable Design
- Eco Design
- Design Communication
- Prototyping

---

## References

### Course / Syllabus

**Engineering Design & Modelling — MEE2014**

VIT Bhopal University — Course syllabus and faculty-provided learning material.

### External References

**ISO 9241-210:2019 — Human-Centred Design for Interactive Systems**

https://www.iso.org/standard/77520.html

**IDEO — Design Thinking**

https://designthinking.ideo.com/

**React — Official Documentation**

https://react.dev/

**Node.js — Official Documentation**

https://nodejs.org/docs/latest/api/

**Express.js — Official Documentation**

https://expressjs.com/

**Lucide — Open Source Icon Library**

https://lucide.dev/

**United Nations — Sustainable Development Goals**

https://sdgs.un.org/goals

---

## Project Objective

The objective of WAYFINDER is not to identify one universally "best" journey.

It is to identify the journey that **best satisfies the user's requirements, priorities, and constraints**.

> **"The best journey is the one that best fits YOU."**

---

## Author

**Kumar Saurav**

