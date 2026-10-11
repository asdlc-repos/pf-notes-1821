import { useEffect, useState, type ReactElement } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  Link,
  PageContent,
  PageTitle,
  Typography,
} from "@wso2/oxygen-ui";
import { notesApi } from "../api";
import type { components } from "../generated/notes-api";
import { formatDate } from "../format";

type Note = components["schemas"]["Note"];

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "not-found" }
  | { kind: "ready"; note: Note };

export function NotePage(): ReactElement {
  const { note: id } = useParams();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) {
      setState({ kind: "not-found" });
      return;
    }
    let cancelled = false;
    setState({ kind: "loading" });
    notesApi
      .GET("/notes/{noteId}", { params: { path: { noteId: id } } })
      .then(({ data, response }) => {
        if (cancelled) return;
        if (data) setState({ kind: "ready", note: data });
        else setState({ kind: response.status === 404 ? "not-found" : "error" });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const note = state.kind === "ready" ? state.note : null;

  return (
    <PageContent>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/notes" underline="hover" color="inherit">
          Notes
        </Link>
        {note && <Typography color="text.primary">{note.title}</Typography>}
      </Breadcrumbs>

      {state.kind === "loading" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading note…</Typography>
        </Box>
      )}

      {state.kind === "error" && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => setAttempt((n) => n + 1)}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Note unavailable</AlertTitle>
          The note could not be loaded. Try again in a few minutes.
        </Alert>
      )}

      {state.kind === "not-found" && (
        <Alert severity="warning">
          <AlertTitle>Note not found</AlertTitle>
          This note does not exist. It may have been removed.
        </Alert>
      )}

      {note && (
        <>
          <PageTitle>
            <PageTitle.Header>{note.title}</PageTitle.Header>
          </PageTitle>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardHeader title="Details" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="overline" color="text.secondary">
                    Author
                  </Typography>
                  <Typography variant="body2">{note.authorName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="overline" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">{formatDate(note.createdAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="overline" color="text.secondary">
                    Pinned
                  </Typography>
                  <Box>
                    <Chip
                      size="small"
                      label={note.pinned ? "Pinned" : "Not pinned"}
                      color={note.pinned ? "info" : "default"}
                      variant={note.pinned ? "filled" : "outlined"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Note
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {note.body === "" ? "This note has no body." : note.body}
          </Typography>
        </>
      )}
    </PageContent>
  );
}
