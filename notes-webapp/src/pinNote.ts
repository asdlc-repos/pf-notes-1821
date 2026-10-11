import { notesApi } from "./api";
import type { components } from "./generated/notes-api";

type Note = components["schemas"]["Note"];

// Pins or unpins a note; resolves to the updated note, or null when the call failed.
export async function setPinned(id: string, pinned: boolean): Promise<Note | null> {
  const params = { params: { path: { noteId: id } } };
  try {
    const { data } = pinned
      ? await notesApi.PUT("/notes/{noteId}/pin", params)
      : await notesApi.DELETE("/notes/{noteId}/pin", params);
    return data ?? null;
  } catch {
    return null;
  }
}
