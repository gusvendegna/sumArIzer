import sqlite3 from "sqlite3";
import { open } from "sqlite";
import 'dotenv/config'

const databasePath = process.env.NODE_ENV == "dev" ? "./database" :  "/data/database.db"

// you would have to import / invoke this in another file
export async function openDb() {
  return open({
    filename: databasePath,
    driver: sqlite3.Database,
  });
}
