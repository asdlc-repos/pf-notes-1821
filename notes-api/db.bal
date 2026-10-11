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
