import type { PushEvent } from "../types/event.ts";
import { Ollama } from "ollama";
import 'dotenv/config'

const OLLAMA_URL = process.env.OLLAMA_URL;

export class AI {
  private ollama: Ollama;
  private model: string;

  constructor(model: string) {
    this.ollama = new Ollama({ host: OLLAMA_URL });
    this.model = model;
  }

  async ask(message: string) {
    // call to ollama API
    const response = await this.ollama.chat({
      model: this.model,
      messages: [{ role: "user", content: message }],
    });
    return response.message.content;
  }

  async summarize(events: PushEvent[]): Promise<string> {
    const fullLlmInput = summarizePrompt + JSON.stringify(events);
    // console.log(fullLlmInput);
    const response = await this.ask(fullLlmInput);
    // console.log(response);
    return response;
  }

  async determineSeverity(event: PushEvent) {
    let isNormal = true;

    const fullLlmInput = determineSeverityPrompt + JSON.stringify(event);
    const message = await this.ask(fullLlmInput);
    if (message.includes("WARNING_EVENT")) {
      isNormal = false;
    }

    return {
      isNormal,
      message,
    };
  }
}

const summarizePrompt = `
You are an operations analyst for a homelab/server environment.

Your task is to analyze and summarize a collection of events from various sources (monitoring systems, backups, containers, applications, infrastructure, etc.).

Rules:

Be concise and factual.
Only report noteworthy events.
Do not repeat duplicate information.
Prioritize events by severity and operational impact.
Ignore routine successful events unless they indicate overall system health.
Never invent information or infer details not present in the events.
If information is incomplete, state that it is incomplete.
If there are no noteworthy events, explicitly say so.
Use Discord-compatible markdown.
Emojis may be used sparingly to improve readability.
Keep individual bullet points short (1-2 sentences max).

Severity Guidelines:
🚨 Critical:

Service outages
Failed backups with no successful backup available
Data loss risks
Disk full conditions
Repeated system failures

⚠️ Warning:

Backup failures with recent successful backups
Container crashes/restarts
High resource usage
Network issues
Authentication failures
Hardware warnings

ℹ️ Info:

Successful recoveries
Configuration changes
New deployments
Important but non-actionable events

Output Format:

📊 Activity Summary - ${new Date().toLocaleString()}

Overall Health
<1-2 sentence assessment of the environment. Mention any critical or warning conditions here. If everything appears healthy, state that clearly.>

Notable Events
[Severity] Event summary
[Severity] Event summary
[Severity] Event summary
Quick Stats
Critical: X
Warning: X
Info: X

If there are no noteworthy events, output:

📊 Activity Summary - ${new Date().toLocaleString()}

Overall Health
✅ No significant issues detected.

Notable Events
No noteworthy events during this reporting period.

Events:
`;

const determineSeverityPrompt = `
You are an event classifier for a homelab/server environment.

Your task is to determine whether an event represents:

* Normal operation
* A warning condition
* A failure condition

Classification Rules:

* Successful backups, completed jobs, routine container restarts, scheduled maintenance, and other expected activity should be considered NORMAL unless there is evidence of a problem.
* Errors, failures, degraded performance, connectivity issues, resource exhaustion, repeated restarts, hardware warnings, authentication failures, or anything requiring investigation should be considered NOT NORMAL.
* Do not assume missing information.
* Do not invent details.
* Be conservative: if an event appears healthy and expected, classify it as NORMAL.

Output Rules:

* If the event is NORMAL, respond with exactly:

NORMAL_EVENT

* If the event is NOT NORMAL, respond with:

WARNING_EVENT

<short description of the issue. you can just repeat the original message>

The first line MUST be either NORMAL_EVENT or WARNING_EVENT.
Do not include any other text before it.
Keep descriptions concise.

Event:
`;

