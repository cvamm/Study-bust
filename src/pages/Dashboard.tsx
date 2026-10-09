import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Bookmark,
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  PlayCircle,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import AnimatedBar from "@/components/AnimatedBar";
import EmptyState from "@/components/EmptyState";
import ResourceCard from "@/components/ResourceCard";
import { useApp } from "@/context/AppContext";
import { chapterById, SUBJECTS, subjectById, TOTAL_CHAPTERS } from "@/data/subjects";
import { cn, fmtDate, GOAL_META, TONES, todayISO, typeMeta } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "planner", label: "Planner", icon: ListChecks },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
];

const PRIORITY_CHIP: Record<string, string> = {
  High: "bg-rose-50 text-rose-700 border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "overview";

  return (
    <>
      <section className="border-b border-inkline bg-white">
        <div className="container-x py-10">
          <DashboardHeader />
          <div className="mt-7 flex gap-1.5 overflow-x-auto no-scrollbar touch-scroll" role="tablist" aria-label="Dashboard sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setParams(t.id === "overview" ? {} : { tab: t.id }, { replace: true })}
                className={cn(
                  "focus-ring inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                  tab === t.id ? "bg-navy-900 text-white shadow-sm" : "text-navy-500 hover:bg-navy-50 hover:text-navy-900",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-x py-10">
        {tab === "overview" ? <Overview /> : null}
        {tab === "planner" ? <Planner /> : null}
        {tab === "bookmarks" ? <Bookmarks /> : null}
      </div>
    </>
  );
}

/* ------------------------------- header ------------------------------- */

function DashboardHeader() {
  const { user } = useApp();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const hour = new Date().getHours();
  const dayPart = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-600">{today}</p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-navy-900">
            {user ? `Good ${dayPart}, ${user.name.split(" ")[0]}` : "Your study dashboard"}
          </h1>
          <p className="mt-1.5 text-sm font-semibold text-navy-500">
            {user ? "Here's how your Class 12 prep is shaping up." : "Track progress, plan your week and keep your shortlist — all in one place."}
          </p>
        </div>
        {user ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-inkline bg-paper px-4 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 font-display text-sm font-bold text-gold-300">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-bold text-navy-900">{user.name}</p>
              <p className="text-[11px] font-semibold text-navy-400">Class 12 · CBSE 2025–26</p>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-700">
            <UserRound className="h-4 w-4" />
            Sign in to personalise
          </Link>
        )}
      </div>

      {!user && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-200/80 bg-gradient-to-r from-gold-50/70 to-amber-50/50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/20 text-gold-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-navy-800">
              You are using Dashboard as a guest. All your syllabus progress and planner tasks are currently stored in this browser session.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-navy-800"
          >
            Create Profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ overview ------------------------------ */

function Overview() {
  const { resources, completed, bookmarks, tasks, recent } = useApp();

  const totalDone = completed.length;
  const pct = Math.round((totalDone / TOTAL_CHAPTERS) * 100);
  const today = todayISO();
  const dueToday = tasks.filter((t) => t.date === today);
  const dueDone = dueToday.filter((t) => t.done).length;

  const recentResources = useMemo(
    () => recent.map((id) => resources.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => Boolean(r)),
    [recent, resources],
  );

  return (
    <div className="space-y-8">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-inkline bg-white p-5 shadow-card">
          <Ring value={pct / 100} />
          <div>
            <p className="font-display text-2xl font-extrabold text-navy-900">{pct}%</p>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-navy-400">Syllabus covered</p>
          </div>
        </div>
        <StatCard value={`${totalDone}/${TOTAL_CHAPTERS}`} label="Chapters completed" icon={Check} tint="bg-green-50 text-green-600" />
        <StatCard value={String(bookmarks.length)} label="Saved resources" icon={Bookmark} tint="bg-gold-100 text-gold-600" />
        <StatCard value={`${dueDone}/${dueToday.length}`} label="Today's tasks done" icon={ListChecks} tint="bg-sky-50 text-sky-600" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* subject progress */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">Subject progress</h2>
            <Link to="/subjects" className="focus-ring inline-flex items-center gap-1 rounded-md text-xs font-bold text-navy-500 hover:text-navy-900">
              All subjects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-inkline bg-white shadow-card">
            {SUBJECTS.map((s, i) => {
              const done = s.chapters.filter((c) => completed.includes(`${s.id}/${c.id}`)).length;
              const p = Math.round((done / s.chapters.length) * 100);
              return (
                <Link
                  key={s.id}
                  to={`/subjects/${s.id}`}
                  className={cn(
                    "focus-ring flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-navy-50/60",
                    i > 0 && "border-t border-inkline",
                  )}
                >
                  <span className="w-28 shrink-0 truncate text-sm font-bold text-navy-900 sm:w-40">{s.name}</span>
                  <AnimatedBar
                    className="h-2 flex-1"
                    pct={Math.max(p, done > 0 ? 4 : 0)}
                    barClass={p === 100 ? "bg-green-500" : TONES[s.tone].bar}
                  />
                  <span className={cn("w-14 shrink-0 text-right text-xs font-extrabold", p === 100 ? "text-green-600" : "text-navy-500")}>
                    {done}/{s.chapters.length}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* continue + recent */}
        <section className="space-y-8">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">Continue where you left off</h2>
            {recentResources[0] ? (
              <div className="mt-4">
                <ResourceCard resource={recentResources[0]} />
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="Nothing opened yet"
                  body="Open any resource and it will appear here so you can pick up where you left off."
                  action={
                    <Link to="/resources" className="btn-navy">
                      Browse resources
                    </Link>
                  }
                />
              </div>
            )}
          </div>

          {recentResources.length > 1 ? (
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">Recently viewed</h2>
              <ul className="mt-4 overflow-hidden rounded-xl border border-inkline bg-white shadow-card">
                {recentResources.slice(1, 6).map((r, i) => {
                  const subject = subjectById(r.subjectId);
                  const chapter = subject ? chapterById(subject, r.chapterId) : undefined;
                  const meta = typeMeta(r.type);
                  const Icon = meta.id === "yt-lectures" || meta.id === "detailed-lectures" ? PlayCircle : meta.icon;
                  return (
                    <li key={r.id} className={cn("flex items-center gap-3 px-4 py-3", i > 0 && "border-t border-inkline")}>
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", TONES[meta.tone].chip)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        {r.url.startsWith("/") ? (
                          <Link
                            to={r.url}
                            className="focus-ring block truncate rounded-sm text-[13px] font-bold text-navy-900 hover:text-navy-600"
                          >
                            {r.title}
                          </Link>
                        ) : (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus-ring block truncate rounded-sm text-[13px] font-bold text-navy-900 hover:text-navy-600"
                          >
                            {r.title}
                          </a>
                        )}
                        <p className="truncate text-[11px] font-semibold text-navy-400">
                          {subject?.short}
                          {chapter ? ` · ${chapter.name}` : ""} · {r.source}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-navy-300" />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      {/* AI coming soon strip */}
      <section className="rounded-xl border border-navy-800 bg-navy-950 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
              <Bot className="h-5.5 w-5.5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white">StudyBust Intelligence</h2>
              <p className="text-xs font-semibold text-navy-300">AI tools wired into your bookmarks, progress and planner — coming soon.</p>
            </div>
          </div>
          <Link to="/about" className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-navy-700 px-4 py-2 text-xs font-bold text-navy-200 transition-colors hover:border-gold-400/50 hover:text-gold-300">
            See the roadmap <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, label: "AI Recommendations" },
            { icon: MessageSquare, label: "AI Doubt Solver" },
            { icon: FileText, label: "AI Chapter Summaries" },
            { icon: ClipboardList, label: "AI Quiz Generator" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 rounded-lg border border-navy-800 bg-navy-900/70 px-4 py-3">
              <f.icon className="h-4.5 w-4.5 shrink-0 text-gold-300" />
              <span className="flex-1 text-xs font-bold text-navy-100">{f.label}</span>
              <span className="rounded-full bg-navy-800 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-gold-300">Soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label, icon: Icon, tint }: { value: string; label: string; icon: LucideIcon; tint: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-inkline bg-white p-5 shadow-card">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tint)}>
        <Icon className="h-5.5 w-5.5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-2xl font-extrabold text-navy-900">{value}</p>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-navy-400">{label}</p>
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const r = 24;
  const circ = 2 * Math.PI * r;
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(value, 1)) : 0;
  const v = mounted ? safeValue : 0;
  return (
    <svg viewBox="0 0 60 60" className="h-14 w-14 shrink-0 -rotate-90">
      <circle cx="30" cy="30" r={r} fill="none" stroke="#eff3fb" strokeWidth="7" />
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke={value >= 1 ? "#22c55e" : "#0a1b3d"}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - v)}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

/* ------------------------------- planner ------------------------------- */

function Planner() {
  const { tasks, addTask, toggleTask, deleteTask, autoPlan } = useApp();
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("phy");
  const [date, setDate] = useState(todayISO());
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the task a title — e.g. “Solve 20 PYQs from Integrals”");
      return;
    }
    const chosenDate = date || todayISO();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (new Date(chosenDate) < oneYearAgo) {
      setError("Date can’t be more than 1 year in the past — pick a recent or upcoming date.");
      return;
    }
    addTask({ title: title.trim(), subjectId, date: chosenDate, priority });
    setTitle("");
    setError("");
  };

  const visible = tasks
    .filter((t) => (filter === "all" ? true : filter === "done" ? t.done : !t.done))
    .sort((a, b) => a.date.localeCompare(b.date));

  const dates = [...new Set(visible.map((t) => t.date))];
  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* add form */}
      <section>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">Plan your study</h2>
        <p className="mt-1 text-sm text-navy-500">Small daily targets beat weekend marathons. Add what you'll cover and when.</p>

        <form onSubmit={submit} className="mt-5 space-y-4 rounded-xl border border-inkline bg-white p-5 shadow-card">
          <div>
            <label htmlFor="task-title" className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">
              Task
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Solve 20 PYQs from Integrals"
              className="input-base"
            />
            {error ? <p className="mt-1.5 text-xs font-bold text-rose-600">{error}</p> : null}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="task-subject" className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">
                Subject
              </label>
              <select id="task-subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="input-base">
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-date" className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">
                Date
              </label>
              <input
                id="task-date"
                type="date"
                value={date}
                min={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return d.toISOString().split("T")[0]; })()}
                onChange={(e) => { setDate(e.target.value); if (error) setError(""); }}
                className="input-base"
              />
            </div>
            <div>
              <label htmlFor="task-priority" className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-navy-400">
                Priority
              </label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className="input-base">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-navy w-full">
            <Plus className="h-4 w-4" />
            Add task
          </button>
        </form>

        <button
          type="button"
          onClick={autoPlan}
          className="focus-ring mt-4 flex w-full items-center gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-400 text-navy-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold text-navy-900">Auto-plan my next 5 days</span>
            <span className="block text-xs font-semibold text-navy-500">Generates revision tasks from chapters you haven't completed yet.</span>
          </span>
        </button>

        <div className="mt-6 rounded-xl border border-inkline bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wide">
            <span className="text-navy-400">Planner progress</span>
            <span className="text-navy-800">{doneCount}/{tasks.length} done</span>
          </div>
          <AnimatedBar className="mt-2 h-2" pct={pct} barClass="bg-gradient-to-r from-gold-300 to-gold-500" />
        </div>
      </section>

      {/* task list */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">Your tasks</h2>
          <div className="flex gap-1.5">
            {(["all", "pending", "done"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "focus-ring rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all",
                  filter === f ? "bg-navy-900 text-white" : "bg-white text-navy-500 hover:bg-navy-50 border border-inkline",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={filter === "done" ? "Nothing completed yet" : "Your planner is empty"}
              body={
                filter === "done"
                  ? "Tick off tasks as you finish them — they'll collect here."
                  : "Add a task on the left, or let the auto-planner draft your next 5 days from unfinished chapters."
              }
            />
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {dates.map((d) => (
              <div key={d}>
                <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-navy-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {d === todayISO() ? "Today" : fmtDate(d)}
                </p>
                <ul className="mt-2 overflow-hidden rounded-xl border border-inkline bg-white shadow-card">
                  {visible
                    .filter((t) => t.date === d)
                    .map((t, i) => {
                      const subject = subjectById(t.subjectId);
                      return (
                        <li key={t.id} className={cn("group flex items-center gap-3 px-4 py-3.5", i > 0 && "border-t border-inkline", t.done && "bg-navy-50/50")}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={t.done}
                            aria-label={`Mark "${t.title}" as ${t.done ? "pending" : "done"}`}
                            onClick={() => toggleTask(t.id)}
                            className={cn(
                              "focus-ring flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                              t.done ? "border-green-600 bg-green-600 text-white" : "border-navy-200 bg-white hover:border-navy-500",
                            )}
                          >
                            {t.done ? <Check className="h-3.5 w-3.5" /> : null}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm font-bold", t.done ? "text-navy-400 line-through" : "text-navy-900")}>{t.title}</p>
                            <p className="mt-0.5 flex items-center gap-2 text-[11px] font-bold text-navy-400">
                              <span className={cn("rounded-md border px-1.5 py-px", subject ? TONES[subject.tone].chip : "")}>{subject?.short}</span>
                              <span className={cn("rounded-md border px-1.5 py-px", PRIORITY_CHIP[t.priority])}>{t.priority}</span>
                              <span className={cn("rounded-md border px-1.5 py-px", t.done ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200")}>{t.done ? "Done" : "Pending"}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Delete task "${t.title}"`}
                            onClick={() => deleteTask(t.id)}
                            className="focus-ring rounded-lg p-2 text-navy-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------ bookmarks ------------------------------ */

function Bookmarks() {
  const { resources, bookmarks } = useApp();
  const saved = bookmarks
    .map((id) => resources.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900">Saved resources</h2>
          <p className="mt-1 text-sm text-navy-500">Your personal shortlist — tap the bookmark on any card to add or remove.</p>
        </div>
        <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-extrabold text-gold-700">{saved.length} saved</span>
      </div>

      {saved.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No bookmarks yet"
            body="Save lectures, notes and PYQ banks you want to return to — they'll wait for you here on this device."
            action={
              <Link to="/resources" className="btn-navy">
                Explore the directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {saved.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </section>
  );
}
