# WAYFINDER

## A Human-Centered Mobility Decision System

WAYFINDER is a multi-criteria travel decision system designed to help users identify a suitable journey based on their individual requirements, priorities, and constraints.

Instead of assuming that one travel option is universally best, WAYFINDER evaluates multiple alternatives using criteria such as cost, travel time, sustainability, comfort, reliability, and accessibility.

The system converts user preferences into measurable engineering criteria and uses weighted optimization to rank available alternatives.

## Project Overview

Travel planning often requires users to compare multiple factors across different transportation options.

A cheaper option may take longer, while a faster option may cost more. Another option may provide better comfort, accessibility, reliability, or environmental performance.

WAYFINDER approaches this problem as an **Engineering Design and Decision-Making Problem**.

The system follows the design flow:

**User Need → User Requirement → Constraints → Alternatives → Evaluation → Optimization → Optimum Design**

The final recommendation is therefore based on the user's selected requirements rather than a fixed definition of the "best" journey.

### WAYFINDER Interface

The main WAYFINDER interface provides a clean starting point for configuring a journey and understanding the decision-making process.

<p align="center">
  <img src="./screenshots/wayfinder-home%201.png" alt="WAYFINDER Home Interface 1" width="900">
</p>

The interface keeps the planning process structured while presenting the core travel decision clearly to the user.

<p align="center">
  <img src="./screenshots/wayfinder-home%202.png" alt="WAYFINDER Home Interface 2" width="900">
</p>

The overall visual design focuses on clarity, hierarchy, and a simple user journey from planning to decision-making.

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

The priority selection stage allows the user to define what matters most for the journey.

<p align="center">
  <img src="./screenshots/priority-selection%201.png" alt="WAYFINDER Priority Selection 1" width="900">
</p>

Users can select criteria such as cost, speed, sustainability, accessibility, or reliability according to their requirements.

<p align="center">
  <img src="./screenshots/priority-selection%202.png" alt="WAYFINDER Priority Selection 2" width="900">
</p>

The custom option allows users to assign their own weights to the different engineering criteria, making the optimization model adaptable to different user requirements.

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

## Optimization Results

The Results page presents the evaluated travel alternatives along with their scores, costs, journey details, and ranking.

<p align="center">
  <img src="./screenshots/optimization-results%201.png" alt="WAYFINDER Optimization Results 1" width="900">
</p>

The system compares multiple alternatives and identifies the option that best satisfies the selected priority.

<p align="center">
  <img src="./screenshots/optimization-results%202.png" alt="WAYFINDER Optimization Results 2" width="900">
</p>

Each alternative can be compared using measurable factors such as total cost, travel time, sustainability, comfort, reliability, and accessibility.

<p align="center">
  <img src="./screenshots/optimization-results%203.png" alt="WAYFINDER Optimization Results 3" width="900">
</p>

The results section makes the trade-offs between different travel alternatives visible instead of presenting only a single unexplained recommendation.

<p align="center">
  <img src="./screenshots/optimization-results%204.png" alt="WAYFINDER Optimization Results 4" width="900">
</p>

The final recommendation is generated from the weighted evaluation model and the constraints provided by the user.

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

## Sustainable Design

Sustainability is included as one of the engineering evaluation criteria.

WAYFINDER uses estimated environmental impact to compare alternatives.

When the user selects **Eco-friendly**, sustainability becomes the primary design criterion.

The system can therefore demonstrate how environmental impact can be incorporated into an engineering decision-making process.

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

<p align="center">
  <img src="./screenshots/design-inspect%201.png" alt="WAYFINDER Design Inspector 1" width="900">
</p>

The Design Inspector provides a transparent view of the engineering decision process and shows how the selected requirements and criteria influence the recommendation.

<p align="center">
  <img src="./screenshots/design-inspect%202.png" alt="WAYFINDER Design Inspector 2" width="900">
</p>

This makes the optimization process more explainable by connecting the final recommendation to the underlying engineering criteria, constraints, and evaluation.

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
├── screenshots/
│   ├── design-inspect 1.png
│   ├── design-inspect 2.png
│   ├── optimization-results 1.png
│   ├── optimization-results 2.png
│   ├── optimization-results 3.png
│   ├── optimization-results 4.png
│   ├── priority-selection 1.png
│   ├── priority-selection 2.png
│   ├── wayfinder-home 1.png
│   └── wayfinder-home 2.png
│
├── .gitignore
└── README.md
```

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

## Project Objective

The objective of WAYFINDER is not to identify one universally "best" journey.

It is to identify the journey that **best satisfies the user's requirements, priorities, and constraints**.

> **"The best journey is the one that best fits YOU."**

## Author

**Kumar Saurav**