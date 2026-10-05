import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "WAYFINDER backend is running",
    });
});

/*
============================================================
WAYFINDER OPTIMIZATION ENGINE
============================================================
*/

function getWeights(priority) {
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

    return inverse ? 100 - normalized : normalized;
}

function clampScore(value) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return 0;
    }

    return Math.max(0, Math.min(100, numericValue));
}

/*
============================================================
OPTIMIZE
============================================================
*/

app.post("/api/optimize", (req, res) => {
    try {
        const {
            from,
            to,
            tripType,
            travelers,
            departure,
            returnDate,
            nights,
            stayType,
            stayBudget,
            priority,
            constraints = {},
        } = req.body;

        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message:
                    "Origin and destination are required.",
            });
        }

        const tripRequest = {
            from,
            to,
            tripType,
            travelers: travelers || 1,
            departure,
            returnDate,
            nights: nights || 0,
            stayType,
            stayBudget: stayBudget || 0,
            priority: priority || "cheapest",
        };

        /*
        --------------------------------------------------------
        AVAILABLE ALTERNATIVES
        --------------------------------------------------------
        */

        const alternatives = [
            {
                id: 1,
                title: "AC Bus",
                type: "Bus + Local",

                transportCost: 420,
                localCost: 120,
                stayMultiplier: 0.9,

                minutes: 85,
                emissions: 8.2,

                comfort: 78,
                reliability: 88,
                accessibility: 72,

                transfers: 1,

                tags: [
                    "Lowest transport cost",
                    "Direct",
                ],
            },

            {
                id: 2,
                title: "Intercity Train",
                type: "Train + Local",

                transportCost: 520,
                localCost: 100,
                stayMultiplier: 1,

                minutes: 65,
                emissions: 5.4,

                comfort: 82,
                reliability: 92,
                accessibility: 84,

                transfers: 1,

                tags: [
                    "Fast",
                    "Lower emissions",
                ],
            },

            {
                id: 3,
                title: "Private Cab",
                type: "Private Cab",

                transportCost: 950,
                localCost: 0,
                stayMultiplier: 1.6,

                minutes: 55,
                emissions: 14.8,

                comfort: 100,
                reliability: 95,
                accessibility: 96,

                transfers: 0,

                tags: [
                    "Fastest",
                    "Most comfortable",
                ],
            },
        ];

        /*
        --------------------------------------------------------
        COMPLETE TRIP CALCULATION
        --------------------------------------------------------
        */

        const journeyMultiplier =
            tripType === "one-way" ? 1 : 2;

        const evaluated = alternatives.map(
            (option) => {
                const transportBase =
                    option.transportCost *
                    journeyMultiplier;

                const transportTotal =
                    option.title === "Private Cab"
                        ? transportBase
                        : transportBase *
                        tripRequest.travelers;

                const localTotal =
                    tripType === "stay"
                        ? option.localCost *
                        Math.max(
                            tripRequest.nights,
                            1
                        )
                        : option.localCost;

                const accommodationTotal =
                    tripType === "stay"
                        ? tripRequest.stayBudget *
                        option.stayMultiplier *
                        tripRequest.nights
                        : 0;

                const totalCost =
                    transportTotal +
                    localTotal +
                    accommodationTotal;

                const totalMinutes =
                    option.minutes *
                    journeyMultiplier;

                const totalEmissions =
                    option.emissions *
                    journeyMultiplier;

                let constraintAdjustment = 0;

                if (Number(tripRequest.travelers) >= 4) {
                    constraintAdjustment +=
                        option.accessibility * 0.05;
                }

                if (tripType === "round-trip") {
                    constraintAdjustment +=
                        option.reliability * 0.03;
                }

                if (tripType === "stay") {
                    constraintAdjustment +=
                        option.comfort * 0.03;
                }

                return {
                    ...option,
                    transportTotal,
                    localTotal,
                    accommodationTotal,
                    totalCost,
                    totalMinutes,
                    totalEmissions,
                    constraintAdjustment,
                };
            }
        );

        /*
        --------------------------------------------------------
        NORMALIZATION
        --------------------------------------------------------
        */

        const costs = evaluated.map(
            (item) => item.totalCost
        );

        const times = evaluated.map(
            (item) => item.totalMinutes
        );

        const emissions = evaluated.map(
            (item) => item.totalEmissions
        );

        const weights = getWeights(
            tripRequest.priority
        );

        /*
        --------------------------------------------------------
        WEIGHTED SCORING
        --------------------------------------------------------
        */

        const scored = evaluated.map((option) => {
            const costScore = normalize(
                option.totalCost,
                costs,
                true
            );

            const timeScore = normalize(
                option.totalMinutes,
                times,
                true
            );

            const sustainabilityScore = normalize(
                option.totalEmissions,
                emissions,
                true
            );

            const comfortScore = clampScore(
                option.comfort
            );

            const reliabilityScore = clampScore(
                option.reliability
            );

            const accessibilityScore = clampScore(
                option.accessibility
            );

            const score =
                costScore * weights.cost +
                timeScore * weights.time +
                sustainabilityScore *
                weights.sustainability +
                comfortScore * weights.comfort +
                reliabilityScore *
                weights.reliability +
                accessibilityScore *
                weights.accessibility;

            return {
                ...option,

                score: Number(
                    Math.max(
                        0,
                        Math.min(100, score)
                    ).toFixed(2)
                ),

                factorScores: {
                    cost: Number(
                        costScore.toFixed(1)
                    ),

                    time: Number(
                        timeScore.toFixed(1)
                    ),

                    sustainability: Number(
                        sustainabilityScore.toFixed(1)
                    ),

                    comfort: Number(
                        comfortScore.toFixed(1)
                    ),

                    reliability: Number(
                        reliabilityScore.toFixed(1)
                    ),

                    accessibility: Number(
                        accessibilityScore.toFixed(1)
                    ),
                },

                weights,
            };
        });

        /*
        --------------------------------------------------------
        RANK
        --------------------------------------------------------
        */

        const ranked = scored
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .map(
                (option, index) => ({
                    ...option,
                    rank: index + 1,
                })
            );

        const recommendation =
            ranked[0];

        /*
        --------------------------------------------------------
        RESPONSE
        --------------------------------------------------------
        */

        res.json({
            success: true,

            request: tripRequest,

            recommendation,

            alternatives: ranked,

            optimization: {
                priority:
                    tripRequest.priority,

                weights,

                alternativesEvaluated:
                    ranked.length,
            },

            message:
                "WAYFINDER evaluated the available alternatives successfully.",
        });
    } catch (error) {
        console.error(
            "Optimization error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Something went wrong while optimizing the trip.",
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `WAYFINDER backend running on http://localhost:${PORT}`
    );
});