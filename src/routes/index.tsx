import { createFileRoute } from "@tanstack/react-router";
import { TSPediaApp } from "@/components/tspedia";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TSPedia — Your guide to Télécom SudParis" },
      { name: "description", content: "Find clear student guidance, practical next steps, and trusted sources for life at Télécom SudParis." },
      { property: "og:title", content: "TSPedia — Your guide to Télécom SudParis" },
      { property: "og:description", content: "Find clear student guidance, practical next steps, and trusted sources for life at Télécom SudParis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <TSPediaApp />;
}
