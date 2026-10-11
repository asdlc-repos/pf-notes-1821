# Domain model

Team Notes holds one entity: a note shared by the whole team. Members are people known to the identity provider, so only their id and display name are kept on the note.

```mermaid
erDiagram
    NOTE {
        uuid id PK
        string title "required, max 200"
        string body "optional, max 10000"
        string authorId "identity provider subject"
        string authorName "display name at creation"
        datetime createdAt
        boolean pinned "default false"
    }
```

- Every note is visible to every member; there are no private notes.
- List order: pinned notes first, then unpinned, each newest first by `createdAt`.