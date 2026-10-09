import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BrokenReport, PlannerTask, Resource, User } from "@/lib/types";
import { SEED_RESOURCES } from "@/data/resources";
import { SUBJECTS } from "@/data/subjects";
import { todayISO, uid } from "@/lib/utils";
import {
  decodeFromStorage,
  encodeForStorage,
  isValidReport,
  isValidResource,
  isValidTask,
  sanitizeText,
} from "@/lib/security";
import { sendWebhookEvent } from "@/lib/webhook";

interface ToastItem {
  id: string;
  message: string;
  tone: "success" | "info" | "danger";
}

interface Persisted {
  user: User | null;
  bookmarks: string[];
  completed: string[];
  recent: string[];
  tasks: PlannerTask[];
  custom: Resource[];
  edited: Record<string, Resource>;
  deleted: string[];
  recOverride: Record<string, boolean>;
  reports: BrokenReport[];
}

const KEY = "studybust12:v1";

const addDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const DEFAULTS: Persisted = {
  user: null,
  bookmarks: [],
  completed: [],
  recent: [],
  tasks: [
    { id: "seed-1", title: "Watch: Electric Charges & Fields one-shot", subjectId: "phy", date: addDays(0), priority: "High", done: false },
    { id: "seed-2", title: "Solve: Integrals PYQ set (20 questions)", subjectId: "math", date: addDays(1), priority: "Medium", done: false },
    { id: "seed-3", title: "Read: Biomolecules NCERT + notes", subjectId: "chem", date: addDays(2), priority: "Low", done: false },
  ],
  custom: [],
  edited: {},
  deleted: [],
  recOverride: {},
  reports: [],
};

function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;

    let jsonStr = raw;
    // Attempt decoding if obfuscated
    if (!raw.startsWith("{")) {
      const decoded = decodeFromStorage(raw);
      if (decoded.startsWith("{")) {
        jsonStr = decoded;
      }
    }

    const parsed = JSON.parse(jsonStr) as Partial<Persisted>;
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.filter(isValidTask) : DEFAULTS.tasks;
    const custom = Array.isArray(parsed.custom) ? parsed.custom.filter(isValidResource) : DEFAULTS.custom;
    const reports = Array.isArray(parsed.reports) ? parsed.reports.filter(isValidReport) : DEFAULTS.reports;

    return {
      user: parsed.user && typeof parsed.user === "object" ? {
        name: sanitizeText(parsed.user.name || ""),
        email: sanitizeText(parsed.user.email || "")
      } : DEFAULTS.user,
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks.filter((b): b is string => typeof b === "string") : DEFAULTS.bookmarks,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((c): c is string => typeof c === "string") : DEFAULTS.completed,
      recent: Array.isArray(parsed.recent) ? parsed.recent.filter((r): r is string => typeof r === "string") : DEFAULTS.recent,
      tasks: tasks.length > 0 ? tasks : DEFAULTS.tasks,
      custom,
      edited: parsed.edited && typeof parsed.edited === "object" ? parsed.edited : DEFAULTS.edited,
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted.filter((d): d is string => typeof d === "string") : DEFAULTS.deleted,
      recOverride: parsed.recOverride && typeof parsed.recOverride === "object" ? parsed.recOverride : DEFAULTS.recOverride,
      reports,
    };
  } catch {
    return DEFAULTS;
  }
}

interface AppContextValue extends Persisted {
  resources: Resource[];
  toasts: ToastItem[];
  toast: (message: string, tone?: ToastItem["tone"]) => void;
  dismissToast: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (r: Resource) => void;
  isChapterDone: (subjectId: string, chapterId: string) => boolean;
  toggleChapter: (subjectId: string, chapterId: string, chapterName: string) => void;
  addRecent: (id: string) => void;
  addTask: (t: Omit<PlannerTask, "id" | "done">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  autoPlan: () => void;
  addResource: (r: Omit<Resource, "id" | "addedAt" | "views">) => void;
  updateResource: (id: string, r: Resource) => void;
  deleteResource: (id: string) => void;
  toggleRecommended: (id: string) => void;
  reportBroken: (resourceId: string, resourceTitle: string, reason: string) => void;
  resolveReport: (id: string) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  mentorModalOpen: boolean;
  openMentorModal: () => void;
  closeMentorModal: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(loadState);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const timers = useRef<number[]>([]);

  const openMentorModal = useCallback(() => setMentorModalOpen(true), []);
  const closeMentorModal = useCallback(() => setMentorModalOpen(false), []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, encodeForStorage(JSON.stringify(state)));
    } catch {
      /* storage unavailable — demo continues in memory */
    }
  }, [state]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const toast = useCallback((message: string, tone: ToastItem["tone"] = "success") => {
    const id = uid();
    setToasts((prev) => [...prev.slice(-3), { id, message, tone }]);
    timers.current.push(
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3400),
    );
  }, []);

  const dismissToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const resources = useMemo<Resource[]>(() => {
    const seeds = SEED_RESOURCES.filter((r) => !state.deleted.includes(r.id)).map((r) => {
      const base = state.edited[r.id] ?? r;
      const rec = state.recOverride[r.id];
      return rec === undefined ? base : { ...base, recommended: rec };
    });
    const custom = state.custom
      .filter((r) => !state.deleted.includes(r.id))
      .map((r) => {
        const rec = state.recOverride[r.id];
        return rec === undefined ? r : { ...r, recommended: rec };
      });
    return [...seeds, ...custom];
  }, [state.deleted, state.edited, state.recOverride, state.custom]);

  const value: AppContextValue = {
    ...state,
    resources,
    toasts,
    toast,
    dismissToast,
    isBookmarked: (id) => state.bookmarks.includes(id),
    toggleBookmark: (r) => {
      const has = state.bookmarks.includes(r.id);
      toast(has ? "Removed from bookmarks" : "Saved to bookmarks", has ? "info" : "success");
      setState((prev) => ({
        ...prev,
        bookmarks: has ? prev.bookmarks.filter((b) => b !== r.id) : [r.id, ...prev.bookmarks],
      }));
    },
    isChapterDone: (s, c) => state.completed.includes(`${s}/${c}`),
    toggleChapter: (s, c, name) => {
      const key = `${s}/${c}`;
      const done = state.completed.includes(key);
      toast(done ? "Marked as not completed" : `Nice — "${name}" completed`, done ? "info" : "success");
      setState((prev) => ({
        ...prev,
        completed: done ? prev.completed.filter((k) => k !== key) : [key, ...prev.completed],
      }));
    },
    addRecent: (id) =>
      setState((prev) => ({
        ...prev,
        recent: [id, ...prev.recent.filter((r) => r !== id)].slice(0, 10),
      })),
    addTask: (t) => {
      setState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, { ...t, id: uid(), done: false }],
      }));
      toast("Task added to planner");
    },
    toggleTask: (id) =>
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      })),
    deleteTask: (id) => {
      setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
      toast("Task removed", "info");
    },
    autoPlan: () => {
      // Group remaining unfinished chapters by subject, excluding ones already in pending tasks
      const subjectRemaining = new Map<string, Array<{ subjectId: string; chapter: string }>>();
      for (const s of SUBJECTS) {
        const uncompleted = s.chapters
          .filter((ch) => !state.completed.includes(`${s.id}/${ch.id}`))
          .filter((ch) => !state.tasks.some((t) => !t.done && t.title.includes(ch.name)));
        if (uncompleted.length > 0) {
          subjectRemaining.set(
            s.id,
            uncompleted.map((ch) => ({ subjectId: s.id, chapter: ch.name })),
          );
        }
      }

      const remainingPool = Array.from(subjectRemaining.values());
      if (remainingPool.length === 0) {
        toast("All uncompleted chapters are already scheduled in your planner!", "info");
        return;
      }

      // Pick up to 10 chapters round-robin across subjects for a balanced study week
      const picks: Array<{ subjectId: string; chapter: string }> = [];
      let round = 0;
      while (picks.length < 10) {
        let addedThisRound = false;
        for (const list of remainingPool) {
          if (round < list.length && picks.length < 10) {
            picks.push(list[round]);
            addedThisRound = true;
          }
        }
        if (!addedThisRound) break;
        round++;
      }

      const tasks: PlannerTask[] = picks.map((p, i) => ({
        id: uid(),
        title: `Revise: ${p.chapter}`,
        subjectId: p.subjectId,
        date: addDays(Math.floor(i / 2)),
        priority: i < 3 ? "High" : i < 7 ? "Medium" : "Low",
        done: false,
      }));
      setState((prev) => ({ ...prev, tasks: [...prev.tasks, ...tasks] }));
      toast(`Planned ${tasks.length} chapters across the next 5 days`);
    },
    addResource: (r) => {
      setState((prev) => ({
        ...prev,
        custom: [
          { ...r, id: `custom-${uid()}`, addedAt: new Date().toISOString(), views: 0 },
          ...prev.custom,
        ],
      }));
      toast("Resource published to the directory");
    },
    updateResource: (id, r) => {
      setState((prev) => {
        const isCustom = prev.custom.some((c) => c.id === id);
        const nextRec = { ...prev.recOverride, [id]: r.recommended };
        if (isCustom) {
          return {
            ...prev,
            recOverride: nextRec,
            custom: prev.custom.map((c) => (c.id === id ? { ...r, id } : c)),
          };
        }
        return {
          ...prev,
          recOverride: nextRec,
          edited: { ...prev.edited, [id]: { ...r, id } },
        };
      });
      toast("Resource updated");
    },
    deleteResource: (id) => {
      setState((prev) => {
        const nextEdited = { ...prev.edited };
        delete nextEdited[id];
        const nextRec = { ...prev.recOverride };
        delete nextRec[id];
        return {
          ...prev,
          deleted: [...prev.deleted, id],
          edited: nextEdited,
          recOverride: nextRec,
          custom: prev.custom.filter((c) => c.id !== id),
          bookmarks: prev.bookmarks.filter((b) => b !== id),
          recent: prev.recent.filter((r) => r !== id),
        };
      });
      toast("Resource deleted", "danger");
    },
    toggleRecommended: (id) =>
      setState((prev) => {
        const current = resources.find((r) => r.id === id)?.recommended ?? false;
        toast(current ? "Removed from recommended" : "Marked as recommended");
        return { ...prev, recOverride: { ...prev.recOverride, [id]: !current } };
      }),
    reportBroken: (resourceId, resourceTitle, reason) => {
      sendWebhookEvent("broken_link_report", {
        resourceId,
        resourceTitle,
        reason,
      });
      setState((prev) => ({
        ...prev,
        reports: [
          { id: uid(), resourceId, resourceTitle, reason, date: todayISO(), resolved: false },
          ...prev.reports,
        ],
      }));
      toast("Report sent — thanks for flagging this", "info");
    },
    resolveReport: (id) => {
      setState((prev) => ({
        ...prev,
        reports: prev.reports.map((r) => (r.id === id ? { ...r, resolved: true } : r)),
      }));
      toast("Report marked as resolved");
    },
    login: (name, email) => {
      setState((prev) => ({ ...prev, user: { name, email } }));
      toast(`Welcome to the nest, ${name.split(" ")[0]}`);
    },
    logout: () => {
      setState((prev) => ({ ...prev, user: null }));
      toast("Signed out", "info");
    },
    mentorModalOpen,
    openMentorModal,
    closeMentorModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
