import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  ExternalLink,
  FileArchive,
  FileCheck2,
  Layers,
  Library,
  Loader2,
  NotebookPen,
  Search,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import AnimatedBar from "@/components/AnimatedBar";
import Crumbs from "@/components/Crumbs";
import EmptyState from "@/components/EmptyState";
import ErrorBoundary from "@/components/ErrorBoundary";
import Reveal from "@/components/Reveal";
import ResourceCard from "@/components/ResourceCard";
import SubjectPyqArchiveSection from "@/components/SubjectPyqArchiveSection";
import { useApp } from "@/context/AppContext";
import { hasPyqData, subjectById } from "@/data/subjects";
import { getOfficialPyqArchive } from "@/data/officialPyqPapers";
import { getSubjectNotesCatalog } from "@/data/subjectNotes";
import type { ResourceType } from "@/lib/types";
import { cn, fmtDuration, RESOURCE_TYPES, subjectIcon, TONES } from "@/lib/utils";

/* ── Lazy-loaded Notes & PYQ sections (code-split) ── */
const SubjectNotesSection = lazy(() => import("@/components/SubjectNotesSection"));
const PhysicsPyqSection = lazy(() => import("@/components/PhysicsPyqSection"));
const ChemistryPyqSection = lazy(() => import("@/components/ChemistryPyqSection"));
const BiologyPyqSection = lazy(() => import("@/components/BiologyPyqSection"));
const MathPyqSection = lazy(() => import("@/components/MathPyqSection"));
const CsPyqSection = lazy(() => import("@/components/CsPyqSection"));
const BstPyqSection = lazy(() => import("@/components/BstPyqSection"));
const AccPyqSection = lazy(() => import("@/components/AccPyqSection"));
const GeographyPyqSection = lazy(() => import("@/components/GeographyPyqSection"));
const PolPyqSection = lazy(() => import("@/components/PolPyqSection"));
const IpPyqSection = lazy(() => import("@/components/IpPyqSection"));
const EcoPyqSection = lazy(() => import("@/components/EcoPyqSection"));
const HistoryPyqSection = lazy(() => import("@/components/HistoryPyqSection"));
const SociologyPyqSection = lazy(() => import("@/components/SociologyPyqSection"));
const PsychologyPyqSection = lazy(() => import("@/components/PsychologyPyqSection"));
const EnglishPyqSection = lazy(() => import("@/components/EnglishPyqSection"));

function PyqLoadingFallback() {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-inkline bg-navy-50/50 p-12">
      <Loader2 className="h-5 w-5 animate-spin text-navy-400" />
      <p className="text-sm font-bold text-navy-500">Loading PYQ bank…</p>
    </div>
  );
}

/* ================================ SUBJECT ================================ */

export function SubjectPage() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const { resources, completed, isChapterDone, toggleChapter } = useApp();
  const subject = subjectById(subjectId);

  const [lectureSearch, setLectureSearch] = useState("");
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>("all");
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>("all");
  const [selectedEducatorFilter, setSelectedEducatorFilter] = useState<string>("all");

  useEffect(() => {
    const sec = searchParams.get("section");
    if (sec) {
      const scroll = () => {
        const el = document.getElementById(sec);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (!scroll()) {
        const timer1 = setTimeout(() => {
          if (!scroll()) {
            const timer2 = setTimeout(scroll, 500);
            return () => clearTimeout(timer2);
          }
        }, 250);
        return () => clearTimeout(timer1);
      }
    }
  }, [searchParams]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const subjectResources = useMemo(
    () => resources.filter((r) => r.subjectId === subjectId),
    [resources, subjectId],
  );

  const topLevel = subjectResources.filter((r) => !r.chapterId);

  const chapterCounts = useMemo(() => {
    const map = new Map<string, number>();
    subjectResources.forEach((r) => {
      if (r.chapterId) map.set(r.chapterId, (map.get(r.chapterId) ?? 0) + 1);
    });
    return map;
  }, [subjectResources]);

  const typesPresent = useMemo(
    () => RESOURCE_TYPES.filter((t) => subjectResources.some((r) => r.type === t.id)),
    [subjectResources],
  );

  const lectureTypes: ResourceType[] = ["one-shot", "detailed-lectures", "yt-lectures", "revision"];
  const allLectures = useMemo(
    () => subjectResources.filter((r) => lectureTypes.includes(r.type)),
    [subjectResources],
  );

  const totalLectureMin = useMemo(
    () => allLectures.reduce((acc, r) => acc + (r.duration ?? 0), 0),
    [allLectures],
  );

  const coveredChaptersCount = useMemo(() => {
    const coveredIds = new Set(allLectures.map((l) => l.chapterId).filter(Boolean));
    return coveredIds.size;
  }, [allLectures]);

  const availableEducators = useMemo(() => {
    const set = new Set<string>();
    allLectures.forEach((l) => set.add(l.source));
    return Array.from(set).sort();
  }, [allLectures]);

  const filteredLectures = useMemo(() => {
    const q = lectureSearch.trim().toLowerCase();
    return allLectures.filter((r) => {
      if (selectedChapterFilter !== "all" && r.chapterId !== selectedChapterFilter) return false;
      if (selectedFormatFilter !== "all" && r.type !== selectedFormatFilter) return false;
      if (selectedEducatorFilter !== "all" && r.source !== selectedEducatorFilter) return false;
      if (q) {
        const ch = subject?.chapters.find((c) => c.id === r.chapterId);
        const text = [r.title, r.source, r.description, ch?.name ?? ""].join(" ").toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [allLectures, selectedChapterFilter, selectedFormatFilter, selectedEducatorFilter, lectureSearch, subject?.chapters]);

  const isFiltered =
    lectureSearch.trim() !== "" ||
    selectedChapterFilter !== "all" ||
    selectedFormatFilter !== "all" ||
    selectedEducatorFilter !== "all";

  const clearLectureFilters = () => {
    setLectureSearch("");
    setSelectedChapterFilter("all");
    setSelectedFormatFilter("all");
    setSelectedEducatorFilter("all");
  };

  if (!subject) return <Navigate to="/subjects" replace />;

  const Icon = subjectIcon(subject.icon);
  const tone = TONES[subject.tone];
  const doneCount = subject.chapters.filter((c) => completed.includes(`${subject.id}/${c.id}`)).length;
  const pct = Math.round((doneCount / subject.chapters.length) * 100);
  const totalMin = subjectResources.reduce((acc, r) => acc + (r.duration ?? 0), 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-inkline bg-white">
        <Icon className="pointer-events-none absolute -right-10 -top-12 h-72 w-72 text-navy-900/[0.05]" aria-hidden="true" />
        <div className="container-x relative py-10 lg:py-14">
          <Crumbs items={[{ label: "Subjects", to: "/subjects" }, { label: subject.name }]} />
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-5">
              <span className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border", tone.chip)}>
                <Icon className="h-8 w-8" />
              </span>
              <div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">{subject.name}</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-500 sm:text-base">{subject.tagline}</p>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wide">
                <span className="text-navy-400">Chapters completed</span>
                <span className={pct === 100 ? "text-green-600" : "text-navy-800"}>{pct}%</span>
              </div>
              <AnimatedBar
                className="mt-2 h-2"
                pct={Math.max(pct, doneCount > 0 ? 4 : 0)}
                barClass={pct === 100 ? "bg-green-500" : tone.bar}
              />
              <p className="mt-1.5 text-[11px] font-bold text-navy-400">
                {doneCount} of {subject.chapters.length} chapters · {subjectResources.length} resources · {fmtDuration(totalMin)} video
              </p>
            </div>
          </div>

          {typesPresent.length > 0 ? (
            <div className="mt-7 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">Available:</span>
              {typesPresent.map((t) => {
                const tt = TONES[t.tone];
                return (
                  <Link
                    key={t.id}
                    to={`/resources?subject=${subject.id}&types=${t.id}`}
                    className={cn("focus-ring inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-bold transition-transform hover:-translate-y-0.5", tt.chip)}
                  >
                    <t.icon className="h-3 w-3" />
                    {t.short}
                  </Link>
                );
              })}
              <Link to={`/resources?subject=${subject.id}`} className="focus-ring ml-1 inline-flex items-center gap-1 rounded-md border border-inkline bg-white px-2 py-1 text-[11px] font-bold text-navy-600 transition-colors hover:border-navy-300">
                All {subject.short} resources
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : null}

          {/* Quick Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-inkline pt-6">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-navy-400">Jump to section:</span>
            <button
              type="button"
              onClick={() => scrollToSection("chapters")}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-inkline bg-white px-3 py-1.5 text-xs font-bold text-navy-700 shadow-sm transition-all hover:border-navy-300 hover:text-navy-950 active:scale-[.98]"
            >
              <Library className="h-3.5 w-3.5 text-navy-400" />
              Syllabus Chapters ({subject.chapters.length})
            </button>
            {allLectures.length > 0 ? (
              <button
                type="button"
                onClick={() => scrollToSection("lectures")}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-gold-300 bg-gradient-to-r from-gold-50 to-gold-100/80 px-3.5 py-1.5 text-xs font-extrabold text-gold-900 shadow-sm transition-all hover:border-gold-400 hover:from-gold-100 hover:to-gold-200 active:scale-[.98]"
              >
                <Video className="h-3.5 w-3.5 text-gold-600" />
                Video Lectures Hub
                <span className="rounded-full bg-gold-200 px-1.5 py-0.2 text-[10px] font-extrabold text-gold-800">
                  {coveredChaptersCount}/{subject.chapters.length} Chapters
                </span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => scrollToSection("notes")}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-100/80 px-3.5 py-1.5 text-xs font-extrabold text-emerald-950 shadow-sm transition-all hover:border-emerald-400 hover:from-emerald-100 hover:to-teal-200 active:scale-[.98]"
            >
              <NotebookPen className="h-3.5 w-3.5 text-emerald-700" />
              Chapterwise Revision Notes ({subject.chapters.length} Chapters)
              <span className="rounded-full bg-emerald-200 px-1.5 py-0.2 text-[10px] font-extrabold text-emerald-800">
                {subject.id === "phy" || subject.id === "chem" || subject.id === "bio" ? "ToppersCBSE" : "CBSE / NCERT"}
              </span>
            </button>
            {hasPyqData(subject.id) ? (
              <button
                type="button"
                onClick={() => scrollToSection("pyqs")}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-100/80 px-3.5 py-1.5 text-xs font-extrabold text-indigo-950 shadow-sm transition-all hover:border-indigo-400 hover:from-indigo-100 hover:to-blue-200 active:scale-[.98]"
              >
                <FileCheck2 className="h-3.5 w-3.5 text-indigo-700" />
                Chapterwise Board PYQs (50 Qs / Ch)
                <span className="rounded-full bg-indigo-200 px-1.5 py-0.2 text-[10px] font-extrabold text-indigo-800">
                  {subject.chapters.length * 50} Qs
                </span>
              </button>
            ) : null}
            {getOfficialPyqArchive(subject.id) ? (
              <button
                type="button"
                onClick={() => scrollToSection("past-papers")}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-gradient-to-r from-amber-50 to-gold-100/80 px-3.5 py-1.5 text-xs font-extrabold text-amber-950 shadow-sm transition-all hover:border-amber-400 hover:from-amber-100 hover:to-gold-200 active:scale-[.98]"
              >
                <FileArchive className="h-3.5 w-3.5 text-amber-700" />
                Official Board Papers (2015–2026)
                <span className="rounded-full bg-amber-200 px-1.5 py-0.2 text-[10px] font-extrabold text-amber-900">
                  {getOfficialPyqArchive(subject.id)?.totalBundles} Bundles
                </span>
              </button>
            ) : null}
            {topLevel.length > 0 ? (
              <button
                type="button"
                onClick={() => scrollToSection("full-subject")}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-inkline bg-white px-3 py-1.5 text-xs font-bold text-navy-700 shadow-sm transition-all hover:border-navy-300 hover:text-navy-950 active:scale-[.98]"
              >
                <Layers className="h-3.5 w-3.5 text-navy-400" />
                Full-Subject Material ({topLevel.length})
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ============================== CHAPTERS ============================== */}
      <section id="chapters" className="container-x py-12">
        <Reveal>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">Chapters</h2>
            <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-extrabold text-navy-700">{subject.chapters.length}</span>
          </div>
          <p className="mt-1 text-sm text-navy-500">Open a chapter for its resources, or tick it off as you go.</p>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {subject.chapters.map((ch, i) => {
            const done = isChapterDone(subject.id, ch.id);
            const count = chapterCounts.get(ch.id) ?? 0;
            return (
              <Reveal key={ch.id} delay={(i % 2) * 60}>
                <div
                  className={cn(
                    "card-hover group relative flex items-center gap-4 rounded-xl border bg-white p-4 pr-3 shadow-card",
                    done ? "border-green-200 bg-green-50/40" : "border-inkline",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-extrabold",
                      done ? "bg-green-100 text-green-700" : cn("border", tone.chip),
                    )}
                  >
                    {done ? <Check className="h-5 w-5" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <Link to={`/subjects/${subject.id}/${ch.id}`} className="focus-ring absolute inset-0 rounded-xl" aria-label={`Open chapter ${i + 1}: ${ch.name}`}>
                    <span className="sr-only">Open chapter</span>
                  </Link>
                  <div className="min-w-0 flex-1 pointer-events-none">
                    <p className={cn("truncate font-display text-sm font-bold", done ? "text-green-900" : "text-navy-900")}>
                      {ch.name}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-navy-400">
                      <span className="inline-flex items-center gap-1">
                        <Library className="h-3 w-3" />
                        {count} {count === 1 ? "resource" : "resources"}
                      </span>
                      {hasPyqData(subject.id) ? (
                        <span className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.2 text-[10px] font-extrabold text-indigo-800">
                          50 Board PYQs
                        </span>
                      ) : null}
                      {done ? <span className="text-green-600">Completed</span> : null}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={done ? `Mark "${ch.name}" as not completed` : `Mark "${ch.name}" as completed`}
                    onClick={() => toggleChapter(subject.id, ch.id, ch.name)}
                    className={cn(
                      "focus-ring relative z-10 rounded-lg p-2 transition-all",
                      done ? "text-green-600 hover:bg-green-100" : "text-navy-300 hover:bg-navy-50 hover:text-navy-700",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-5.5 w-5.5 fill-green-100" /> : <Circle className="h-5.5 w-5.5" />}
                  </button>
                  <ChevronRight className="pointer-events-none relative z-10 h-4 w-4 shrink-0 text-navy-300 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===================== VIDEO LECTURES HUB ===================== */}
      {allLectures.length > 0 ? (
        <section id="lectures" className="border-t border-inkline bg-gradient-to-b from-navy-50/60 via-white to-navy-50/40 py-14 lg:py-20">
          <div className="container-x">
            <Reveal>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300 bg-gold-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold-800">
                      <Sparkles className="h-3.5 w-3.5 text-gold-600" />
                      CBSE Class 12 Syllabus (2025–26)
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      {coveredChaptersCount} of {subject.chapters.length} Chapters Covered (100%)
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                    {subject.name} Video Lectures Hub
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600 sm:text-base">
                    Every chapter in the CBSE Class 12 {subject.name} syllabus covered with full-chapter One-Shots,
                    detailed conceptual playlists, and board derivation masterclasses from top educators.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-inkline bg-white px-4 py-2.5 shadow-card">
                    <p className="font-display text-xl font-extrabold text-navy-900">{allLectures.length}</p>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wide text-navy-400">Total Lectures</p>
                  </div>
                  <div className="rounded-xl border border-inkline bg-white px-4 py-2.5 shadow-card">
                    <p className="font-display text-xl font-extrabold text-navy-900">{fmtDuration(totalLectureMin)}</p>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wide text-navy-400">Video Content</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Filter and Search Bar */}
            <div className="mt-8 rounded-2xl border border-inkline bg-white p-5 shadow-card">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Search */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                  <input
                    type="search"
                    value={lectureSearch}
                    onChange={(e) => setLectureSearch(e.target.value)}
                    placeholder={`Search ${subject.short} lectures (e.g. Gauss, LCR, Optics)...`}
                    className="focus-ring w-full rounded-xl border border-inkline bg-navy-50/50 py-2.5 pl-9 pr-3 text-base sm:text-sm font-medium text-navy-900 placeholder:text-navy-400 focus:bg-white"
                  />
                  {lectureSearch ? (
                    <button
                      type="button"
                      onClick={() => setLectureSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-navy-400 hover:text-navy-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Chapter Select Dropdown */}
                <div className="relative">
                  <select
                    value={selectedChapterFilter}
                    onChange={(e) => setSelectedChapterFilter(e.target.value)}
                    className="focus-ring w-full rounded-xl border border-inkline bg-navy-50/50 py-2.5 pl-3 pr-8 text-sm font-bold text-navy-800 focus:bg-white"
                    aria-label="Filter by chapter"
                  >
                    <option value="all">All {subject.chapters.length} Syllabus Chapters</option>
                    {subject.chapters.map((ch, i) => (
                      <option key={ch.id} value={ch.id}>
                        Ch {i + 1}: {ch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Educator Select Dropdown */}
                <div className="relative">
                  <select
                    value={selectedEducatorFilter}
                    onChange={(e) => setSelectedEducatorFilter(e.target.value)}
                    className="focus-ring w-full rounded-xl border border-inkline bg-navy-50/50 py-2.5 pl-3 pr-8 text-sm font-bold text-navy-800 focus:bg-white"
                    aria-label="Filter by educator"
                  >
                    <option value="all">All Educators & Channels</option>
                    {availableEducators.map((ed) => (
                      <option key={ed} value={ed}>
                        {ed}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Format Pills & Reset */}
              <div className="mt-4 flex flex-col gap-3 border-t border-inkline pt-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[11px] font-extrabold uppercase tracking-wide text-navy-400">Format:</span>
                  {[
                    { id: "all", label: "All Formats" },
                    { id: "one-shot", label: "⚡ One-Shot" },
                    { id: "detailed-lectures", label: "▶ Detailed" },
                    { id: "yt-lectures", label: "📺 Playlists" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSelectedFormatFilter(fmt.id)}
                      className={cn(
                        "focus-ring rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                        selectedFormatFilter === fmt.id
                          ? "bg-navy-900 text-white shadow-sm"
                          : "border border-inkline bg-navy-50/60 text-navy-600 hover:border-navy-300 hover:bg-white",
                      )}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                {isFiltered ? (
                  <button
                    type="button"
                    onClick={clearLectureFilters}
                    className="focus-ring inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-extrabold text-navy-500 hover:text-navy-900"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reset all filters
                  </button>
                ) : null}
              </div>

              {/* Scrollable Chapter Quick Pills */}
              <div className="no-scrollbar touch-scroll mt-3 flex items-center gap-1.5 overflow-x-auto border-t border-inkline/60 pt-3 pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedChapterFilter("all")}
                  className={cn(
                    "focus-ring shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all",
                    selectedChapterFilter === "all"
                      ? "bg-gold-500 text-navy-950 font-extrabold shadow-sm"
                      : "border border-inkline bg-white text-navy-600 hover:border-navy-300",
                  )}
                >
                  All Chapters
                </button>
                {subject.chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChapterFilter(ch.id)}
                    className={cn(
                      "focus-ring shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all",
                      selectedChapterFilter === ch.id
                        ? "bg-navy-900 text-white shadow-sm"
                        : "border border-inkline bg-white text-navy-600 hover:border-navy-300",
                    )}
                  >
                    Ch {i + 1}: {ch.name.split(" ")[0]}...
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Chapter Contextual Box */}
            {selectedChapterFilter !== "all" ? (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500 font-display text-sm font-extrabold text-white shadow-sm">
                    {String(subject.chapters.findIndex((c) => c.id === selectedChapterFilter) + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-sky-700">
                      CBSE Syllabus Chapter {subject.chapters.findIndex((c) => c.id === selectedChapterFilter) + 1}
                    </p>
                    <p className="font-display text-base font-bold text-sky-950">
                      {subject.chapters.find((c) => c.id === selectedChapterFilter)?.name}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/subjects/${subject.id}/${selectedChapterFilter}`}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-sky-700"
                >
                  Open Full Chapter Notes & PYQs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : null}

            {/* Results Grid */}
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between text-xs font-bold text-navy-500">
                <span>
                  Showing <strong className="text-navy-900">{filteredLectures.length}</strong> {filteredLectures.length === 1 ? "lecture" : "lectures"}
                </span>
                {isFiltered ? (
                  <span className="text-navy-400">Filters active</span>
                ) : (
                  <span>All chapters available</span>
                )}
              </div>

              {filteredLectures.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-inkline bg-white p-10 text-center">
                  <Video className="mx-auto h-10 w-10 text-navy-300" />
                  <h3 className="mt-3 font-display text-base font-bold text-navy-900">No lectures found matching your filters</h3>
                  <p className="mt-1 text-sm text-navy-500">Try clearing the search term or switching to "All Chapters".</p>
                  <button
                    type="button"
                    onClick={clearLectureFilters}
                    className="focus-ring btn-navy mt-4 px-4 py-2 text-xs"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredLectures.map((r, i) => (
                    <Reveal key={r.id} delay={(i % 3) * 50}>
                      <ResourceCard resource={r} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* ===================== CHAPTERWISE NOTES SECTION (ALL SUBJECTS) ===================== */}
      <ErrorBoundary>
        <Suspense fallback={<PyqLoadingFallback />}>
          <SubjectNotesSection subjectId={subject.id} />
        </Suspense>
      </ErrorBoundary>

      {/* ===================== CHAPTERWISE BOARD PYQ BANK ===================== */}
      {hasPyqData(subject.id) ? (
        <section id="pyqs" className="border-t border-inkline bg-slate-50/50 py-14 lg:py-20">
          <div className="container-x">
            <Reveal>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-indigo-700">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      CBSE Board Exam Preparation
                    </span>
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">
                      50 Questions per Chapter · Chapterwise Practice
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                    Chapterwise Board Previous Year Questions
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600 sm:text-base">
                    Interactive chapter-by-chapter practice with verified marking schemes, MCQs, Assertion-Reasons, and numerical steps directly on the website. Select any chapter below to explore questions.
                  </p>
                </div>
              </div>
            </Reveal>

            <ErrorBoundary>
              <Suspense fallback={<PyqLoadingFallback />}>
                {subject.id === "phy" ? <PhysicsPyqSection defaultOpen={true} /> : null}
                {subject.id === "chem" ? <ChemistryPyqSection defaultOpen={true} /> : null}
                {subject.id === "bio" ? <BiologyPyqSection defaultOpen={true} /> : null}
                {subject.id === "math" ? <MathPyqSection defaultOpen={true} /> : null}
                {subject.id === "cs" ? <CsPyqSection defaultOpen={true} /> : null}
                {subject.id === "bst" ? <BstPyqSection defaultOpen={true} /> : null}
                {subject.id === "acc" ? <AccPyqSection defaultOpen={true} /> : null}
                {subject.id === "geo" ? <GeographyPyqSection defaultOpen={true} /> : null}
                {subject.id === "pol" ? <PolPyqSection defaultOpen={true} /> : null}
                {subject.id === "ip" ? <IpPyqSection defaultOpen={true} /> : null}
                {subject.id === "eco" ? <EcoPyqSection defaultOpen={true} /> : null}
                {subject.id === "his" ? <HistoryPyqSection defaultOpen={true} /> : null}
                {subject.id === "soc" ? <SociologyPyqSection defaultOpen={true} /> : null}
                {subject.id === "psy" ? <PsychologyPyqSection defaultOpen={true} /> : null}
                {subject.id === "eng" ? <EnglishPyqSection defaultOpen={true} /> : null}
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      ) : null}

      {/* ===================== OFFICIAL PAST-YEAR PAPERS ARCHIVE (2015–2026) ===================== */}
      {getOfficialPyqArchive(subject.id) ? (
        <section id="past-papers" className="border-t border-inkline bg-white py-14 lg:py-20">
          <div className="container-x">
            <Reveal>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-900">
                      <FileArchive className="h-3.5 w-3.5 text-amber-600" />
                      Official Board Paper Downloads (2015–2026)
                    </span>
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">
                      All Sets &amp; Regions Included
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                    Official CBSE Past-Year Question Papers
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600 sm:text-base">
                    Download complete verified original CBSE board question paper bundles (Delhi, All India, Foreign regions, and Compartment) direct from the official archive.
                  </p>
                </div>
                <Link
                  to="/pyq-papers"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  View all 15 subjects archive
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>

            <ErrorBoundary>
              <SubjectPyqArchiveSection subjectId={subject.id} />
            </ErrorBoundary>
          </div>
        </section>
      ) : null}

      {/* ======================= FULL SUBJECT RESOURCES ======================= */}
      {topLevel.length > 0 ? (
        <section id="full-subject" className="container-x pb-16 pt-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">Full-subject resources</h2>
              <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-extrabold text-navy-700">{topLevel.length}</span>
            </div>
            <p className="mt-1 text-sm text-navy-500">Sample papers, PYQ banks and full-syllabus material for {subject.name}.</p>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topLevel.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 60}>
                <ResourceCard resource={r} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

/* ================================ CHAPTER ================================ */

export function ChapterPage() {
  const { subjectId, chapterId } = useParams();
  const { resources, isChapterDone, toggleChapter } = useApp();
  const subject = subjectById(subjectId);
  const chapter = subject?.chapters.find((c) => c.id === chapterId);

  const chapterResources = useMemo(
    () => resources.filter((r) => r.subjectId === subjectId && r.chapterId === chapterId),
    [resources, subjectId, chapterId],
  );

  if (!subject) return <Navigate to="/subjects" replace />;
  if (!chapter) return <Navigate to={`/subjects/${subject.id}`} replace />;

  const index = subject.chapters.findIndex((c) => c.id === chapter.id);
  const prev = subject.chapters[index - 1];
  const next = subject.chapters[index + 1];
  const done = isChapterDone(subject.id, chapter.id);
  const Icon = subjectIcon(subject.icon);
  const tone = TONES[subject.tone];
  const totalMin = chapterResources.reduce((acc, r) => acc + (r.duration ?? 0), 0);

  const groups = RESOURCE_TYPES.map((t) => ({
    type: t,
    items: chapterResources.filter((r) => r.type === t.id),
  })).filter((g) => g.items.length > 0);

  const lectureGroupIds = new Set(["yt-lectures", "detailed-lectures", "one-shot"]);
  const lectureGroups = groups.filter((g) => lectureGroupIds.has(g.type.id));
  const otherGroups = groups.filter((g) => !lectureGroupIds.has(g.type.id));
  const hasPyq = hasPyqData(subject.id);
  const subjectNotesCatalog = useMemo(() => getSubjectNotesCatalog(subject.id), [subject.id]);
  const chapterNote = useMemo(
    () => subjectNotesCatalog?.chapters.find((c) => c.chapterId === chapter.id || c.chapterNum === index + 1),
    [subjectNotesCatalog, chapter.id, index]
  );

  return (
    <>
      <section className={cn("relative overflow-hidden border-b", tone.border, tone.soft)}>
        <span
          className="text-outline pointer-events-none absolute -bottom-10 right-2 hidden select-none font-display text-[10rem] font-extrabold leading-none sm:block"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="container-x relative py-10 lg:py-12">
          <Crumbs
            items={[
              { label: "Subjects", to: "/subjects" },
              { label: subject.name, to: `/subjects/${subject.id}` },
              { label: "Lectures Hub", to: `/subjects/${subject.id}?section=lectures` },
              { label: `Chapter ${index + 1}` },
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-white/70", tone.chip)}>
                <Icon className="h-6.5 w-6.5" />
              </span>
              <div>
                <p className={cn("text-[11px] font-extrabold uppercase tracking-[0.18em]", tone.text)}>
                  {subject.name} · Chapter {index + 1} of {subject.chapters.length} · CBSE Class 12
                </p>
                <h1 className="mt-1.5 max-w-2xl font-display text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
                  {chapter.name}
                </h1>
                <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-navy-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    {chapterResources.length} resources
                  </span>
                  {totalMin > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {fmtDuration(totalMin)} of video content
                    </span>
                  ) : null}
                  <span>{groups.length} of {RESOURCE_TYPES.length} categories filled</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {hasPyq ? (
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("chapter-pyqs")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="focus-ring inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/90 px-3.5 py-2.5 text-xs font-extrabold text-indigo-950 shadow-sm transition-all hover:bg-indigo-100 hover:text-indigo-900 active:scale-[.98]"
                >
                  <FileCheck2 className="h-4 w-4 text-indigo-600" />
                  Chapter PYQs (50 Qs)
                </button>
              ) : null}
              {chapterNote ? (
                <a
                  href={chapterNote.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/90 px-3.5 py-2.5 text-xs font-extrabold text-emerald-950 shadow-sm transition-all hover:bg-emerald-100 hover:text-emerald-900 active:scale-[.98]"
                >
                  <NotebookPen className="h-4 w-4 text-emerald-600" />
                  {chapterNote.source.includes("Toppers") ? "ToppersCBSE Notes" : "Chapter Revision Notes"}
                  <ExternalLink className="h-3 w-3 text-emerald-500" />
                </a>
              ) : null}
              <Link
                to={`/subjects/${subject.id}?section=lectures`}
                className="focus-ring inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-inkline bg-white/90 px-4 py-2.5 text-xs font-extrabold text-navy-800 shadow-sm transition-all hover:bg-white hover:text-navy-950 active:scale-[.98]"
              >
                <Video className="h-4 w-4 text-rose-500" />
                All {subject.short} Lectures
              </Link>
              <button
                type="button"
                onClick={() => toggleChapter(subject.id, chapter.id, chapter.name)}
                aria-pressed={done}
                className={cn(
                  "focus-ring inline-flex w-fit shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all active:scale-[.98]",
                  done
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-navy-900 text-white hover:bg-navy-700",
                )}
              >
                {done ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Circle className="h-4.5 w-4.5" />}
                {done ? "Chapter completed" : "Mark as completed"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        {/* 1. Chapter Video Lectures (First) */}
        {lectureGroups.length > 0 ? (
          <div className="space-y-12">
            {lectureGroups.map((g) => (
              <Reveal key={g.type.id}>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", TONES[g.type.tone].chip)}>
                      <g.type.icon className="h-4.5 w-4.5" />
                    </span>
                    <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">{g.type.label}</h2>
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-extrabold text-navy-700">{g.items.length}</span>
                    <Link
                      to={`/resources?subject=${subject.id}&chapter=${chapter.id}&types=${g.type.id}`}
                      className="focus-ring ml-auto inline-flex items-center gap-1 rounded-md text-xs font-bold text-navy-500 transition-colors hover:text-navy-900"
                    >
                      Filter view
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {g.items.map((r) => (
                      <ResourceCard key={r.id} resource={r} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}

        {/* 2. Chapter Board PYQ Interactive Practice (Directly Below the Lectures) */}
        {hasPyq ? (
          <div id="chapter-pyqs" className={cn(lectureGroups.length > 0 ? "mt-14 mb-14" : "mb-12")}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-indigo-700">
                    <FileCheck2 className="h-3.5 w-3.5" />
                    Chapter {index + 1} Board Practice
                  </span>
                  <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[11px] font-bold text-navy-700">
                    50 PYQs Below Lectures
                  </span>
                </div>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-navy-900">
                  Chapter Previous Year Questions (PYQs)
                </h2>
                <p className="mt-0.5 text-xs text-navy-500 font-medium">
                  Practice board exam questions for {chapter.name} directly with MCQs, Assertion-Reasons, and full marking schemes.
                </p>
              </div>
            </div>

            <ErrorBoundary>
              <Suspense fallback={<PyqLoadingFallback />}>
                {subject.id === "phy" ? <PhysicsPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "chem" ? <ChemistryPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "bio" ? <BiologyPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "math" ? <MathPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "cs" ? <CsPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "bst" ? <BstPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "acc" ? <AccPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "geo" ? <GeographyPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "pol" ? <PolPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "ip" ? <IpPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "eco" ? <EcoPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "his" ? <HistoryPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "soc" ? <SociologyPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "psy" ? <PsychologyPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
                {subject.id === "eng" ? <EnglishPyqSection initialChapterNum={index + 1} lockChapter={true} defaultOpen={true} /> : null}
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null}

        {/* 3. Notes, NCERT & Other Chapter Study Resources */}
        {otherGroups.length > 0 ? (
          <div className="space-y-12">
            {otherGroups.map((g) => (
              <Reveal key={g.type.id}>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", TONES[g.type.tone].chip)}>
                      <g.type.icon className="h-4.5 w-4.5" />
                    </span>
                    <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">{g.type.label}</h2>
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-extrabold text-navy-700">{g.items.length}</span>
                    <Link
                      to={`/resources?subject=${subject.id}&chapter=${chapter.id}&types=${g.type.id}`}
                      className="focus-ring ml-auto inline-flex items-center gap-1 rounded-md text-xs font-bold text-navy-500 transition-colors hover:text-navy-900"
                    >
                      Filter view
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {g.items.map((r) => (
                      <ResourceCard key={r.id} resource={r} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}

        {groups.length === 0 && !hasPyq ? (
          <EmptyState
            title={`No resources for this chapter yet`}
            body="Resources for this chapter are being indexed. In the meantime, explore full-subject notes, videos, or browse the master directory."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link to={`/subjects/${subject.id}`} className="btn-navy">
                  <ChevronLeft className="h-4 w-4" />
                  Back to {subject.name}
                </Link>
                <Link to={`/resources?subject=${subject.id}`} className="btn-ghost">
                  All {subject.short} resources
                </Link>
              </div>
            }
          />
        ) : null}

        {/* prev / next */}
        <div className="mt-14 grid grid-cols-1 gap-3 border-t border-inkline pt-8 sm:grid-cols-2">
          {prev ? (
            <Link to={`/subjects/${subject.id}/${prev.id}`} className="card-hover focus-ring group flex items-center gap-3 rounded-xl border border-inkline bg-white p-4 shadow-card">
              <ChevronLeft className="h-5 w-5 shrink-0 text-navy-300 transition-transform group-hover:-translate-x-0.5" />
              <span className="min-w-0">
                <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">Previous chapter</span>
                <span className="block truncate font-display text-sm font-bold text-navy-900">{index}. {prev.name}</span>
              </span>
            </Link>
          ) : null}
          {next ? (
            <Link to={`/subjects/${subject.id}/${next.id}`} className={cn("card-hover focus-ring group flex items-center justify-end gap-3 rounded-xl border border-inkline bg-white p-4 text-right shadow-card", !prev && "sm:col-start-2")}>
              <span className="min-w-0">
                <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">Next chapter</span>
                <span className="block truncate font-display text-sm font-bold text-navy-900">{index + 2}. {next.name}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-navy-300 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </section>
    </>
  );
}
