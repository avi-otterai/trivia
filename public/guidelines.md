Guidelines for Creating items.json Files

1) 🧩 Unique & Distinct Values

- Every item must have a **unique numeric value** — no duplicates.
- Ensure each item's value is meaningfully different to support clear higher/lower comparisons.
- If using wide ranges (e.g., $1 → $1B), consider logarithmic spacing to maintain good distribution.

⸻

2) Core Design Principles
	1.	Recognition > Precision
Prefer things the average player recognizes instantly by name or image.
	•	✅ Tesla Model 3, PlayStation 5, Big Mac Meal
	•	❌ AGM-129 Cruise Missile, obscure laptop SKUs
	2.	Specific, but Understandable
Be specific enough to be clear, but not so technical it scares people off.
	•	✅ “Rolex Submariner Watch” (iconic and clear)
	•	✅ “Entry-Level Private Jet (Cessna Citation)” (everyday wording + parenthetical model)
	•	❌ “Cessna Citation CJ3+” (too insider)
	3.	Short Labels that Fit on a Card
Aim for ≤ 4 words before any helpful parenthetical. Title Case preferred.
	•	✅ “Porsche 911 Turbo”
	•	✅ “30-Foot Motor Yacht”
	•	❌ “Mid-Range Premium Gaming Laptop with OLED”
	4.	Balanced Value Spacing
Ensure unique numeric values and distribute them across the full range so choices feel meaningful:
	•	Use roughly logarithmic spacing for large ranges (e.g., $5 → $1B).
	•	Avoid clustering (e.g., ten items between $900–$1,100).
	5.	Current & Culturally Relevant
Use present-day or enduring icons. Update tech models annually.
	•	✅ iPhone 16 Pro (when current)
	•	❌ iPhone 12 (outdated unless dimension is “year released”)
	6.	Avoid Location/Context Volatility
Skip items whose values swing widely by location/time/options. If included, fix the spec:
	•	✅ “Starbucks Coffee (Tall Latte)”
	•	❌ “Dinner for Two” (too variable)
	7.	Fun Over Exactness
Round values to friendly numbers players can reason about (e.g., $40K, $250K).
Close enough is good enough, as long as relative ordering is believable.

⸻

3) Value Distribution Heuristic (Price Dimension)

Target ~25–30 items spanning $5 → $1B with unique values:
	•	Everyday ($5–$50): coffee, meals, simple accessories
	•	Consumer Tech ($100–$2,000): headphones, tablets, consoles, phones, laptops
	•	Vehicles & Luxury ($30K–$800K): sedans, EVs, sports cars, boats, watches
	•	Aviation & Exotic ($500K–$5M): helicopters, private jets
	•	Hero Anchors ($50M–$1B): rocket launches, megaprojects/landmarks

Keep 3–5 items per tier to avoid bunching.

⸻

4) Labeling Patterns that Work

Use one of these styles for mass-market clarity:
	•	Brand + Model: “Tesla Model 3”, “PlayStation 5”
	•	Category + Size/Type: “30-Foot Motor Yacht”, “Entry-Level Private Jet”
	•	Iconic Name + Type: “Rolex Submariner Watch”, “Porsche 911 Turbo”

When a proper model is recognizable but maybe niche, use a parenthetical helper:
	•	“Entry-Level Private Jet (Cessna Citation)”
	•	“Iconic Dive Watch (Rolex Submariner)”

This keeps the main text approachable while remaining accurate.

⸻

5) Do/Don’t Examples (Based on Your Items)

Do (clear & popular)
	•	Starbucks Coffee (Tall Latte)
	•	Big Mac Meal
	•	Apple AirPods Pro
	•	Nintendo Switch
	•	iPhone 15 Pro (or current year model)
	•	MacBook Pro 14-inch (current chip)
	•	Toyota Camry
	•	Tesla Model 3
	•	Ford Mustang GT
	•	Porsche 911 Turbo
	•	30-Foot Motor Yacht
	•	Iconic Dive Watch (Rolex Submariner)
	•	Popular Private Helicopter (Robinson R44)
	•	Entry-Level Private Jet (Cessna Citation)
	•	SpaceX Falcon 9 Launch
	•	Taj Mahal Construction (Adjusted)

Don’t (why)
	•	“Luxury Swiss Watch” → too generic; use “Iconic Dive Watch (Rolex Submariner)”
	•	“Cessna Citation CJ3+” → too insider; use “Entry-Level Private Jet (Cessna Citation)”
	•	“Most Popular Entry-Level Private Jet” → vague; specify “Entry-Level Private Jet (Cessna Citation)”
	•	“B-2 Bomber Missile AGM-129” → obscure/technical; replace with iconic civilian/space item
	•	“Budget Laptop” → generic; use “Premium Windows Laptop” or a known model
	•	“Taj Mahal Construction Cost 2020” → clarify “(Adjusted)” and keep label short

⸻

6) Maintenance Checklist (Before Shipping a File)
	•	All value fields are unique
	•	Values are rounded and credible today
	•	Labels are ≤ 4 words (before optional parentheses)
	•	Each label is popularly recognizable by name or image
	•	Distribution spans whole range (no large clusters)
	•	No outdated tech without context; update models yearly
	•	NDJSON format is valid; ends with newline
    