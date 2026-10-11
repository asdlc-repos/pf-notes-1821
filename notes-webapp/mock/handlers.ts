import { http, HttpResponse } from "msw";
import type { components } from "../src/generated/notes-api";

type Note = components["schemas"]["Note"];

// State lives in the page: any full page load re-runs this module and restores
// the seed rows below (the records of the prototype, mapped onto the schema).
// Only in-app navigation carries a change forward.
let notes: Note[] = [
  { id: "7c1f0a52-0000-4000-8000-000000000001", title: "Sprint 14 goals", body: "Ship the pin feature by Friday. Review the sign-in flow with the platform team.", authorName: "Dana Wijesinghe", createdAt: "2026-01-14T09:00:00Z", pinned: true },
  { id: "7c1f0a52-0000-4000-8000-000000000002", title: "Retro ideas", body: "Shorter standups. Rotate the facilitator each week.", authorName: "Priya Nair", createdAt: "2026-01-13T09:00:00Z", pinned: false },
  { id: "7c1f0a52-0000-4000-8000-000000000003", title: "Onboarding checklist", body: "Laptop, accounts, team intro, first-week buddy.", authorName: "Mark Fernando", createdAt: "2026-01-10T09:00:00Z", pinned: true },
  { id: "7c1f0a52-0000-4000-8000-000000000004", title: "Lunch spots near the office", body: "Bridge Cafe, Riverside Kitchen, Noodle House.", authorName: "Priya Nair", createdAt: "2026-01-08T09:00:00Z", pinned: false },
  { id: "7c1f0a52-0000-4000-8000-000000000005", title: "Release notes draft", body: "", authorName: "Dana Wijesinghe", createdAt: "2026-01-05T09:00:00Z", pinned: false },
];

function ordered(): Note[] {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
  });
}

const notFound = () => HttpResponse.json({ code: 404, message: "Not found" }, { status: 404 });

function setPinned(id: string, pinned: boolean) {
  const found = notes.find((n) => n.id === id);
  if (!found) return notFound();
  const updated = { ...found, pinned };
  notes = notes.map((n) => (n.id === id ? updated : n));
  return HttpResponse.json(updated);
}

// The gateway layer (mock/authz/gateway.ts) answers scope refusals before these run.
export const handlers = [
  http.get("/api/notes", () => {
    const data = ordered();
    return HttpResponse.json({ count: data.length, data });
  }),
  http.post("/api/notes", async ({ request }) => {
    const input = (await request.json()) as { title?: string; body?: string };
    const title = input?.title?.trim();
    if (!title || title.length > 200 || (input.body ?? "").length > 10000) {
      return HttpResponse.json({ code: 400, message: "Invalid note" }, { status: 400 });
    }
    const created: Note = {
      id: crypto.randomUUID(),
      title,
      body: input.body ?? "",
      authorName: "Mock Member",
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    notes = [...notes, created];
    return HttpResponse.json(created, { status: 201 });
  }),
  http.get("/api/notes/:noteId", ({ params }) => {
    const found = notes.find((n) => n.id === params.noteId);
    return found ? HttpResponse.json(found) : notFound();
  }),
  http.put("/api/notes/:noteId/pin", ({ params }) => setPinned(String(params.noteId), true)),
  http.delete("/api/notes/:noteId/pin", ({ params }) => setPinned(String(params.noteId), false)),
];
