# Vylor Chat Integration — Workflow Guide

## What This Is

A standardized workflow for using Vylor Chat (chat.vylor.com) to review and generate corporate-approved content for youraginfo.com.

## Folder Structure

```
vylor/
  site-context.md     ← Paste into Vylor first. Tells it who you are,
                         what the site is, and the rules.
  prompts.md          ← Ready-to-use prompts for different review tasks.
  reviews/            ← Save Vylor's responses here for reference.
  README.md           ← This file.
```

## Quick Start

1. Open [chat.vylor.com](https://chat.vylor.com)
2. Start a new chat
3. Paste the contents of `site-context.md` as your first message
4. Pick the right prompt from `prompts.md` for your task
5. Paste your content and send
6. Save Vylor's response in `reviews/` with the date

## When to Use Vylor

| Task | Use Vylor? |
|------|-----------|
| New hybrid descriptions for the site | Yes |
| Reviewing existing plot tour observations | Yes |
| pH tolerance claims | Yes |
| Competitive positioning language | Yes |
| Yield data / numbers from test plots | No — numbers are numbers, don't change them |
| Farm program deadlines and links | No |
| Cost calculator data | No |
| Site layout, design, navigation changes | No — use Claude Code |

## The Two-Tool Workflow

- **Vylor Chat** = Content compliance. Makes sure what you say about hybrids is corporate-approved.
- **Claude Code** = Site building. Takes approved content and puts it on the site with proper formatting, styling, and structure.

**Flow:** Draft content → Vylor reviews → Kyle approves → Claude Code publishes
