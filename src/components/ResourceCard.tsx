import { Link } from "react-router-dom";
import { Bookmark, Clock, Eye, Flag, Globe2, Star } from "lucide-react";
import type { Resource } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { chapterById, subjectById } from "@/data/subjects";
import { cn, DIFF_META, fmtDuration, fmtViews, timeAgo, TONES, typeMeta } from "@/lib/utils";

export default function ResourceCard({ resource }: { resource: Resource }) {
  const { isBookmarked, toggleBookmark, addRecent, reportBroken } = useApp();
  const subject = subjectById(resource.subjectId);
  const chapter = subject ? chapterById(subject, resource.chapterId) : undefined;
  const meta = typeMeta(resource.type);
  const tone = TONES[meta.tone];
  const saved = isBookmarked(resource.id);

  const isInternal =
    resource.sourceKind !== "youtube" && (
      resource.type === "pyq" ||
      resource.url.startsWith("/") ||
      Boolean(
        resource.sourceKind === "website" &&
          (resource.source.includes("StudyNest") || resource.source.includes("StudyBust")),
      )
    );

  const contextLink = chapter
    ? `/subjects/${subject?.id}/${chapter.id}`
    : resource.type === "pyq"
      ? `/subjects/${subject?.id ?? resource.subjectId}?section=pyqs`
      : `/subjects/${subject?.id ?? resource.subjectId}`;

  const targetLink =
    resource.type === "pyq"
      ? resource.url.startsWith("/")
        ? resource.url
        : chapter
          ? `/subjects/${subject?.id}/${chapter.id}#chapter-pyqs`
          : `/subjects/${subject?.id ?? resource.subjectId}?section=pyqs`
      : resource.url.startsWith("/")
        ? resource.url
        : contextLink;

  return (
    <article
      className={cn(
        "card-hover group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white p-5 shadow-card",
        resource.recommended ? "border-gold-200 bg-gradient-to-b from-gold-50/70 to-white" : "border-inkline",
      )}
    >
      {/* tone hairline on hover */}
      <span className={cn("absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100", tone.bar)} aria-hidden="true" />
      {/* watermark */}
      <meta.icon className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 text-navy-900/[0.045] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true" />

      {/* header */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold", tone.chip)}>
            <meta.icon className="h-3 w-3" />
            {meta.short}
          </span>
          <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-bold", DIFF_META[resource.difficulty])}>
            {resource.difficulty}
          </span>
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove bookmark" : "Save to bookmarks"}
          aria-pressed={saved}
          onClick={() => toggleBookmark(resource)}
          className={cn(
            "focus-ring -mr-1 -mt-1 rounded-lg p-2 transition-all duration-200",
            saved ? "bg-gold-100 text-gold-600" : "text-navy-300 hover:bg-navy-50 hover:text-navy-700",
          )}
        >
          <Bookmark key={String(saved)} className={cn("h-4.5 w-4.5", saved && "animate-pop fill-gold-400 stroke-gold-600")} />
        </button>
      </div>

      {/* title */}
      <h3 className="relative mt-3 font-display text-[15px] font-bold leading-snug text-navy-900">
        {resource.sourceKind === "youtube" ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addRecent(resource.id)}
            className="group/title line-clamp-2 transition-colors hover:text-rose-600 focus-ring rounded-sm inline-flex items-center gap-1.5"
            title="Watch video on YouTube (opens in new tab)"
          >
            <span>{resource.title}</span>
            <ArrowGlyph />
          </a>
        ) : isInternal ? (
          <Link to={targetLink} className="line-clamp-2 transition-colors hover:text-navy-600 focus-ring rounded-sm">
            {resource.title}
          </Link>
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addRecent(resource.id)}
            className="line-clamp-2 transition-colors hover:text-navy-600 focus-ring rounded-sm inline-flex items-center gap-1.5"
          >
            <span>{resource.title}</span>
            <ArrowGlyph />
          </a>
        )}
      </h3>

      {/* source */}
      <div className="relative mt-2 flex items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold",
            resource.sourceKind === "youtube" ? "bg-rose-50 text-rose-600" : "bg-navy-50 text-navy-600",
          )}
        >
          {resource.sourceKind === "youtube" ? <PlayGlyph /> : <Globe2 className="h-3 w-3" />}
        </span>
        {resource.sourceKind === "youtube" ? (
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(resource.source + " class 12")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs font-bold text-navy-800 transition-colors hover:text-rose-600 hover:underline"
            title={`Search ${resource.source} on YouTube`}
          >
            {resource.source}
          </a>
        ) : (
          <span className="truncate text-xs font-bold text-navy-800">{resource.source}</span>
        )}
        <span className="text-[11px] font-semibold text-navy-300">
          · {resource.sourceKind === "youtube" ? "YouTube" : "Website"}
        </span>
      </div>

      {/* description */}
      <p className="relative mt-2 line-clamp-2 text-[13px] leading-relaxed text-navy-500">{resource.description}</p>

      {/* meta */}
      <div className="relative mb-4 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-navy-400">
        {chapter ? (
          <Link
            to={contextLink}
            className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-navy-50 px-1.5 py-0.5 font-bold text-navy-600 transition-colors hover:bg-navy-100 hover:text-navy-900"
            title={`View ${chapter.name} chapter details`}
          >
            {subject?.short} · {chapter.name}
          </Link>
        ) : (
          <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-navy-50 px-1.5 py-0.5 font-bold text-navy-600">
            {subject?.short ?? "Class 12"} · Full subject
          </span>
        )}
        <span className="inline-flex items-center gap-1">{resource.language}</span>
        {resource.duration ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {fmtDuration(resource.duration)}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {fmtViews(resource.views)}
        </span>
        <span>{timeAgo(resource.addedAt)}</span>
      </div>

      {/* footer */}
      <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-inkline pt-3.5">
        <div className="flex items-center gap-2">
          {resource.recommended ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-b from-gold-200 to-gold-300 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-gold-700 shadow-sm">
              <Star className="h-3 w-3 fill-gold-600 stroke-gold-600" />
              Recommended
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => reportBroken(resource.id, resource.title, "Link not working / needs curation")}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold text-navy-300 transition-colors hover:text-rose-500 focus-ring"
            aria-label={`Report an issue with ${resource.title}`}
          >
            <Flag className="h-3 w-3" />
            Report
          </button>
        </div>
        {isInternal ? (
          <Link
            to={targetLink}
            onClick={() => addRecent(resource.id)}
            className="focus-ring group/open inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-navy-800 to-navy-950 px-3.5 py-2 text-xs font-extrabold text-white transition-all duration-200 hover:from-navy-700 hover:to-navy-900 active:scale-[.97]"
          >
            {resource.type === "pyq" ? (
              chapter ? "Practice Chapter PYQs" : "Explore PYQ Bank"
            ) : (
              "Open Resource"
            )}
            <ArrowGlyph />
          </Link>
        ) : resource.sourceKind === "youtube" ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addRecent(resource.id)}
            className="focus-ring group/open inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-rose-600 to-rose-700 px-3.5 py-2 text-xs font-extrabold text-white shadow-sm transition-all duration-200 hover:from-rose-500 hover:to-rose-600 active:scale-[.97]"
          >
            <PlayGlyph />
            Watch on YouTube
            <ArrowGlyph />
          </a>
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addRecent(resource.id)}
            className="focus-ring group/open inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-navy-800 to-navy-950 px-3.5 py-2 text-xs font-extrabold text-white transition-all duration-200 hover:from-navy-700 hover:to-navy-900 active:scale-[.97]"
          >
            Open Resource
            <ArrowGlyph />
          </a>
        )}
      </div>
    </article>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/open:-translate-y-0.5 group-hover/open:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}
