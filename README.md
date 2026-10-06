# TSPedia

TSPedia is a frontend prototype for a student information and guidance platform at Télécom SudParis. It helps students ask practical questions, find relevant guidance, see a recommended next step, and understand the source.

This phase intentionally uses no backend, authentication, database, external API, or AI service.

## Run locally

```bash
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Mock knowledge

The local knowledge records live in `src/data/knowledge.json`. They cover accommodation, financial aid, visa and immigration, campus, student life, internships and careers, healthcare, banking, administration, and transportation.

`src/services/retrieval.ts` contains the simple keyword-based search used by the prototype. To connect a future RAG API, replace the implementation of `askTSPedia` while keeping its response shape aligned with `KnowledgeRecord` in `src/types/knowledge.ts`.

## Technology

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Lucide icons
