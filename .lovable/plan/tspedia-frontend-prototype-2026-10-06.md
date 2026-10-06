# TSPedia frontend prototype

## Goal
Build a polished, mobile-first student information companion for Télécom SudParis using only local mock data and client-side interactions.

## What I’ll build
- A clear home experience with the TSPedia identity, prominent question field, suggested questions, topic discovery, and help contacts.
- A focused answer experience that shows the retrieved guidance, a clear next step, and its source.
- Search and topic browsing with lightweight filters and information detail views.
- A professional “My TSP Journey” checklist and a simple two-campus overview.
- Desktop navigation and a persistent mobile bottom navigation, with accessible focus states and keyboard-friendly controls.

## Content and behavior
- Add approximately 25 realistic local knowledge records across accommodation, visa, financial aid, campus, student life, internships, healthcare, banking, administration, and transportation.
- Isolate keyword retrieval in a small service so it can later be replaced with a real API.
- Keep saved items and journey checks in the current browser session only; no accounts or persistent backend.
- Use clearly labeled mock contact details rather than inventing official university information.

## Visual direction
- Calm, premium university technology aesthetic: mostly white and light grey, restrained deep TSP blue, crisp typography, thin borders, minimal shadows, and compact cards.
- No gradients, glass effects, decorative illustrations, or dashboard-like density.
- Responsive layouts with no horizontal scrolling and a strong mobile reading experience.

## Technical details
- Keep the existing TanStack Start structure and build the prototype as a single focused route with client-side view switching.
- Add reusable interface components, semantic design tokens, local JSON data, and the retrieval service.
- Add route-specific social metadata and update the README with local setup and future API replacement guidance.
- Validate the main flow end-to-end at desktop and mobile sizes.

## Out of scope
No backend, authentication, database, RAG, AWS, external APIs, analytics, profiles, payments, or admin tools.
