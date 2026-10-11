import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  ListingTable,
  PageContent,
  PageTitle,
  Stack,
  Typography,
} from "@wso2/oxygen-ui";
import { notesApi } from "../api";
import type { components } from "../generated/notes-api";
import { formatDate } from "../format";
import { setPinned } from "../pinNote";
import { Can } from "../authz/gates";

type Note = components["schemas"]["Note"];

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; notes: Note[] };

export function NotesPage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    notesApi
      .GET("/notes")
      .then(({ data }) => {
        if (cancelled) return;
        setState(data ? { kind: "ready", notes: data.data } : { kind: "error" });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const [pinError, setPinError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function togglePin(n: Note) {
    setBusyId(n.id);
    setPinError(false);
    const updated = await setPinned(n.id, !n.pinned);
    setBusyId(null);
    if (!updated) {
      setPinError(true);
      return;
    }
    // Pinned first, then newest first: reload to take the server's order.
    setAttempt((a) => a + 1);
  }

  const notes = state.kind === "ready" ? state.notes : [];
  const newNote = (
    <Button variant="contained" onClick={() => navigate("/notes/new")}>
      New note
    </Button>
  );

  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>Team notes</PageTitle.Header>
        <PageTitle.Actions>{newNote}</PageTitle.Actions>
      </PageTitle>

      {state.kind === "error" && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setAttempt((n) => n + 1)}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Notes unavailable</AlertTitle>
          The notes could not be loaded. Try again in a few minutes.
        </Alert>
      )}

      {pinError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPinError(false)}>
          <AlertTitle>Pin failed</AlertTitle>
          The note could not be pinned or unpinned. Try again.
        </Alert>
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6">Notes</Typography>
        {state.kind === "ready" && <Chip size="small" label={notes.length} />}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Pinned notes first, then newest first.
      </Typography>

      {state.kind === "loading" ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading notes…</Typography>
        </Box>
      ) : (
        <ListingTable.Container>
          <ListingTable>
            <ListingTable.Head>
              <ListingTable.Row>
                <ListingTable.Cell>Title</ListingTable.Cell>
                <ListingTable.Cell>Author</ListingTable.Cell>
                <ListingTable.Cell>Created</ListingTable.Cell>
                <ListingTable.Cell>Pinned</ListingTable.Cell>
                <ListingTable.Cell align="right">Actions</ListingTable.Cell>
              </ListingTable.Row>
            </ListingTable.Head>
            <ListingTable.Body>
              {state.kind === "ready" && notes.length === 0 && (
                <ListingTable.Row>
                  <ListingTable.Cell colSpan={5}>
                    <Card variant="outlined">
                      <ListingTable.EmptyState
                        title="No notes yet"
                        description="Create the team's first note."
                        action={newNote}
                      />
                    </Card>
                  </ListingTable.Cell>
                </ListingTable.Row>
              )}
              {notes.map((n) => (
                <ListingTable.Row key={n.id} clickable onClick={() => navigate(`/notes/${n.id}`)}>
                  <ListingTable.Cell>{n.title}</ListingTable.Cell>
                  <ListingTable.Cell>{n.authorName}</ListingTable.Cell>
                  <ListingTable.Cell>{formatDate(n.createdAt)}</ListingTable.Cell>
                  <ListingTable.Cell>
                    <Chip
                      size="small"
                      label={n.pinned ? "Pinned" : "Not pinned"}
                      color={n.pinned ? "info" : "default"}
                      variant={n.pinned ? "filled" : "outlined"}
                    />
                  </ListingTable.Cell>
                  <ListingTable.Cell align="right" onClick={(e) => e.stopPropagation()}>
                    <Can op="PUT /notes/{noteId}/pin">
                      <Button
                        size="small"
                        variant="text"
                        disabled={busyId === n.id}
                        onClick={() => void togglePin(n)}
                      >
                        {n.pinned ? "Unpin" : "Pin"}
                      </Button>
                    </Can>
                  </ListingTable.Cell>
                </ListingTable.Row>
              ))}
            </ListingTable.Body>
          </ListingTable>
        </ListingTable.Container>
      )}
    </PageContent>
  );
}
