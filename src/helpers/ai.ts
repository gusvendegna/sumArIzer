import type { PushEvent } from "../types/event.ts";
import { Ollama } from "ollama";

export class AI {
  private ollama: Ollama;
  private model: string;

  constructor(model: string) {
    this.ollama = new Ollama({ host: "http://10.0.0.7:11434" });
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
    console.log(fullLlmInput);
    const response = await this.ask(fullLlmInput);
    console.log(response);
    return "";
  }

  async determineSeverity(event: PushEvent) {
    let isNormal = true;

    const fullLlmInput = determineSeverityPrompt + JSON.stringify(event);
    const response = await this.ask(fullLlmInput);
    if (response.includes("WARNING_EVENT")) {
      isNormal = false;
    }

    return {
      isNormal,
      response,
    };
  }
}

const summarizePrompt =
  `
  Your only purpose is to sumamrize the given events from various home server related sources.
  Be as concise as possible, focus on only noteworthy things, and keep your points short.
  Please use formatting such as larger text and lists where applicable.
  Here is a template for your response:

  Activity Summary ` +
  new Date().toLocaleString() +
  `

  <short blurb about OVERALL health status>

  Notable Events:
  - <list of events in highest to lowest severity (use your discretion). include date if relevant. do NOT make anything up>

  END OF TEMPLATE

  You may modify the template if needed, however your response needs to be relevant and professional.

  Here are the events:
  `;

const determineSeverityPrompt = `
  Your only purpose is to determine whether or not the following event is any sort of failure or warning.
  That is to say, take no action of this event appears to be normal operating procedure.

  If you determine that the event is NOT normal, then use the following template in your response:

  WARNING_EVENT

  <describe the event>

  END OF TEMPLATE

  you MUST have WARNING_EVENT in your response. If the event is normal, then you do not need to respond at all.

  Here is the event:
  `;
