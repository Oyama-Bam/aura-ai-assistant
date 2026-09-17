# Aura AI Assistant

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant.

Create a frontend-only application. No backend, database, user accounts, authentication, or data storage. User inputs and AI outputs should only exist during the current session.

Core Features

1. Smart Email Generator

Generate professional workplace emails.

Fields: recipient/context, purpose, key points, and tone.

Tone options: Formal, Friendly, Persuasive.

Display the generated email in an editable text area.

Include Copy and Clear buttons.

2. AI Research Assistant

Allow users to enter a topic, question, or paste an article/website URL.

Provide:

Summary

Key Insights

Recommendations

Clearly handle invalid or unsupported URLs.

Make the output editable and easy to copy.

3. AI Workplace Chatbot

Clean conversational chat interface.

Users can ask workplace-related questions or general productivity questions.

Include suggested prompts such as:

"Help me write a professional email"

"Summarise this topic"

"Give me productivity tips"

Allow users to copy chatbot responses.

Design

Create a clean, premium and professional SaaS dashboard.

Luxury colour palette only: black, white, charcoal, cream, and subtle gold accents.

No bright or playful colours.

Modern typography, spacious layout, subtle borders and minimal shadows.

Responsive on desktop, tablet and mobile.

Layout

Left sidebar navigation with:

Dashboard

Email Generator

Research Assistant

AI Chat

Main content area with a professional dashboard.

Dashboard should show three feature cards linking to the main tools.

Include a simple welcome section and productivity-focused design.

UX Requirements

Clear structured AI prompts.

Loading states while generating responses.

Empty states and helpful error messages.

Editable AI outputs.

Copy-to-clipboard buttons.

Responsive navigation.

Do not store or save user data.

Responsible AI

Add a small disclaimer in the interface:

"AI-generated content may contain errors. Review and verify important information before using it. Do not enter confidential or sensitive information."

The final application should feel like a premium workplace AI productivity product, not a basic chatbot.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/36e9c26f-3c2a-460d-9d7a-c2163df6784d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
