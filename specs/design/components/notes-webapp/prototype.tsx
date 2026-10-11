import type { ReactNode } from "react";
import {
  Alert, AppShell, Breadcrumbs, Button, Detail, EmptyState, Field, Form, Heading, Section, Screen, Table, Text,
  ValidationSummary, defineApp, useCollection, useDisplayState, useNav, useParams,
} from "@wso2/prototype-kit";

interface Note {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  pinned: boolean;
}

const notes: Note[] = [
  { id: "note-1", title: "Sprint 14 goals", body: "Ship the pin feature by Friday. Review the sign-in flow with the platform team.", author: "Dana Wijesinghe", createdAt: "2026-01-14", pinned: true },
  { id: "note-2", title: "Retro ideas", body: "Shorter standups. Rotate the facilitator each week.", author: "Priya Nair", createdAt: "2026-01-13", pinned: false },
  { id: "note-3", title: "Onboarding checklist", body: "Laptop, accounts, team intro, first-week buddy.", author: "Mark Fernando", createdAt: "2026-01-10", pinned: true },
  { id: "note-4", title: "Lunch spots near the office", body: "Bridge Cafe, Riverside Kitchen, Noodle House.", author: "Priya Nair", createdAt: "2026-01-08", pinned: false },
  { id: "note-5", title: "Release notes draft", body: "", author: "Dana Wijesinghe", createdAt: "2026-01-05", pinned: false },
];

const user = { name: "Mark Fernando", email: "mark@team.example" };

function ordered(items: readonly Note[]): Note[] {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
  });
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      id="shell"
      user={user}
      nav={[{ id: "nav.notes", label: "Notes", to: "screen.notes" }]}
      account="screen.account"
      settings="screen.settings"
      signOut="screen.signed-out"
    >
      {children}
    </AppShell>
  );
}

function Notes() {
  const state = useDisplayState();
  const all = useCollection<Note>("notes");
  const items = state === "state.empty" ? [] : ordered(all.items);
  return (
    <Shell>
      <Heading id="heading.notes" text="Team notes" />
      {state === "state.failed" && (
        <Alert id="alert.notes-failed" tone="error" title="Notes unavailable" text="The notes could not be loaded. Try again in a few minutes." />
      )}
      <Section
        id="section.notes"
        title="Notes"
        count={items.length}
        subtitle="Pinned notes first, then newest first."
        actions={<Button id="btn.new-note" label="New note" emphasis="primary" to="screen.new-note" />}
      >
        <Table
          id="table.notes"
          columns={["Title", "Author", "Created", { label: "Pinned", kind: "status" }]}
          rows={items.map((n) => ({
            id: `note.${n.id}`,
            cells: [n.title, n.author, n.createdAt],
            status: n.pinned ? { text: "Pinned", tone: "info" } : { text: "Not pinned", tone: "default" },
            to: "screen.note",
            params: { note: n.id },
            actions: [
              {
                id: `note.${n.id}.pin`,
                label: n.pinned ? "Unpin" : "Pin",
                onPress: () => all.update(n.id, { pinned: !n.pinned }),
              },
            ],
          }))}
          empty={
            <EmptyState
              id="empty.notes"
              title="No notes yet"
              text="Create the team's first note."
              actions={<Button id="btn.empty-new-note" label="New note" emphasis="primary" to="screen.new-note" />}
            />
          }
        />
      </Section>
    </Shell>
  );
}

function NoteView() {
  const { note: id } = useParams();
  const all = useCollection<Note>("notes");
  const note = (id ? all.get(id) : undefined) ?? ordered(all.items)[0]!;
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.note"
        items={[
          { id: "crumb.notes", label: "Notes", to: "screen.notes" },
          { id: "crumb.note", label: note.title },
        ]}
      />
      <Heading
        id="heading.note"
        text={note.title}
        actions={
          <Button
            id="btn.toggle-pin"
            label={note.pinned ? "Unpin" : "Pin"}
            onPress={() => all.update(note.id, { pinned: !note.pinned })}
          />
        }
      />
      <Detail
        id="detail.note"
        fields={[
          { label: "Author", value: note.author },
          { label: "Created", value: note.createdAt },
          { label: "Pinned", value: note.pinned ? "Pinned" : "Not pinned" },
        ]}
      />
      <Section id="section.body" title="Note">
        <Text id="text.body" text={note.body === "" ? "This note has no body." : note.body} tone="primary" />
      </Section>
    </Shell>
  );
}

function NewNote() {
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Note>("notes");
  const showError = state === "state.validation-error";
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.new"
        items={[
          { id: "crumb.new-notes", label: "Notes", to: "screen.notes" },
          { id: "crumb.new-note", label: "New note" },
        ]}
      />
      <Heading id="heading.new-note" text="New note" />
      {showError && <ValidationSummary id="summary.new-note" issues={["Title is required"]} />}
      <Form
        id="form.new-note"
        onSubmit={(values) => {
          const id = all.create({
            title: values.title ?? "",
            body: values.body ?? "",
            author: user.name,
            createdAt: "2026-01-15",
            pinned: false,
          });
          navigate.go("screen.note", { note: id });
        }}
        actions={
          <>
            <Button id="btn.cancel" label="Cancel" to="screen.notes" />
            <Button id="btn.save-note" label="Create note" emphasis="primary" submit />
          </>
        }
      >
        <Field
          id="field.title"
          name="title"
          label="Title"
          required
          pattern="^.{1,200}$"
          patternMessage="Title can be at most 200 characters"
          error={showError ? "Title is required" : undefined}
        />
        <Field
          id="field.body"
          name="body"
          label="Body"
          type="textarea"
          pattern="[\s\S]{0,10000}"
          patternMessage="Body can be at most 10,000 characters"
        />
      </Form>
    </Shell>
  );
}

function Account() {
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail
        id="detail.account"
        fields={[
          { label: "Name", value: user.name },
          { label: "Email", value: user.email },
          { label: "Role", value: "Member" },
        ]}
      />
    </Shell>
  );
}

function Settings() {
  const navigate = useNav();
  return (
    <Shell>
      <Heading id="heading.settings" text="Settings" />
      <Form
        id="form.settings"
        onSubmit={() => navigate.go("screen.notes")}
        actions={<Button id="btn.save-settings" label="Save settings" emphasis="primary" submit />}
      >
        <Field id="field.compact" label="Compact list rows" type="switch" defaultValue="off" />
      </Form>
    </Shell>
  );
}

function SignedOut() {
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to="screen.notes" />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.notes": Notes,
    "screen.note": NoteView,
    "screen.new-note": NewNote,
    "screen.account": Account,
    "screen.settings": Settings,
    "screen.signed-out": SignedOut,
  },
  data: { notes },
});
