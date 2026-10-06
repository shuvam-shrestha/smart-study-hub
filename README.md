# TSPedia

TSPedia is a frontend prototype for a student information and guidance platform at Télécom SudParis. It helps students ask practical questions, find relevant guidance, see a recommended next step, and understand the source.

This phase intentionally uses no backend, authentication, database, external API, or AI service.

## Run locally

Requires Node.js 20.12 or newer (the Vite 8 toolchain uses `node:util` APIs added in 20.12).

```bash
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

If `npm i` fails while resolving peer dependencies, retry with `npm i --legacy-peer-deps`.

## Mock knowledge

The prototype's "chatbot" has no real AI. When a student asks a question, `src/services/retrieval.ts` runs a simple keyword-based search over the local records and returns the single best match, which the UI renders as the answer.

The app reads its records from `src/data/knowledge.json` (137 records), imported in `src/services/retrieval.ts`. That file is **generated** from the source dataset in `data/all_knowledge.jsonl` by mapping each record into the `KnowledgeRecord` shape defined in `src/types/knowledge.ts` (`document_id` → `id`, `next_action` → `nextStep`, and `details` derived from the next action, audience, campus, source, and verification date). To change the knowledge base, edit `data/all_knowledge.jsonl` and regenerate `src/data/knowledge.json`.

The records span 12 categories: accommodation, financial aid and budget, visa and international arrival, campus and student services, student life and clubs, internships and career, healthcare and wellbeing, banking and payments, administration and registration, transportation and navigation, student journey, and general university information.

To connect a future RAG API, replace the implementation of `askTSPedia` while keeping its response shape aligned with `KnowledgeRecord`.

## Technology

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Lucide icons
