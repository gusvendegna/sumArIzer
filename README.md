# sumArIzer

#### A lightweight Node.js service that extracts and summarizes text content from URLs using modern LLM-based or heuristic summarization pipelines. Designed to be simple, fast, and easy to embed into other services or automation workflows.

## ✨ Features
- 🔗 Accepts raw URLs as input
- 🧠 Generates concise summaries of web content
- ⚡ Fast HTTP API (Node.js / TypeScript-ready)
- 🧩 Simple integration with bots, dashboards, and pipelines
- 🪶 Minimal dependencies and straightforward architecture
- 🔄 Easily extendable to swap summarization engines (LLM / extractive / hybrid)


## 📦 Installation
- `git clone https://github.com/gusvendegna/sumArIzer.git`
- `cd sumArIzer`
- `npm install`

## 🚀 Usage
Start the server: \
`npm run dev`

or \
`npm start`

Server will typically run on:

`http://localhost:3000` \
`API: Summarize a URL
Request
POST /summarize
Content-Type: application/json
{
  "url": "https://example.com/article"
}
Response
{
  "url": "https://example.com/article",
  "summary": "A concise summary of the article content.",
  "success": true
}`


## 🧠 How it works
Fetches HTML content from the provided URL \
Extracts readable text (removing boilerplate / markup) \
Passes cleaned text into a summarization pipeline \
Returns a condensed summary response via HTTP API
## 🧱 Flow

`Client → Express API → HTML Fetcher → Text Extractor → Summarizer → Response`

## 🔧 Configuration

You can configure behavior via environment variables:

## 🛠 Tech Stack
- Node.js (Hono)
- TypeScript
- Ollama

## Artificial Intelligence Disclaimer
There was very minimal use of AI during development of this project. I asked ChatGPT about concepts that I don't remember, but every single line of code was written from the dome or copied & pasted from a doc page. 

AI was, however used for:
- This README.md
- Refining the prompts for summarization and severity classification (slop in, slop out!)

That's it.


## 📄 License
MIT