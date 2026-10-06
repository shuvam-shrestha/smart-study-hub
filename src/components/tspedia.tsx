import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  MapPin,
  MessageCircleQuestion,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Train,
  Users,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askTSPedia, knowledgeRecords, searchKnowledge } from "@/services/retrieval";
import type { KnowledgeRecord } from "@/types/knowledge";

type View = "home" | "ask" | "explore" | "journey" | "search" | "saved" | "campus" | "detail";

const categoryDetails = [
  ["Accommodation", "Housing, applications and useful resources.", Building2],
  ["Financial Aid", "Scholarships, support and budgeting guidance.", Banknote],
  ["Visa & Immigration", "Visa, arrival and residence permit steps.", Plane],
  ["Campus", "Locations, facilities and student services.", Landmark],
  ["Student Life", "Associations, events and community support.", Users],
  ["Internships & Careers", "Career preparation, CVs and agreements.", BriefcaseBusiness],
  ["Healthcare", "Healthcare access and wellbeing support.", HeartPulse],
  ["Banking", "Accounts, bank details and practical guidance.", Banknote],
  ["Administration", "Registration, documents and university steps.", ShieldCheck],
  ["Transportation", "Campus routes and student travel options.", Train],
] as const;

const suggestions = [
  "How do I apply for accommodation?",
  "What should I prepare before arriving?",
  "Where can I find financial aid?",
  "How can I prepare for my internship?",
];

const journeyStages = [
  ["Before arrival", ["Check visa requirements", "Arrange accommodation", "Prepare documents", "Confirm arrival"]],
  ["Arrival", ["Validate travel documents", "Move into accommodation", "Learn your campus route"]],
  ["First week", ["Complete registration", "Discover campus", "Set up banking", "Attend Welcome Week"]],
  ["First month", ["Review healthcare steps", "Build a monthly budget", "Meet student services"]],
  ["Student life", ["Join an association", "Explore campus activities", "Find wellbeing support"]],
  ["Internship", ["Confirm requirements", "Update your CV", "Start your search"]],
  ["Graduation", ["Complete final requirements", "Prepare your next career step"]],
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">TS</span>
      <span><span className="block text-lg font-bold leading-none text-foreground">TSPedia</span><span className="mt-1 block text-[11px] text-muted-foreground">Télécom SudParis</span></span>
    </div>
  );
}

function SearchForm({ onAsk, compact = false, initial = "" }: { onAsk: (q: string) => void; compact?: boolean; initial?: string }) {
  const [value, setValue] = useState(initial);
  const submit = (event: FormEvent) => { event.preventDefault(); if (value.trim()) onAsk(value.trim()); };
  return (
    <form onSubmit={submit} className={cn("flex w-full items-center border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring", compact ? "rounded-md p-1.5" : "rounded-lg p-2")}>
      <Search aria-hidden="true" className="ml-2 size-5 shrink-0 text-muted-foreground" />
      <label htmlFor={compact ? "search-field" : "ask-field"} className="sr-only">Ask TSPedia</label>
      <input id={compact ? "search-field" : "ask-field"} value={value} onChange={(event) => setValue(event.target.value)} placeholder={compact ? "Search TSPedia" : "Ask TSPedia anything..."} className={cn("min-w-0 flex-1 bg-transparent px-3 text-foreground outline-none placeholder:text-muted-foreground", compact ? "h-10 text-sm" : "h-12 text-base")} />
      <Button type="submit" size={compact ? "default" : "lg"} aria-label="Submit question"><span className="hidden sm:inline">Ask TSPedia</span><ArrowRight /></Button>
    </form>
  );
}

function Header({ view, go }: { view: View; go: (view: View) => void }) {
  const items: [View, string][] = [["home", "Home"], ["ask", "Ask TSPedia"], ["explore", "Explore"], ["journey", "My Journey"]];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <button onClick={() => go("home")} className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Brand /></button>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {items.map(([id, label]) => <Button key={id} variant="ghost" onClick={() => go(id)} className={cn(view === id && "bg-accent text-primary")}>{label}</Button>)}
          <Button variant="ghost" size="icon" onClick={() => go("search")} aria-label="Search"><Search /></Button>
          <Button variant="ghost" size="icon" onClick={() => go("saved")} aria-label="Saved items"><Bookmark /></Button>
        </nav>
      </div>
    </header>
  );
}

function MobileNav({ view, go }: { view: View; go: (view: View) => void }) {
  const items = [["home", "Home", Home], ["ask", "Ask", MessageCircleQuestion], ["explore", "Explore", Compass], ["journey", "Journey", GraduationCap]] as const;
  return <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">{items.map(([id, label, Icon]) => <button key={id} onClick={() => go(id)} className={cn("flex h-17 cursor-pointer flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground", view === id && "text-primary")}><Icon className="size-5" />{label}</button>)}</nav>;
}

function HomeView({ ask, go, openCategory }: { ask: (q: string) => void; go: (view: View) => void; openCategory: (category: string) => void }) {
  return <>
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-20">
        <div>
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> Your student guide</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-normal text-foreground sm:text-5xl lg:text-6xl">Everything you need for student life at Télécom SudParis.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Find information, discover the right service, and know your next step.</p>
          <div className="mt-9 max-w-2xl"><SearchForm onAsk={ask} /></div>
          <div className="mt-5 flex max-w-2xl flex-wrap gap-2">{suggestions.map((q) => <button key={q} onClick={() => ask(q)} className="cursor-pointer rounded-full border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{q}</button>)}</div>
        </div>
        <div className="hidden border-l border-border pl-12 lg:block">
          <p className="text-sm font-semibold text-muted-foreground">A clear path forward</p>
          <ol className="mt-7 space-y-7">{[["01", "Ask a question", "Use your own words."], ["02", "Get relevant guidance", "See the key information first."], ["03", "Take the next step", "Know exactly what to do."], ["04", "Check the source", "Understand where it comes from."]].map(([n, title, copy]) => <li key={n} className="flex gap-5"><span className="font-mono text-xs font-semibold text-primary">{n}</span><span><strong className="block text-sm text-foreground">{title}</strong><span className="mt-1 block text-sm text-muted-foreground">{copy}</span></span></li>)}</ol>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="flex items-end justify-between gap-6"><div><p className="text-sm font-semibold text-primary">Browse by topic</p><h2 className="mt-2 text-3xl font-bold text-foreground">Explore TSPedia</h2></div><Button variant="ghost" onClick={() => go("explore")} className="hidden sm:flex">View all <ArrowRight /></Button></div>
      <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">{categoryDetails.map(([name, copy, Icon]) => <button key={name} onClick={() => openCategory(name)} className="group min-h-44 cursor-pointer bg-background p-5 text-left transition-colors hover:bg-accent focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Icon className="size-5 text-primary" /><h3 className="mt-8 font-semibold text-foreground">{name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p><ChevronRight className="mt-4 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></button>)}</div>
    </section>
    <section className="border-y border-border bg-surface"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 md:flex-row md:items-center lg:px-8"><div><p className="text-sm font-semibold text-primary">Need help?</p><h2 className="mt-2 text-2xl font-bold text-foreground">Not sure where to start?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Ask TSPedia to identify the right topic or service. Contact details shown in this prototype are intentionally not official.</p></div><Button onClick={() => ask("I feel lost after arriving. Who can help?")}>Find the right support <ArrowRight /></Button></div></section>
  </>;
}

function AnswerView({ question, record, askAnother, open }: { question: string; record: KnowledgeRecord; askAnother: () => void; open: (record: KnowledgeRecord) => void }) {
  return <main className="mx-auto max-w-4xl px-5 py-10 pb-28 lg:px-8 lg:py-14">
    <Button variant="ghost" onClick={askAnother} className="-ml-3 mb-8"><ArrowLeft /> Ask another question</Button>
    <div className="ml-auto max-w-2xl rounded-lg bg-secondary px-5 py-4 text-sm leading-6 text-secondary-foreground"><p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">You asked</p>{question}</div>
    <article className="mt-8 border-l-2 border-primary pl-5 sm:pl-7">
      <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">TS</span><div><p className="font-semibold text-foreground">TSPedia</p><p className="text-xs text-muted-foreground">Student guidance</p></div></div>
      <h1 className="mt-7 text-2xl font-bold text-foreground sm:text-3xl">{record.title}</h1><p className="mt-4 text-base leading-8 text-muted-foreground">{record.answer}</p>
      {record.bullets && <ol className="mt-6 space-y-3">{record.bullets.map((item, index) => <li key={item} className="flex gap-3 text-sm text-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">{index + 1}</span><span className="pt-0.5">{item}</span></li>)}</ol>}
    </article>
    <section className="mt-10 rounded-lg border border-action-border bg-action p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase text-primary"><ArrowRight className="size-4" /> Next step</p><p className="mt-3 text-lg font-semibold text-foreground">{record.nextStep}</p><Button onClick={() => open(record)} className="mt-5">View guidance <ArrowRight /></Button></section>
    <section className="mt-8 border-t border-border pt-7"><p className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><ShieldCheck className="size-4" /> Source</p><button onClick={() => open(record)} className="mt-3 flex cursor-pointer items-center gap-2 text-left text-sm font-medium text-primary hover:underline">{record.source}<ExternalLink className="size-3.5" /></button><p className="mt-2 text-xs text-muted-foreground">Prototype content — verify details with current university guidance.</p></section>
  </main>;
}

function ExploreView({ open }: { open: (record: KnowledgeRecord) => void }) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All");
  const results = useMemo(() => searchKnowledge(query, category), [query, category]);
  const filters = ["All", "Accommodation", "Visa & Immigration", "Financial Aid", "Campus", "Student Life", "Internships & Careers", "Healthcare"];
  return <main className="mx-auto max-w-7xl px-5 py-12 pb-28 lg:px-8"><p className="text-sm font-semibold text-primary">Knowledge library</p><h1 className="mt-2 text-4xl font-bold text-foreground">Explore student guidance</h1><p className="mt-3 max-w-2xl text-muted-foreground">Browse practical information by topic, or search in your own words.</p><div className="mt-8 max-w-2xl"><label htmlFor="explore-search" className="sr-only">Search guidance</label><div className="flex h-12 items-center rounded-md border border-border bg-background px-4 focus-within:ring-2 focus-within:ring-ring"><Search className="size-5 text-muted-foreground" /><input id="explore-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search TSPedia" className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /></div></div><div className="mt-5 flex gap-2 overflow-x-auto pb-2">{filters.map((item) => <Button key={item} size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>{item}</Button>)}</div><div className="mt-9 divide-y divide-border border-y border-border">{results.map((record) => <button key={record.id} onClick={() => open(record)} className="group flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div><span className="text-xs font-semibold uppercase text-primary">{record.category}</span><h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary">{record.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{record.answer}</p></div><ChevronRight className="mt-7 size-5 shrink-0 text-muted-foreground group-hover:text-primary" /></button>)}</div>{results.length === 0 && <p className="py-16 text-center text-muted-foreground">No matching guidance found. Try a broader search.</p>}</main>;
}

function DetailView({ record, back, ask }: { record: KnowledgeRecord; back: () => void; ask: (q: string) => void }) {
  return <main className="mx-auto max-w-4xl px-5 py-10 pb-28 lg:px-8"><Button variant="ghost" onClick={back} className="-ml-3"><ArrowLeft /> Back to explore</Button><p className="mt-9 text-sm font-bold uppercase text-primary">{record.category}</p><h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">{record.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{record.answer}</p><div className="mt-10 divide-y divide-border border-y border-border">{record.details.map((detail) => <section key={detail.label} className="grid gap-3 py-7 sm:grid-cols-[180px_1fr]"><h2 className="font-semibold text-foreground">{detail.label}</h2><p className="text-sm leading-7 text-muted-foreground">{detail.content}</p></section>)}</div><section className="mt-10 flex flex-col justify-between gap-5 rounded-lg bg-primary p-7 text-primary-foreground sm:flex-row sm:items-center"><div><p className="text-sm font-semibold">Still have a question?</p><p className="mt-1 text-sm text-primary-foreground/75">Ask about {record.title.toLowerCase()}.</p></div><Button variant="secondary" onClick={() => ask(record.question)}>Ask TSPedia <ArrowRight /></Button></section><section className="mt-8"><p className="text-xs font-bold uppercase text-muted-foreground">Source</p><p className="mt-2 text-sm text-foreground">{record.source}</p></section></main>;
}

function JourneyView() {
  const [checked, setChecked] = useState<string[]>([]); const [active, setActive] = useState(0);
  const toggle = (item: string) => setChecked((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  return <main className="mx-auto max-w-6xl px-5 py-12 pb-28 lg:px-8"><p className="text-sm font-semibold text-primary">Your roadmap</p><h1 className="mt-2 text-4xl font-bold text-foreground">My TSP Journey</h1><p className="mt-3 text-muted-foreground">A simple roadmap from preparing your arrival to building your career.</p><div className="mt-10 flex gap-2 overflow-x-auto border-b border-border pb-4">{journeyStages.map(([stage], index) => <Button key={stage} variant={active === index ? "default" : "ghost"} size="sm" onClick={() => setActive(index)}>{stage}</Button>)}</div><div className="mt-10 grid gap-10 md:grid-cols-[240px_1fr]"><ol className="hidden border-l border-border pl-6 md:block">{journeyStages.map(([stage], index) => <li key={stage} className={cn("relative pb-8 text-sm font-medium text-muted-foreground before:absolute before:-left-[29px] before:top-1 before:size-2 before:rounded-full before:bg-border", active === index && "text-primary before:bg-primary")}><button onClick={() => setActive(index)} className="cursor-pointer">{stage}</button></li>)}</ol><section><p className="text-xs font-bold uppercase text-primary">Stage {active + 1} of {journeyStages.length}</p><h2 className="mt-3 text-3xl font-bold text-foreground">{journeyStages[active][0]}</h2><div className="mt-7 divide-y divide-border border-y border-border">{journeyStages[active][1].map((item) => <label key={item} className="flex cursor-pointer items-center gap-4 py-5 text-sm font-medium text-foreground"><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} className="sr-only" /><span className={cn("grid size-6 place-items-center rounded border border-input", checked.includes(item) && "border-primary bg-primary text-primary-foreground")}>{checked.includes(item) && <Check className="size-4" />}</span><span className={cn(checked.includes(item) && "text-muted-foreground line-through")}>{item}</span></label>)}</div></section></div></main>;
}

function CampusView() {
  const [campus, setCampus] = useState("Évry-Courcouronnes");
  return <main className="mx-auto max-w-6xl px-5 py-12 pb-28 lg:px-8"><p className="text-sm font-semibold text-primary">Campus guide</p><h1 className="mt-2 text-4xl font-bold text-foreground">Find your way around</h1><div className="mt-8 inline-flex rounded-md bg-secondary p-1">{["Évry-Courcouronnes", "Palaiseau"].map((name) => <Button key={name} size="sm" variant={campus === name ? "default" : "ghost"} onClick={() => setCampus(name)}>{name}</Button>)}</div><div className="mt-10 grid gap-10 md:grid-cols-2"><div><h2 className="text-2xl font-bold text-foreground">{campus}</h2><p className="mt-4 leading-7 text-muted-foreground">Explore teaching spaces, student facilities, services, and practical transport information for this location.</p><div className="mt-8 divide-y divide-border border-y border-border">{[[Building2, "Facilities", "Teaching spaces, study areas and everyday campus facilities."], [CircleHelp, "Student services", "Guidance for academic, administrative and wellbeing needs."], [Train, "Transportation", "Plan your regular route and keep a backup option."], [MapPin, "Location", "Confirm the correct building before travelling."]].map(([Icon, title, copy]) => { const ItemIcon = Icon as typeof Building2; return <div key={String(title)} className="flex gap-4 py-5"><ItemIcon className="mt-0.5 size-5 text-primary" /><div><h3 className="text-sm font-semibold text-foreground">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{String(copy)}</p></div></div>; })}</div></div><div className="grid min-h-80 place-items-center overflow-hidden rounded-lg border border-border bg-map"><div className="text-center"><span className="mx-auto grid size-14 place-items-center rounded-full border border-primary bg-background text-primary"><MapPin /></span><p className="mt-4 text-sm font-semibold text-foreground">{campus}</p><p className="mt-1 text-xs text-muted-foreground">Map preview · prototype</p></div></div></div></main>;
}

export function TSPediaApp() {
  const [view, setView] = useState<View>("home"); const [question, setQuestion] = useState(""); const [record, setRecord] = useState<KnowledgeRecord>(knowledgeRecords[0]); const [saved] = useState<KnowledgeRecord[]>([]);
  const go = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const ask = (value: string) => { setQuestion(value); setRecord(askTSPedia(value)); go("ask"); };
  const open = (item: KnowledgeRecord) => { setRecord(item); go("detail"); };
  const openCategory = (category: string) => { const item = knowledgeRecords.find((entry) => entry.category === category); if (item) open(item); };
  return <div className="min-h-screen bg-background text-foreground"><Header view={view} go={go} />{view === "home" && <HomeView ask={ask} go={go} openCategory={openCategory} />}{view === "ask" && (question ? <AnswerView question={question} record={record} askAnother={() => { setQuestion(""); go("ask"); }} open={open} /> : <main className="mx-auto max-w-3xl px-5 py-20 pb-28 text-center"><p className="text-sm font-semibold text-primary">Ask TSPedia</p><h1 className="mt-3 text-4xl font-bold text-foreground">How can we help?</h1><p className="mt-3 text-muted-foreground">Ask about arriving, studying, or student life.</p><div className="mt-8"><SearchForm onAsk={ask} /></div></main>)}{(view === "explore" || view === "search") && <ExploreView open={open} />}{view === "detail" && <DetailView record={record} back={() => go("explore")} ask={ask} />}{view === "journey" && <JourneyView />}{view === "campus" && <CampusView />}{view === "saved" && <main className="mx-auto max-w-3xl px-5 py-20 pb-28 text-center"><Bookmark className="mx-auto size-8 text-primary" /><h1 className="mt-5 text-3xl font-bold">Saved guidance</h1><p className="mt-3 text-muted-foreground">{saved.length ? `${saved.length} saved items` : "You have no saved guidance yet."}</p><Button className="mt-7" onClick={() => go("explore")}>Explore topics</Button></main>}<footer className="hidden border-t border-border md:block"><div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8 text-xs text-muted-foreground"><span>TSPedia · Frontend prototype</span><button onClick={() => go("campus")} className="cursor-pointer hover:text-primary">Campus guide</button></div></footer><MobileNav view={view} go={go} /></div>;
}