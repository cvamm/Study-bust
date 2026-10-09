import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import FilterPanel, { countActive, type Filters } from "@/components/FilterPanel";
import ResourceCard from "@/components/ResourceCard";
import { useApp } from "@/context/AppContext";
import { chapterById, subjectById } from "@/data/subjects";
import type { ResourceType } from "@/lib/types";
import { typeMeta } from "@/lib/utils";

const list = (v: string | null): string[] => (v ? v.split(",").filter(Boolean) : []);

export default function Resources() {
  const { resources } = useApp();
  const [params, setParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);

  const filters: Filters = {
    q: params.get("q") ?? "",
    subject: params.get("subject") ?? "",
    chapter: params.get("chapter") ?? "",
    types: list(params.get("types")),
    langs: list(params.get("langs")),
    diffs: list(params.get("diffs")),
    goals: list(params.get("goals")),
    sort: params.get("sort") ?? "recommended",
  };

  const apply = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    if (patch.subject !== undefined && patch.subject !== filters.subject && patch.chapter === undefined) {
      next.chapter = "";
    }
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    if (next.subject) p.set("subject", next.subject);
    if (next.chapter) p.set("chapter", next.chapter);
    if (next.types.length) p.set("types", next.types.join(","));
    if (next.langs.length) p.set("langs", next.langs.join(","));
    if (next.diffs.length) p.set("diffs", next.diffs.join(","));
    if (next.goals.length) p.set("goals", next.goals.join(","));
    if (next.sort !== "recommended") p.set("sort", next.sort);
    setParams(p, { replace: true });
  };

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const results = useMemo(() => {
    const query = filters.q.trim().toLowerCase();
    const filtered = resources.filter((r) => {
      if (filters.subject && r.subjectId !== filters.subject) return false;
      if (filters.chapter) {
        const matchesExactChapter = r.chapterId === filters.chapter;
        const isSubjectWideMatch =
          r.chapterId === null &&
          (!filters.types.length || filters.types.includes(r.type));
        if (!matchesExactChapter && !isSubjectWideMatch) return false;
      }
      if (filters.types.length && !filters.types.includes(r.type)) return false;
      if (filters.langs.length && !filters.langs.includes(r.language)) return false;
      if (filters.diffs.length && !filters.diffs.includes(r.difficulty)) return false;
      if (filters.goals.length && !filters.goals.includes(r.goal)) return false;
      if (query) {
        const subject = subjectById(r.subjectId);
        const chapter = subject ? chapterById(subject, r.chapterId) : undefined;
        const haystack = [r.title, r.source, r.description, subject?.name ?? "", chapter?.name ?? "", r.language]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (filters.sort) {
      case "newest":
        sorted.sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt));
        break;
      case "duration":
        sorted.sort((a, b) => (a.duration ?? Infinity) - (b.duration ?? Infinity));
        break;
      case "popular":
        sorted.sort((a, b) => b.views - a.views);
        break;
      default:
        sorted.sort((a, b) => Number(b.recommended) - Number(a.recommended) || b.views - a.views);
    }
    return sorted;
  }, [resources, filters.q, filters.subject, filters.chapter, filters.types, filters.langs, filters.diffs, filters.goals, filters.sort]);

  const active = countActive(filters);
  const subject = subjectById(filters.subject);
  const chapter = subject ? chapterById(subject, filters.chapter) : undefined;

  function ActiveChips({
    subjectName,
    chapterName,
  }: {
    subjectName?: string;
    chapterName?: string;
  }) {
    const chips: Array<{ label: string; onRemove: () => void }> = [];
    if (filters.q) chips.push({ label: `“${filters.q}”`, onRemove: () => apply({ q: "" }) });
    if (filters.subject)
      chips.push({ label: subjectName ?? filters.subject, onRemove: () => apply({ subject: "", chapter: "" }) });
    if (filters.chapter)
      chips.push({ label: chapterName ?? filters.chapter, onRemove: () => apply({ chapter: "" }) });
    filters.types.forEach((t) =>
      chips.push({
        label: typeMeta(t as ResourceType).short,
        onRemove: () => apply({ types: filters.types.filter((x) => x !== t) }),
      }),
    );
    filters.langs.forEach((l) =>
      chips.push({ label: l, onRemove: () => apply({ langs: filters.langs.filter((x) => x !== l) }) }),
    );
    filters.diffs.forEach((d) =>
      chips.push({ label: d, onRemove: () => apply({ diffs: filters.diffs.filter((x) => x !== d) }) }),
    );
    filters.goals.forEach((g) =>
      chips.push({ label: g, onRemove: () => apply({ goals: filters.goals.filter((x) => x !== g) }) }),
    );
    if (filters.sort !== "recommended")
      chips.push({ label: `Sort: ${filters.sort}`, onRemove: () => apply({ sort: "recommended" }) });

    if (chips.length === 0) return null;

    return (
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {chips.map((c, i) => (
          <span
            key={`${c.label}-${i}`}
            className="inline-flex animate-fade-up items-center gap-1 rounded-full bg-navy-900 py-1 pl-3 pr-1 text-xs font-bold text-white shadow-sm"
          >
            {c.label}
            <button
              type="button"
              aria-label={`Remove filter ${c.label}`}
              onClick={c.onRemove}
              className="focus-ring rounded-full p-0.5 transition-colors hover:bg-navy-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={clearAll}
          className="focus-ring rounded-md px-2 py-1 text-xs font-bold text-navy-400 underline-offset-2 transition-colors hover:text-rose-600 hover:underline"
        >
          Clear all
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-inkline bg-white">
        <div className="container-x flex flex-wrap items-end justify-between gap-4 py-10 lg:py-12">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-600">Resource directory</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              {subject ? subject.name : "Every resource"}
              {chapter ? ` — ${chapter.name}` : ""}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">
              <span className="font-extrabold text-navy-800">{results.length}</span> of {resources.length} resources
              {active > 0 ? ` · ${active} filter${active > 1 ? "s" : ""} active` : ""}. Sample data — links are placeholders until curation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileFilters((v) => !v)}
            className="btn-ghost lg:hidden"
            aria-expanded={mobileFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {active > 0 ? `(${active})` : ""}
          </button>
        </div>
      </section>

      <section className="container-x grid grid-cols-1 gap-8 py-10 lg:grid-cols-[290px_1fr]">
        {/* sidebar */}
        <aside className={mobileFilters ? "block" : "hidden lg:block"}>
          <div className="rounded-xl border border-inkline bg-white p-5 shadow-card lg:sticky lg:top-24">
            <FilterPanel filters={filters} onChange={apply} onClear={clearAll} />
          </div>
        </aside>

        {/* results */}
        <div>
          <ActiveChips subjectName={subject?.name} chapterName={chapter?.name} />
          {results.length === 0 ? (
            <EmptyState
              title="Nothing in the nest for that combination"
              body="Try removing a filter or two, or search for something broader — resources are tagged by subject, chapter, type, language and difficulty."
              action={
                <button type="button" onClick={clearAll} className="btn-navy">
                  Clear all filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {results.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
