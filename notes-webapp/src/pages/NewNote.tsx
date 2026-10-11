import { useState, type FormEvent, type ReactElement } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  Link,
  PageContent,
  PageTitle,
  Stack,
  TextField,
  Typography,
} from "@wso2/oxygen-ui";
import { notesApi } from "../api";

const TITLE_MAX = 200;
const BODY_MAX = 10000;

type Failure = { kind: "validation"; message: string } | { kind: "failed" } | null;

export function NewNotePage(): ReactElement {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);

  const titleError =
    title.trim() === ""
      ? "title required"
      : title.length > TITLE_MAX
        ? `Title can be at most ${TITLE_MAX} characters`
        : null;
  const bodyError = body.length > BODY_MAX ? "Body can be at most 10,000 characters" : null;

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setSubmitted(true);
    setFailure(null);
    if (titleError || bodyError) return;
    setSaving(true);
    try {
      const { data, response } = await notesApi.POST("/notes", {
        body: { title: title.trim(), body },
      });
      if (data) {
        navigate(`/notes/${data.id}`);
        return;
      }
      setFailure(
        response.status === 400
          ? { kind: "validation", message: "The title is missing or a field is too long." }
          : { kind: "failed" },
      );
    } catch {
      setFailure({ kind: "failed" });
    } finally {
      setSaving(false);
    }
  }

  const showTitleError = submitted && titleError !== null;
  const showBodyError = bodyError !== null;

  return (
    <PageContent>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/notes" underline="hover" color="inherit">
          Notes
        </Link>
        <Typography color="text.primary">New note</Typography>
      </Breadcrumbs>
      <PageTitle>
        <PageTitle.Header>New note</PageTitle.Header>
      </PageTitle>

      {(showTitleError || failure?.kind === "validation") && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>The note was not saved</AlertTitle>
          {failure?.kind === "validation" ? failure.message : titleError}
        </Alert>
      )}
      {failure?.kind === "failed" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Note not saved</AlertTitle>
          Something went wrong while saving. Your text is kept; try again.
        </Alert>
      )}

      <Card variant="outlined">
        <CardHeader title="Note" />
        <CardContent>
          <Box component="form" onSubmit={onSubmit} noValidate>
            <Form.Section>
              <Form.Stack spacing={2}>
                <TextField
                  label="Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={showTitleError}
                  helperText={showTitleError ? titleError : undefined}
                  fullWidth
                />
                <TextField
                  label="Body"
                  multiline
                  minRows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  error={showBodyError}
                  helperText={showBodyError ? bodyError : undefined}
                  fullWidth
                />
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" onClick={() => navigate("/notes")} disabled={saving}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? "Creating…" : "Create note"}
                  </Button>
                </Stack>
              </Form.Stack>
            </Form.Section>
          </Box>
        </CardContent>
      </Card>
    </PageContent>
  );
}
