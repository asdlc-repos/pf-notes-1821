# Create notes

## Purpose

A member creates a note with a title and a body; the title is required.

## User Stories

- F2.1 As a member, I create a note by entering a title and a body.
- F2.2 As a member, I am told the title is required when I try to save a note without one.
- F2.3 As a member, I land on the new note, open to read, once it is created.
- F2.4 As a member, I see the new note in the team's list, with me as its author. Needs: F1.

## Decisions

- The title is required; the body is optional, so a note may have an empty body.
- A title holds up to 200 characters and a body up to 10,000.
- A new note is not pinned; pinning is separate (F3).

## Out of Scope

- Editing or deleting a note after it is created.