import knowledge from "@/data/knowledge.json";
import type { KnowledgeRecord } from "@/types/knowledge";

export const knowledgeRecords = knowledge as KnowledgeRecord[];

const normalize = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

export function searchKnowledge(query: string, category = "All") {
  const terms = normalize(query);
  return knowledgeRecords
    .filter((record) => category === "All" || record.category === category)
    .map((record) => {
      const searchable = normalize(
        [record.title, record.question, record.category, ...record.keywords].join(" "),
      );
      const score = terms.reduce(
        (total, term) => total + searchable.reduce((hits, word) => hits + (word.includes(term) || term.includes(word) ? 1 : 0), 0),
        0,
      );
      return { record, score };
    })
    .filter(({ score }) => query.trim().length === 0 || score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ record }) => record);
}

export function askTSPedia(question: string): KnowledgeRecord {
  const result = searchKnowledge(question)[0] ?? knowledgeRecords[0];
  if (!result) {
    throw new Error("TSPedia knowledge data is empty.");
  }
  return result;
}
