# Pin notes

## Purpose

A member marks a note as pinned, and pinned notes show first in the list.

Needs: F1.

## User Stories

- F3.1 As a member, I pin any note from the list or while reading it.
- F3.2 As a member, I unpin a pinned note.
- F3.3 As a member, I see pinned notes at the top of the list, newest first, marked as pinned.
- F3.4 As a member, I see which notes are pinned when reading a note.

## Decisions

- Any member may pin or unpin any note.
- A pin is shared: every member sees the same pinned notes.
- Pinned notes are ordered newest first among themselves, ahead of the unpinned notes (F1).
- There is no limit on how many notes can be pinned.

## Out of Scope

- Personal pins per member.