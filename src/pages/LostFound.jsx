import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Lost & Found — fully client-side, responsive, and interactive.
 *
 * Features
 * - Create Lost/Found posts with images (local preview)
 * - Search + filter (type, category, status, campus/location, date)
 * - Tabs: All, Lost, Found
 * - Mark as Claimed / Reopen
 * - Item detail drawer
 * - LocalStorage persistence
 * - Mobile-first, accessible, Tailwind CSS
 *
 * Integration
 * - Drop this file as: src/pages/LostFound.jsx (or any route)
 * - Ensure Tailwind is configured (your project already has tailwind.config.js)
 * - Add a route to this component in your router
 */

// ------- Small helpers -------
const cls = (...arr) => arr.filter(Boolean).join(" ");
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const STORAGE_KEY = "lostfound.items.v1";

const CATEGORIES = [
  "Electronics",
  "ID / Cards",
  "Books / Notes",
  "Clothing",
  "Accessories",
  "Bags",
  "Keys",
  "Other",
];

const LOCATIONS = [
  "Main Gate",
  "Library",
  "Cafeteria",
  "Hostel",
  "Lab Block",
  "Sports Complex",
  "Parking",
  "Other",
];

const SAMPLE = [
  {
    id: uid(),
    type: "Lost",
    title: "Black Lenovo backpack",
    description:
      "Contains a silver laptop and a Python notes notebook. Lost near the library steps.",
    category: "Bags",
    location: "Library",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    contactName: "Aman",
    contact: "+91-98XXXXXX01",
    status: "Open",
    image: "https://images.unsplash.com/photo-1592503254549-562a2b0630f1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: uid(),
    type: "Found",
    title: "Student ID Card: Priya S.",
    description:
      "Found near the cafeteria billing counter. Brown lanyard attached.",
    category: "ID / Cards",
    location: "Cafeteria",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    contactName: "Rohit",
    contact: "rohit@example.com",
    status: "Open",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: uid(),
    type: "Lost",
    title: "AirPods (Gen 2) in white case",
    description:
      "Missing after evening practice near Sports Complex. Case has a smiley sticker.",
    category: "Electronics",
    location: "Sports Complex",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    contactName: "Meera",
    contact: "@meera_ig",
    status: "Open",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
  },
];

// ------- Components -------
function Badge({ children, intent = "default" }) {
  const styles =
    intent === "success"
      ? "bg-green-100 text-green-700 border-green-200"
      : intent === "warning"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : intent === "info"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : intent === "danger"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={cls("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles)}>
      {children}
    </span>
  );
}

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    search: (
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
      />
    ),
    plus: (
      <path stroke="currentColor" strokeWidth="2" d="M12 5v14m7-7H5" strokeLinecap="round" />
    ),
    x: (
      <path stroke="currentColor" strokeWidth="2" d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
    ),
    filter: (
      <path stroke="currentColor" strokeWidth="2" d="M3 5h18M6 12h12M10 19h4" strokeLinecap="round" />
    ),
    check: <path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7" strokeLinecap="round" />,
    info: <path stroke="currentColor" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" strokeLinecap="round" />,
    calendar: (
      <path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" strokeLinecap="round" />
    ),
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {paths[name]}
    </svg>
  );
}

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200/70 dark:border-neutral-800">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close dialog">
              <Icon name="x" />
            </button>
          </div>
          <div className="px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
          <div className="px-4 sm:px-6 py-3 border-t border-neutral-200/70 dark:border-neutral-800 flex justify-end gap-3">{footer}</div>
        </div>
      </div>
    </div>
  );
}

function TextInput({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</span>
      <input
        {...props}
        className={cls(
          "mt-1 w-full rounded-xl border px-3 py-2 outline-none",
          "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900",
          "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
        )}
      />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</span>
      <select
        {...props}
        className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
      >
        <option value="">— Any —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</span>
      <textarea
        {...props}
        className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange, id }) {
  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cls(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"
        )}
      >
        <span
          className={cls(
            "inline-block h-5 w-5 transform rounded-full bg-white transition",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <label htmlFor={id} className="text-sm text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
    </div>
  );
}

// ------- Main Page -------
export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("All"); // All | Lost | Found
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(""); // Open | Claimed
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detail, setDetail] = useState(null);
  const [postOpen, setPostOpen] = useState(false);

  // Load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setItems(parsed);
        return;
      } catch {}
    }
    // Seed sample
    setItems(SAMPLE);
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filtered = useMemo(() => {
    return items
      .filter((it) => (tab === "All" ? true : it.type === tab))
      .filter((it) => (category ? it.category === category : true))
      .filter((it) => (status ? it.status === status : true))
      .filter((it) => (location ? it.location === location : true))
      .filter((it) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.location.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q)
        );
      })
      .filter((it) => {
        const t = new Date(it.date).getTime();
        const fromOk = dateFrom ? t >= new Date(dateFrom).getTime() : true;
        const toOk = dateTo ? t <= new Date(dateTo).getTime() : true;
        return fromOk && toOk;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [items, tab, query, category, status, location, dateFrom, dateTo]);

  const [page, setPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => setPage(1), [tab, query, category, status, location, dateFrom, dateTo]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200/70 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-blue-600 text-white grid place-items-center font-bold">LF</div>
              <div>
                <h1 className="text-lg font-semibold leading-tight">Lost & Found</h1>
                <p className="text-xs text-neutral-500">CollegeCart+</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPostOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Icon name="plus" /> New post
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Controls */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Find it fast. Return it faster.</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Search, filter, and post lost or found items across campus.</p>
            </div>
            <div className="flex items-center gap-2">
              {(["All", "Lost", "Found"]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cls(
                    "px-3.5 py-2 rounded-xl text-sm font-medium border",
                    t === tab
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                      : "bg-white/70 dark:bg-neutral-900/60 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, description, location, category..."
                  className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Icon name="search" />
                </div>
              </div>
            </div>
            <div>
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} />
            </div>
            <div>
              <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={["Open", "Claimed"]} />
            </div>
            <div>
              <Select label="Location" value={location} onChange={(e) => setLocation(e.target.value)} options={LOCATIONS} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 flex items-center gap-2"><Icon name="calendar" className="w-4 h-4" /> From</span>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 flex items-center gap-2"><Icon name="calendar" className="w-4 h-4" /> To</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
            </label>
            <div className="sm:col-span-2 flex items-end gap-2">
              <button onClick={() => setFiltersOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3.5 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <Icon name="filter" />
                Advanced
              </button>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("");
                  setStatus("");
                  setLocation("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3.5 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Reset
              </button>
            </div>
          </div>

          {filtersOpen && (
            <div className="mt-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 text-sm text-neutral-600 dark:text-neutral-300">
              Tip: Use precise titles like “Blue Dell laptop sleeve” and include a reachable contact. Mark items as “Claimed” once returned.
            </div>
          )}
        </div>
      </section>

      {/* Cards */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {visible.length === 0 ? (
          <EmptyState onNew={() => setPostOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {visible.map((it) => (
              <ItemCard key={it.id} item={it} onOpen={() => setDetail(it)} onToggleClaim={() => toggleClaim(items, setItems, it.id)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Detail Drawer */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title || "Item details"}
        footer={
          <>
            {detail && (
              <button
                onClick={() => {
                  toggleClaim(items, setItems, detail.id);
                  setDetail((d) => (d ? { ...d, status: d.status === "Open" ? "Claimed" : "Open" } : d));
                }}
                className={cls(
                  "rounded-xl px-4 py-2.5 text-sm font-semibold",
                  detail?.status === "Open"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                )}
              >
                {detail?.status === "Open" ? "Mark as Claimed" : "Reopen"}
              </button>
            )}
            <button onClick={() => setDetail(null)} className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-medium">
              Close
            </button>
          </>
        }
      >
        {detail && <DetailBody item={detail} />}
      </Modal>

      {/* New Post Modal */}
      <PostModal
        open={postOpen}
        onClose={() => setPostOpen(false)}
        onCreate={(payload) => {
          const next = [{ id: uid(), status: "Open", ...payload }, ...items];
          setItems(next);
          setPostOpen(false);
        }}
      />

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-center text-xs text-neutral-500">
        Built for CollegeCart+ • Your community returns items faster when posts are complete and accurate.
      </footer>
    </div>
  );
}

function ItemCard({ item, onOpen, onToggleClaim }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="h-full w-full grid place-items-center text-neutral-400 text-sm">No image</div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge intent={item.type === "Lost" ? "danger" : "info"}>{item.type}</Badge>
          <Badge>{item.category}</Badge>
        </div>
        {item.status === "Claimed" && (
          <div className="absolute right-0 top-0 m-3">
            <Badge intent="success">Claimed</Badge>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2">{item.title}</h3>
        </div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1">{item.location}</span>
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1">{new Date(item.date).toLocaleDateString()}</span>
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1">{item.contactName}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={onOpen} className="text-sm font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800">View</button>
          <button
            onClick={onToggleClaim}
            className={cls(
              "text-sm font-semibold rounded-xl px-3 py-2",
              item.status === "Open"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-amber-600 text-white hover:bg-amber-700"
            )}
          >
            {item.status === "Open" ? "Mark Claimed" : "Reopen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function toggleClaim(items, setItems, id) {
  const next = items.map((it) => (it.id === id ? { ...it, status: it.status === "Open" ? "Claimed" : "Open" } : it));
  setItems(next);
}

function DetailBody({ item }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="aspect-video w-full grid place-items-center text-neutral-400">No image</div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge intent={item.type === "Lost" ? "danger" : "info"}>{item.type}</Badge>
          <Badge>{item.category}</Badge>
          <Badge intent={item.status === "Open" ? "warning" : "success"}>{item.status}</Badge>
        </div>
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{item.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow label="Location" value={item.location} />
          <InfoRow label="Date" value={new Date(item.date).toLocaleString()} />
          <InfoRow label="Contact" value={item.contact} />
          <InfoRow label="Contact Name" value={item.contactName} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3">
      <div className="text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="text-sm font-medium">{value || "—"}</div>
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 grid place-items-center">
        <Icon name="info" />
      </div>
      <h3 className="mt-3 text-lg font-semibold">No items found</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Try adjusting filters or create a new post.</p>
      <button onClick={onNew} className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Create a post</button>
    </div>
  );
}

function PostModal({ open, onClose, onCreate }) {
  const [type, setType] = useState("Lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [contactName, setContactName] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef(null);

  function handleImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(f);
  }

  function submit() {
    if (!title.trim() || !description.trim() || !category || !location || !contactName.trim() || !contact.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    onCreate({ type, title, description, category, location, date: new Date(date).toISOString(), contactName, contact, image });
    // Reset minimal
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setContactName("");
    setContact("");
    setImage("");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a Lost/Found post"
      footer={
        <>
          <button onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Publish</button>
          <button onClick={onClose} className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-medium">Cancel</button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Type *" value={type} onChange={(e) => setType(e.target.value)} options={["Lost", "Found"]} />
        <Select label="Category *" value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} />
        <TextInput label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Black Lenovo backpack" />
        <TextInput label="Location *" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Library entrance" />
        <TextInput label="Contact Name *" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" />
        <TextInput label="Contact *" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone, email, or handle" />
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 flex items-center gap-2"><Icon name="calendar" className="w-4 h-4" /> Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
        </label>
        <div className="sm:col-span-2">
          <TextArea label="Description *" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item, distinctive marks, and where it was lost/found." />
        </div>
        <div className="sm:col-span-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Image (optional)</span>
          <div className="mt-1 flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200 dark:file:bg-neutral-800 dark:hover:file:bg-neutral-700" />
          </div>
          {image && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <img src={image} alt="Preview" className="w-full h-56 object-cover" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}