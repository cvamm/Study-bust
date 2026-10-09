import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  NotebookPen,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  ArrowRight,
  Layers,
  X,
  BookmarkCheck,
} from "lucide-react";
import {
  getSubjectNotesCatalog,
  type ChapterNoteItem,
  type SubjectNotesCatalog,
} from "@/data/subjectNotes";
import { subjectById } from "@/data/subjects";
import { cn, TONES, subjectIcon } from "@/lib/utils";

interface SubjectNotesSectionProps {
  subjectId: string;
  initialChapterNum?: number;
  lockChapter?: boolean;
  defaultOpen?: boolean;
}

export default function SubjectNotesSection({
  subjectId,
  initialChapterNum,
  lockChapter = false,
  defaultOpen = true,
}: SubjectNotesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>(
    initialChapterNum ? `${subjectId}-c${initialChapterNum}` : "all"
  );
  const [expandedHighlights, setExpandedHighlights] = useState<Set<string>>(new Set());
  const [isSectionOpen, setIsSectionOpen] = useState(defaultOpen);

  const subject = subjectById(subjectId);
  const catalog = useMemo<SubjectNotesCatalog | null>(
    () => getSubjectNotesCatalog(subjectId),
    [subjectId]
  );

  const tone = subject ? TONES[subject.tone] : TONES.emerald;
  const SubjectIcon = subject ? subjectIcon(subject.icon) : NotebookPen;

  const toggleHighlights = (chapterId: string) => {
    setExpandedHighlights((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const filteredNotes = useMemo(() => {
    if (!catalog) return [];
    let list = catalog.chapters;

    if (lockChapter && initialChapterNum) {
      list = list.filter((n) => n.chapterNum === initialChapterNum);
    } else if (selectedChapterFilter !== "all") {
      list = list.filter((n) => n.chapterId === selectedChapterFilter);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.keyTopics.some((t) => t.toLowerCase().includes(q)) ||
          n.keyHighlights.some((d) => d.toLowerCase().includes(q))
      );
    }

    return list;
  }, [catalog, searchQuery, selectedChapterFilter, lockChapter, initialChapterNum]);

  const totalPages = useMemo(() => {
    if (!catalog) return 0;
    return catalog.chapters.reduce((acc, n) => acc + n.estimatedPages, 0);
  }, [catalog]);

  const totalHighlightsCount = useMemo(() => {
    if (!catalog) return 0;
    return catalog.chapters.reduce((acc, n) => acc + n.keyHighlights.length, 0);
  }, [catalog]);

  if (!catalog || !subject) return null;

  const isToppers = catalog.sourceName.includes("Toppers");

  return (
    <section id="notes" className="border-t border-inkline bg-emerald-50/20 py-14 lg:py-20">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">
                <NotebookPen className="h-3.5 w-3.5 text-emerald-600" />
                {isToppers ? "Handwritten Revision Notes" : "Chapterwise Revision Notes"} · CBSE Class 12
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-sky-700">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                {catalog.sourceName}
              </span>
              <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">
                {catalog.chapters.length} Chapters · ~{totalPages} Total Pages
              </span>
            </div>

            <h2 className="mt-3 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              <SubjectIcon className="h-8 w-8 text-emerald-600" />
              <span>{subject.name} Chapterwise Revision Notes</span>
            </h2>

            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-navy-600 sm:text-base">
              {catalog.description} Free, verified chapter-by-chapter revision sheets with high-yield concepts, definitions, and key exam summaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={catalog.masterPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[.98]"
            >
              <BookOpen className="h-4 w-4" />
              <span>Open Master {catalog.sourceName} Portal</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={() => setIsSectionOpen((v) => !v)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-inkline bg-white px-3.5 py-2.5 text-xs font-bold text-navy-700 shadow-sm transition-all hover:bg-navy-50"
            >
              <span>{isSectionOpen ? "Collapse Section" : "Expand Section"}</span>
              {isSectionOpen ? (
                <ChevronUp className="h-4 w-4 text-navy-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-navy-500" />
              )}
            </button>
          </div>
        </div>

        {isSectionOpen && (
          <div className="mt-8">
            {/* Filter Bar (Only if not locked to single chapter) */}
            {!lockChapter && (
              <div className="rounded-2xl border border-inkline bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${subject.short} notes by chapter title, topic, formula...`}
                      className="w-full rounded-xl border border-inkline bg-navy-50/50 py-2.5 pl-10 pr-9 text-xs font-medium text-navy-900 placeholder-navy-400 outline-none transition-colors focus:border-emerald-500 focus:bg-white"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                        title="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Summary badges */}
                  <div className="flex shrink-0 items-center gap-3 text-xs font-bold text-navy-600">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-emerald-600" />
                      Showing {filteredNotes.length} of {catalog.chapters.length} chapters
                    </span>
                    <span className="hidden sm:inline text-navy-300">|</span>
                    <span className="hidden sm:flex items-center gap-1 text-emerald-700">
                      <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
                      {totalHighlightsCount} Key Highlights Indexed
                    </span>
                  </div>
                </div>

                {/* Chapter Filter Pills */}
                <div className="mt-4 border-t border-inkline pt-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-navy-400 mb-2">
                    Filter by Chapter:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedChapterFilter("all")}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                        selectedChapterFilter === "all"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                      )}
                    >
                      All ({catalog.chapters.length})
                    </button>
                    {catalog.chapters.map((n) => (
                      <button
                        key={n.chapterId}
                        type="button"
                        onClick={() => setSelectedChapterFilter(n.chapterId)}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                          selectedChapterFilter === n.chapterId
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                        )}
                        title={n.title}
                      >
                        Ch {n.chapterNum}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty Search Result */}
            {filteredNotes.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-inkline bg-white p-12 text-center">
                <NotebookPen className="mx-auto h-8 w-8 text-navy-300" />
                <h3 className="mt-3 font-display text-base font-bold text-navy-800">
                  No matching notes found
                </h3>
                <p className="mt-1 text-xs text-navy-500">
                  Try adjusting your search terms or clear the filter to see all {catalog.chapters.length} chapters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedChapterFilter("all");
                  }}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Notes Grid */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredNotes.map((note) => {
                const isExpanded = expandedHighlights.has(note.chapterId);

                return (
                  <div
                    key={note.chapterId}
                    className="flex flex-col justify-between rounded-2xl border border-inkline bg-white p-5 shadow-card transition-all hover:border-emerald-300 hover:shadow-md sm:p-6"
                  >
                    <div>
                      {/* Card Header: Chapter Number & Meta Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-extrabold text-emerald-800">
                            {note.chapterNum}
                          </span>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                            Chapter {note.chapterNum}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-0.5 text-[11px] font-bold text-navy-700">
                            <FileText className="h-3 w-3 text-navy-400" />
                            ~{note.estimatedPages} pgs
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                            <Sparkles className="h-3 w-3 text-emerald-500" />
                            {note.keyHighlights.length} Highlights
                          </span>
                        </div>
                      </div>

                      {/* Chapter Title */}
                      <h3 className="mt-3 font-display text-lg font-extrabold text-navy-950 sm:text-xl">
                        {note.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs leading-relaxed text-navy-600 sm:text-sm">
                        {note.description}
                      </p>

                      {/* Key Topics Tags */}
                      <div className="mt-3.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400 mb-1.5">
                          Key Exam Topics:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {note.keyTopics.map((topic, i) => (
                            <span
                              key={i}
                              className="rounded-md border border-inkline bg-navy-50/70 px-2 py-0.5 text-[11px] font-semibold text-navy-700"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* High Yield Derivations / Highlights Drawer */}
                      {note.keyHighlights.length > 0 && (
                        <div className="mt-4 border-t border-inkline pt-3">
                          <button
                            type="button"
                            onClick={() => toggleHighlights(note.chapterId)}
                            className="flex w-full items-center justify-between text-left text-xs font-bold text-emerald-800 hover:text-emerald-950"
                          >
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Key Highlights & Formulas ({note.keyHighlights.length})
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                          </button>

                          {isExpanded && (
                            <ul className="mt-2.5 space-y-1.5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-navy-800">
                              {note.keyHighlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                  <span className="leading-snug">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-inkline pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-navy-500">
                        <span className="font-bold text-emerald-700">{note.source}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/subjects/${subject.id}/${note.chapterId}`}
                          className="focus-ring inline-flex items-center gap-1 rounded-lg border border-inkline bg-white px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:border-navy-300 hover:text-navy-950"
                        >
                          <span>Chapter Hub</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>

                        <a
                          href={note.notesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[.98]"
                        >
                          <span>Open Notes</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
