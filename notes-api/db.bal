import ballerina/log;
import ballerina/sql;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

postgresql:Client? dbHandle = ();

function valueOr(string value, string fallback) returns string {
    return value == "" ? fallback : value;
}

// Opens the pool on first use so the service starts even when the database is not reachable yet.
function getDb() returns postgresql:Client|error {
    postgresql:Client? current = dbHandle;
    if current is postgresql:Client {
        return current;
    }
    int port = check int:fromString(valueOr(dbPort, "5432"));
    postgresql:Client created = check new (
        host = valueOr(dbHost, "localhost"),
        username = valueOr(dbUser, "postgres"),
        password = dbPassword,
        database = valueOr(dbName, "appdb"),
        port = port
    );
    dbHandle = created;
    return created;
}

function migrate() returns error? {
    postgresql:Client db = check getDb();
    sql:ExecutionResult _ = check db->execute(`
        CREATE TABLE IF NOT EXISTS notes (
            id UUID PRIMARY KEY,
            title TEXT NOT NULL,
            body TEXT NOT NULL DEFAULT '',
            author_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            pinned BOOLEAN NOT NULL DEFAULT FALSE
        )`);
}

function runMigration() returns () {
    error? result = migrate();
    if result is error {
        log:printError("notes table migration failed; will retry on next start", 'error = result);
        return;
    }
    log:printInfo("notes table ready");
}

final () dbReady = runMigration();

// Returns a ready client, creating the notes table if the startup migration did not run.
function getReadyDb() returns postgresql:Client|error {
    postgresql:Client db = check getDb();
    error? ensured = migrate();
    if ensured is error {
        return ensured;
    }
    return db;
}

function fetchNotes() returns Note[]|error {
    postgresql:Client db = check getReadyDb();
    sql:ParameterizedQuery q = `SELECT id::text AS id, title, body, author_name AS "authorName",
        to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt", pinned
        FROM notes ORDER BY pinned DESC, created_at DESC, id`;
    stream<Note, sql:Error?> rows = db->query(q);
    Note[] notes = check from Note n in rows
        select n;
    return notes;
}

// Returns () when no note has this id.
function fetchNote(string id) returns Note?|error {
    postgresql:Client db = check getReadyDb();
    sql:ParameterizedQuery q = `SELECT id::text AS id, title, body, author_name AS "authorName",
        to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt", pinned
        FROM notes WHERE id = ${id}::uuid`;
    Note|sql:Error row = db->queryRow(q);
    if row is sql:NoRowsError {
        return ();
    }
    return row;
}

function insertNote(string id, string title, string noteBody, string authorId, string authorName) returns Note|error {
    postgresql:Client db = check getReadyDb();
    sql:ParameterizedQuery q = `INSERT INTO notes (id, title, body, author_id, author_name, pinned)
        VALUES (${id}::uuid, ${title}, ${noteBody}, ${authorId}, ${authorName}, FALSE)
        RETURNING id::text AS id, title, body, author_name AS "authorName",
        to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt", pinned`;
    return db->queryRow(q);
}
