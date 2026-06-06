import type { Context } from "hono/jsx";
import type { BlankEnv, BlankInput } from "hono/types";

export async function createEventFromReq(c: any) {
  let message = ""; 
  let severity = "UNKNOWN";
  // console.log(await c.req.text());
  try {
    message = await c.req.text();
  } catch (e) {
    try {
      const rawJSON = await c.req.json();
      message = JSON.stringify(rawJSON);
    } catch (e) {
      message = "Ignore. Unable to parse message";
      severity = "LOW";
    }
  }
  return {
    message,
    severity,
    dateTime: new Date(),
  };
}
