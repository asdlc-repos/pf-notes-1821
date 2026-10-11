import ballerina/os;

configurable string dbHost = os:getEnv("NOTES_DB_HOST");
configurable string dbPort = os:getEnv("NOTES_DB_PORT");
configurable string dbName = os:getEnv("NOTES_DB_DBNAME");
configurable string dbUser = os:getEnv("NOTES_DB_USER");
configurable string dbPassword = os:getEnv("NOTES_DB_PASSWORD");
