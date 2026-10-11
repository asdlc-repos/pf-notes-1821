# List and read notes

## Purpose

A signed-in member lists the team's notes and opens one to read it.

## User Stories

- F1.1 As a member, I see a list of all the team's notes, each row showing its title, author and created date.
- F1.2 As a member, I open a note from the list to read its title and full body.
- F1.3 As a member, I see an empty-list message when the team has no notes yet.

## Decisions

- Every note is visible to every member; there are no private notes.
- Notes that are not pinned are listed newest first; pinned notes come first (F3).
- The list shows every note on one page, with no search or filtering.

## Out of Scope

- Searching, filtering or paging the list.
- Editing or deleting notes.