import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createEventFromReq } from "./helpers/createEventFromReq.js";
import { openDb } from "./helpers/db.js";

// open DB
const db = await openDb();

// attempt Migrations
await db.migrate();
await db.run(
  "INSERT INTO Event (message, dateTime, severity) VALUES (?, ?, ?)",
  "test",
  new Date(),
  "NORMAL",
);
const result = await db.all("SELECT * FROM Event");

console.log(result);
const app = new Hono();

// TODO:
// 1. Endpoint to write new events
// Event will just be a POST with any sort of body that is stringified and
// an optional header for severity
// 2. Database schema to track events
// 3. Configurable schedule for summary alerts
// 4. Alert immediately on negative events
//

app.post("/push", async (c) => {
  // format request into event type
  const formattedEvent = await createEventFromReq(c);
  console.log(formattedEvent);

  // write event to Database

  // check with AI to see if we need to immediately alert on the current event

  //done

  return;
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
