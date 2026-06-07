import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createEventFromReq } from "./helpers/createEventFromReq.js";
import { openDb } from "./helpers/db.js";
import { AI } from "./helpers/ai.js";
import { sendDiscordMessage } from "./helpers/alert.js";
import { Cron } from "croner";
import 'dotenv/config'


const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
const MODEL = process.env.MODEL || "llama3.2:3b";


// open DB
const db = await openDb();

// run pending migrations
await db.migrate();

// init AI
const ai = new AI(MODEL);
const app = new Hono();

// TODO:
// 1. Configurable schedule for summary alerts

// endpoint to push events
app.post("/push", async (c) => {

  // format request into event type
  const formattedEvent = await createEventFromReq(c);

  // write event to Database
  await db.run(
    "INSERT INTO Event (message, dateTime, severity) VALUES (?, ?, ?)",
    formattedEvent.message,
    new Date().toLocaleString(),
    formattedEvent.severity,
  );

  // check with AI to see if we need to immediately alert on the current event
  const severityCheck = await ai.determineSeverity(formattedEvent);
  console.log(severityCheck)

  if (!severityCheck.isNormal) {
    await sendDiscordMessage(severityCheck.message, WEBHOOK_URL)
  }

  // done
  return c.json({ success: true });;
});



// web endpoint for getting summaries
app.get("/", async (c) => {
  const message = await computeSummary();
  return c.text(message);
});



// helper for generating summaries
async function computeSummary() {
  // TODO integrate with scheduler for time
  let events = await db.all(`
  SELECT * FROM Event
  WHERE dateTime >= datetime('now', '-24 hours')
`);
console.log(events)
  const message = await ai.summarize(events);
  await sendDiscordMessage(message, WEBHOOK_URL)
  return message
}



// init web server
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on all IPs on port ${info.port}`);
  },
);


// declare cronjob
new Cron('*/5 * * * *', async () => {
  await computeSummary();
})