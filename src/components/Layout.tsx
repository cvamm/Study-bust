import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileText,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Shield,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { getMentorEmail, sanitizeText } from "@/lib/security";
import { sendWebhookEvent } from "@/lib/webhook";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/subjects", label: "Subjects" },
  { to: "/pyq-papers", label: "PYQ Papers" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
];

const NOTIFICATIONS = [
  { icon: FileText, text: "New sample resources added for Physics & Chemistry", time: "2h ago", unread: true },
  { icon: CalendarDays, text: "CBSE 2025–26 sample papers released — links in the directory", time: "1d ago", unread: true },
  { icon: Sparkles, text: "AI Doubt Solver is coming soon — watch your dashboard", time: "3d ago", unread: false },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "focus-ring relative flex h-16 items-center rounded-sm px-3 text-sm font-bold transition-colors",
              isActive ? "text-navy-900" : "text-navy-500 hover:text-navy-900",
            )
          }
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive ? <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-gradient-to-r from-gold-300 to-gold-500" /> : null}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

export default function Layout() {
  const { user, logout, bookmarks, toasts, dismissToast, mentorModalOpen, openMentorModal, closeMentorModal } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifsViewed, setNotifsViewed] = useState(() => {
    return typeof window !== "undefined" && localStorage.getItem("studynest_notifs_viewed") === "true";
  });
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setBellOpen(false);
    setUserOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowBackToTop(window.scrollY > 350);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-inkline bg-white/95 shadow-[0_12px_32px_-20px_rgb(5_13_34/0.4)]"
            : "border-inkline/70 bg-white/85",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="StudyBust 12 home" className="focus-ring rounded-lg transition-transform duration-200 hover:scale-[1.02]">
              <Logo />
            </Link>
            <nav className="hidden items-center md:flex" aria-label="Primary">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            {/* notifications */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={bellOpen}
                onClick={() => {
                  setBellOpen((v) => {
                    const next = !v;
                    if (next && !notifsViewed) {
                      setNotifsViewed(true);
                      localStorage.setItem("studynest_notifs_viewed", "true");
                    }
                    return next;
                  });
                }}
                className="focus-ring relative rounded-lg p-2.5 text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
              >
                <Bell className="h-5 w-5" />
                {!notifsViewed && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-white" />
                )}
              </button>
              {bellOpen ? (
                <>
                  <button type="button" aria-label="Close notifications" className="fixed inset-0 z-40 cursor-default" onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-80 animate-fade-up overflow-hidden rounded-xl border border-inkline bg-white shadow-lift">
                    <div className="flex items-center justify-between border-b border-inkline bg-navy-50/60 px-4 py-3">
                      <p className="font-display text-sm font-bold text-navy-900">Updates</p>
                      <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-extrabold text-gold-700">DEMO</span>
                    </div>
                    <ul>
                      {NOTIFICATIONS.map((n, i) => (
                        <li key={i} className="flex gap-3 border-b border-inkline/70 px-4 py-3 transition-colors hover:bg-navy-50/50 last:border-0">
                          <n.icon className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                          <div>
                            <p className={cn("text-xs leading-relaxed", n.unread ? "font-bold text-navy-900" : "font-semibold text-navy-500")}>{n.text}</p>
                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-300">{n.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="bg-navy-50/60 px-4 py-2.5 text-[10.5px] font-semibold text-navy-400">
                      Real-time alerts for new resources & exam updates — coming soon.
                    </p>
                  </div>
                </>
              ) : null}
            </div>

            {/* 1-on-1 Mentor CTA */}
            <button
              type="button"
              onClick={openMentorModal}
              className="focus-ring hidden items-center gap-1.5 rounded-lg border border-gold-400/40 bg-gold-400/10 px-3 py-1.5 text-xs font-bold text-navy-900 transition-all hover:bg-gold-400/20 sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              <span>Mentor Session</span>
              <span className="rounded-full bg-gold-400/30 px-1.5 py-0.2 text-[10px] font-extrabold text-navy-950">₹100</span>
            </button>

            {/* bookmarks */}
            <Link
              to="/dashboard?tab=bookmarks"
              aria-label={`Saved resources (${bookmarks.length})`}
              className="focus-ring relative hidden rounded-lg p-2.5 text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900 sm:block"
            >
              <Bookmark className="h-5 w-5" />
              {bookmarks.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-navy-900 px-1 text-[9.5px] font-extrabold text-gold-300">
                  {bookmarks.length}
                </span>
              ) : null}
            </Link>

            {/* auth */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={userOpen}
                  onClick={() => setUserOpen((v) => !v)}
                  className="focus-ring flex items-center gap-2 rounded-lg border border-inkline bg-white py-1.5 pl-1.5 pr-2.5 transition-all hover:border-navy-200 hover:bg-navy-50 hover:shadow-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-b from-navy-800 to-navy-950 font-display text-xs font-bold text-gold-300">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-24 truncate text-sm font-bold text-navy-800 lg:block">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-navy-400" />
                </button>
                {userOpen ? (
                  <>
                    <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setUserOpen(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-56 animate-fade-up overflow-hidden rounded-xl border border-inkline bg-white py-1.5 shadow-lift">
                      <div className="border-b border-inkline px-4 py-2.5">
                        <p className="truncate text-sm font-bold text-navy-900">{user.name}</p>
                        <p className="truncate text-xs text-navy-400">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50">
                        <LayoutDashboard className="h-4 w-4 text-navy-400" /> Study dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <Link to="/auth" className="focus-ring hidden items-center gap-1.5 rounded-lg bg-gradient-to-b from-navy-800 to-navy-950 px-4 py-2 text-sm font-extrabold text-white transition-all hover:from-navy-700 hover:to-navy-900 hover:shadow-md sm:inline-flex">
                <UserRound className="h-4 w-4" />
                Sign in
              </Link>
            )}

            {/* mobile toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="focus-ring rounded-lg p-2.5 text-navy-600 transition-colors hover:bg-navy-50 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <>
            <button
              type="button"
              aria-label="Close navigation drawer"
              className="fixed inset-0 top-16 z-30 cursor-default bg-navy-950/40 backdrop-blur-xs transition-opacity md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-40 animate-fade-up border-t border-inkline bg-white px-4 pb-5 pt-2 shadow-xl md:hidden">
              <div className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "rounded-lg px-3 py-2.5 text-sm font-bold",
                        isActive ? "bg-navy-50 text-navy-900" : "text-navy-500",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-3 flex gap-2 border-t border-inkline pt-4">
                {user ? (
                  <Link to="/dashboard" className="btn-navy flex-1">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                ) : (
                  <Link to="/auth" className="btn-navy flex-1">
                    <UserRound className="h-4 w-4" /> Sign in
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openMentorModal();
                  }}
                  className="btn-gold mt-3 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Book Mentor Session (₹100)</span>
                </button>
              </div>
            </div>
          </>
        ) : null}
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />

      {/* Global Mentor Session Modal */}
      <MentorModal isOpen={mentorModalOpen} onClose={closeMentorModal} />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="focus-ring fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-navy-700/60 bg-navy-900/90 text-gold-300 shadow-lift backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-navy-800 active:scale-95 sm:bottom-6 sm:right-6 md:h-12 md:w-12"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-inkline bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-10px_rgb(5_13_34/0.15)] backdrop-blur-md md:hidden"
      >
        <div className="flex h-16 items-center justify-around px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-bold transition-all active:scale-90",
                isActive ? "text-navy-900" : "text-navy-400 hover:text-navy-700"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Home className={cn("h-5 w-5 transition-transform", isActive && "scale-110 text-gold-500")} />
                  {isActive && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />}
                </div>
                <span className="mt-1 tracking-tight">Home</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/subjects"
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-bold transition-all active:scale-90",
                isActive ? "text-navy-900" : "text-navy-400 hover:text-navy-700"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <BookOpen className={cn("h-5 w-5 transition-transform", isActive && "scale-110 text-gold-500")} />
                  {isActive && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />}
                </div>
                <span className="mt-1 tracking-tight">Subjects</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/pyq-papers"
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-bold transition-all active:scale-90",
                isActive ? "text-navy-900" : "text-navy-400 hover:text-navy-700"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <FileCheck2 className={cn("h-5 w-5 transition-transform", isActive && "scale-110 text-gold-500")} />
                  {isActive && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />}
                </div>
                <span className="mt-1 tracking-tight">PYQs</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/resources"
            end
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-bold transition-all active:scale-90",
                isActive ? "text-navy-900" : "text-navy-400 hover:text-navy-700"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Layers className={cn("h-5 w-5 transition-transform", isActive && "scale-110 text-gold-500")} />
                  {isActive && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />}
                </div>
                <span className="mt-1 tracking-tight">Resources</span>
              </>
            )}
          </NavLink>

          <NavLink
            to={user ? "/dashboard" : "/dashboard?tab=bookmarks"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-bold transition-all active:scale-90",
                isActive ? "text-navy-900" : "text-navy-400 hover:text-navy-700"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {user ? (
                    <LayoutDashboard className={cn("h-5 w-5 transition-transform", isActive && "scale-110 text-gold-500")} />
                  ) : (
                    <Bookmark className={cn("h-5 w-5 transition-transform", isActive && "scale-110 text-gold-500")} />
                  )}
                  {bookmarks.length > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-extrabold text-navy-950">
                      {bookmarks.length}
                    </span>
                  )}
                  {isActive && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />}
                </div>
                <span className="mt-1 tracking-tight">{user ? "Study" : "Saved"}</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* toast viewport */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-20 sm:bottom-5 right-5 z-[70] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex animate-fade-up items-start gap-2.5 rounded-xl border border-navy-700 bg-navy-900 px-4 py-3 shadow-lift">
            {t.tone === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> : null}
            {t.tone === "info" ? <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" /> : null}
            {t.tone === "danger" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> : null}
            <p className="flex-1 text-[13px] font-semibold leading-snug text-navy-50">{t.message}</p>
            <button type="button" aria-label="Dismiss" onClick={() => dismissToast(t.id)} className="focus-ring rounded p-0.5 text-navy-300 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const { toast, openMentorModal } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast("Enter a valid email to subscribe", "danger");
      return;
    }
    try {
      const existing: string[] = JSON.parse(localStorage.getItem("studynest_subscribers") || "[]");
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem("studynest_subscribers", JSON.stringify(existing));
      }
    } catch {
      // ignore storage errors
    }

    sendWebhookEvent("newsletter_subscription", {
      email: email.trim(),
    });

    setEmail("");
    setSubscribed(true);
    toast("Subscribed! We'll alert you on major exam & board updates.");
  };

  const explore: FooterLinkItem[] = [
    { to: "/", label: "Home" },
    { to: "/subjects", label: "Browse subjects" },
    { to: "/resources", label: "Resource directory" },
    { to: "/dashboard", label: "Study dashboard" },
    { to: "/about", label: "About StudyBust 12" },
    {
      label: "Mentor session with me",
      badge: "₹100",
      onClick: openMentorModal,
    },
  ];
  const subjects: FooterLinkItem[] = [
    { to: "/subjects/phy", label: "Physics" },
    { to: "/subjects/chem", label: "Chemistry" },
    { to: "/subjects/math", label: "Mathematics" },
    { to: "/subjects/bio", label: "Biology" },
    { to: "/subjects/acc", label: "Accountancy" },
    { to: "/subjects/cs", label: "Computer Science" },
  ];
  const quick: FooterLinkItem[] = [
    { to: "/pyq-papers", label: "CBSE Board Papers (2015–2026)" },
    { to: "/resources?types=pyq", label: "Previous Year Questions" },
    { to: "/resources?types=sample-papers", label: "Sample Papers" },
    { to: "/resources?types=one-shot", label: "One-Shot Revision" },
    { to: "/resources?types=notes", label: "Notes & Study Material" },
    { to: "/resources?types=mock-tests", label: "Mock Tests" },
    { to: "/resources?types=important-questions", label: "Important Questions" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-navy-950 text-navy-200">
      <div className="bg-hero-grid absolute inset-0" aria-hidden="true" />
      <p
        className="text-outline-light pointer-events-none absolute -bottom-10 left-1/2 w-full -translate-x-1/2 select-none whitespace-nowrap text-center font-display text-[9rem] font-extrabold leading-none tracking-tight lg:text-[12rem]"
        aria-hidden="true"
      >
        STUDYBUST 12
      </p>

      <div className="container-x relative grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <Link to="/" className="focus-ring inline-block rounded-lg">
            <Logo dark size="lg" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
            Lectures, notes, PYQs, sample papers and revision material for CBSE Class 12 —
            aggregated from across the web and organised by subject and chapter.
          </p>

          <form onSubmit={subscribe} className="mt-6 max-w-sm">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold-300">New resources & exam updates</p>
            <div className="mt-2.5 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com (alerts coming soon)"
                aria-label="Email for updates"
                className="w-full rounded-lg border border-navy-700 bg-navy-900/80 px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-navy-400 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
              <button type="submit" className="focus-ring btn-gold shrink-0 px-4" title="Notify me when ready">
                {subscribed ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
            {subscribed ? (
              <p className="mt-1.5 text-[11px] font-semibold text-emerald-400">
                ✓ Noted! Real email alerts are coming soon — your address is saved locally for now.
              </p>
            ) : null}
          </form>

          <div className="mt-6 inline-flex items-start gap-2 rounded-lg border border-navy-800 bg-navy-900/80 px-3.5 py-2.5">
            <p className="text-[11px] font-semibold leading-relaxed text-navy-300">
              <span className="font-extrabold text-gold-300">Demo notice:</span> the directory currently
              holds sample data. External links open official sites or topic searches until curation is done.
            </p>
          </div>
        </div>
        <FooterCol title="Explore" links={explore} />
        <FooterCol title="Popular subjects" links={subjects} />
        <FooterCol title="Quick resources" links={quick} />
      </div>
      <div className="relative border-t border-navy-800/80">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs font-semibold text-navy-400 md:flex-row">
          <p>© 2026 StudyBust 12. Built for CBSE Class 12 students.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-navy-300">
            <span>Developed by <strong className="font-bold text-white">Shivam Shukla</strong></span>
            <span className="text-navy-600">|</span>
            <a
              href="mailto:cvamm69@gmail.com"
              className="inline-flex items-center gap-1.5 text-gold-300 transition-colors hover:text-gold-200 hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>cvamm69@gmail.com</span>
            </a>
          </div>
          <p>Independent study tool — not affiliated with CBSE or NCERT.</p>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkItem {
  to?: string;
  label: string;
  badge?: string;
  onClick?: () => void;
}

function FooterCol({ title, links }: { title: string; links: FooterLinkItem[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-gold-300">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.onClick ? (
              <button
                type="button"
                onClick={l.onClick}
                className="focus-ring group inline-flex items-center gap-1.5 rounded-sm text-left text-sm font-semibold text-navy-300 transition-colors hover:text-white"
              >
                <span className="h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-3" aria-hidden="true" />
                <span>{l.label}</span>
                {l.badge ? (
                  <span className="rounded-full border border-gold-400/40 bg-gold-400/15 px-2 py-0.5 text-[10px] font-extrabold text-gold-300">
                    {l.badge}
                  </span>
                ) : null}
              </button>
            ) : (
              <Link to={l.to ?? "/"} className="focus-ring group inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-navy-300 transition-colors hover:text-white">
                <span className="h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-3" aria-hidden="true" />
                <span>{l.label}</span>
                {l.badge ? (
                  <span className="rounded-full border border-gold-400/40 bg-gold-400/15 px-2 py-0.5 text-[10px] font-extrabold text-gold-300">
                    {l.badge}
                  </span>
                ) : null}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MentorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast, user } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);
    const cleanPhone = sanitizeText(phone);
    const cleanSubject = sanitizeText(subject);
    const cleanReason = sanitizeText(reason);

    if (!cleanName) {
      toast("Please enter your name", "danger");
      return;
    }
    if (!cleanEmail) {
      toast("Please enter your email", "danger");
      return;
    }
    if (!cleanPhone) {
      toast("Please enter your phone number", "danger");
      return;
    }
    if (!cleanSubject) {
      toast("Please enter the subject", "danger");
      return;
    }
    if (!cleanReason) {
      toast("Please enter the reason for booking", "danger");
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await sendWebhookEvent("mentorship_session_booking", {
        name: cleanName,
        email: cleanEmail,
        phone_no: cleanPhone,
        phone: cleanPhone,
        subject: cleanSubject,
        reason: cleanReason,
        fee: "₹100",
        amount: 100,
        currency: "INR",
        session_type: "1-on-1 Mentorship (30 mins)",
        date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      });

      setSubmitted(true);
      if (ok) {
        toast("Mentorship request received! Shivam Shukla will contact you shortly to schedule your slot.", "success");
      } else {
        toast("Mentorship request saved! Shivam Shukla will reach out shortly.", "success");
      }
    } catch {
      setSubmitted(true);
      toast("Mentorship request saved! Shivam Shukla will reach out shortly.", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity" onClick={handleClose} />
      <div className="relative w-full max-w-lg animate-fade-up overflow-hidden rounded-2xl border border-navy-700 bg-navy-900 p-6 text-white shadow-lift sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-300 ring-1 ring-gold-400/40">
              <Sparkles className="h-5.5 w-5.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-gold-400/30 bg-gold-400/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gold-300">
                  1-on-1 Mentorship
                </span>
                <span className="font-display text-sm font-extrabold text-gold-300">₹100 / session</span>
              </div>
              <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Mentor Session with Shivam
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="focus-ring rounded-lg p-1.5 text-navy-400 hover:bg-navy-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="my-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-5 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
            <h4 className="mt-3 font-display text-lg font-bold text-emerald-200">Session Request Received!</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-emerald-300/90">
              Thank you for booking! Shivam Shukla will contact you at <strong className="text-white">{email || phone}</strong> to confirm your slot and send Google Meet link.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${getMentorEmail()}?subject=Class 12 Mentorship Session (₹100)&body=Hi Shivam, I have booked a 1-on-1 mentorship session for ₹100.%0D%0AName: ${encodeURIComponent(sanitizeText(name))}%0D%0AEmail: ${encodeURIComponent(sanitizeText(email))}%0D%0APhone: ${encodeURIComponent(sanitizeText(phone))}%0D%0ASubject: ${encodeURIComponent(sanitizeText(subject))}%0D%0AReason: ${encodeURIComponent(sanitizeText(reason))}`}
                className="btn-gold text-xs"
              >
                <Mail className="h-3.5 w-3.5" /> Email Directly
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="btn-ghost border border-navy-700 text-xs text-white hover:bg-navy-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-3 text-xs leading-relaxed text-navy-300">
              Get direct 1-on-1 strategic guidance on CBSE Class 12 board preparations, time management, backlog clearing, and PYQ solving tactics.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-300">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="mt-1 w-full rounded-lg border border-navy-700 bg-navy-950/90 px-3 py-2 text-xs font-semibold text-white placeholder:text-navy-500 focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-300">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="mt-1 w-full rounded-lg border border-navy-700 bg-navy-950/90 px-3 py-2 text-xs font-semibold text-white placeholder:text-navy-500 focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-300">Phone No</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-lg border border-navy-700 bg-navy-950/90 px-3 py-2 text-xs font-semibold text-white placeholder:text-navy-500 focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-300">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Physics, Chemistry, Maths"
                    className="mt-1 w-full rounded-lg border border-navy-700 bg-navy-950/90 px-3 py-2 text-xs font-semibold text-white placeholder:text-navy-500 focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-300">Reason</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Backlog in organic chemistry, need timetable & PYQ strategy..."
                  className="mt-1 w-full rounded-lg border border-navy-700 bg-navy-950/90 px-3 py-2 text-xs font-semibold text-white placeholder:text-navy-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-navy-300">
                  Fee: <strong className="font-extrabold text-gold-300 text-sm">₹100</strong> (pay via UPI upon slot confirmation)
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold flex items-center gap-2 px-5 py-2 text-xs font-extrabold disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-navy-950 border-t-transparent" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Book Session (₹100)</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
