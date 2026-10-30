# Vylor Chat Prompt Templates

Standard prompts for reviewing and generating content for youraginfo.com. Paste the site context (site-context.md) into Vylor first, or upload it to your Library for persistent access.

---

## 1. Review Existing Hybrid Descriptions

Use when: You have field observations on the site and want Vylor to check for corporate compliance.

```
Review these field observations from my customer-facing website (youraginfo.com). These are my personal field notes from late-season plot tours — they are NOT presented as official Pioneer ratings.

Flag any language that:
- Could be mistaken for an official Pioneer claim or rating
- Conflicts with current Pioneer hybrid positioning
- Makes guarantees about yield, performance, or pest resistance
- Uses trait names incorrectly
- Could create liability issues

Suggest corporate-approved alternatives where needed. Keep the tone professional but practical — I'm talking to farmers, not writing a press release.

[PASTE DESCRIPTIONS HERE]
```

---

## 2. Generate New Hybrid Descriptions

Use when: You need Vylor to write a description for a hybrid you don't have notes on.

```
Write a brief field observation for [HYBRID NAME] that I can use on my customer website. I'm a Pioneer sales rep in Northeast Colorado (irrigated and dryland corn).

Keep it:
- 1-3 sentences
- Based on approved Pioneer positioning for this hybrid
- Focused on practical placement advice (where to put it, where to avoid it)
- Professional but conversational — like an experienced agronomist talking to a farmer
- Clear that this is a positioning recommendation, not a guarantee

Include: maturity, best environment, key strengths, any placement cautions.
```

---

## 3. Verify Trait and Positioning Claims

Use when: You want to double-check specific claims before publishing.

```
Verify these statements about [HYBRID NAME] for accuracy against current Pioneer positioning:

[PASTE STATEMENTS]

For each statement, tell me:
- APPROVED: Aligns with Pioneer positioning
- CAUTION: Partially accurate but could be misread
- FLAG: Should be reworded or removed
- UNKNOWN: Can't verify — check with your DSM

Include the approved alternative for any CAUTION or FLAG items.
```

---

## 4. pH Tolerance Review

Use when: Reviewing pH-specific observations (common in NE Colorado).

```
Review these pH tolerance observations for my customer website. High pH is a major placement factor in my territory (Yuma County, CO).

For each hybrid, confirm whether my pH assessment aligns with Pioneer's positioning data. If I'm rating something as "excellent pH tolerance" or "avoid pH," make sure that matches what Pioneer's data supports.

[PASTE pH OBSERVATIONS]
```

---

## 5. Competitive Positioning Check

Use when: Any content references competition or comparative claims.

```
Review this content for competitive positioning compliance. Flag anything that:
- Names a competitor's product directly
- Makes comparative yield claims that aren't supported by published data
- Could be seen as disparaging another brand
- Overstates Pioneer's advantage beyond what data supports

Suggest compliant alternatives that still communicate the competitive message.

[PASTE CONTENT]
```

---

## 6. New Page Content Review

Use when: Adding a new page to the site (sorghum, soybeans, technology, etc.).

```
Review this draft page content for youraginfo.com. It will be on a customer-facing page accessible after member login.

Check for:
- Accuracy of product information and trait descriptions
- Compliance with Pioneer brand guidelines
- Any claims that need data citations or disclaimers
- Appropriate tone (professional, practical, not over-promising)

[PASTE PAGE CONTENT]
```

---

## Tips

- **Paste site-context.md first** in a new Vylor chat before using any prompt. This gives Vylor the full picture of who you are and what the site is.
- **Upload to Library** if Vylor supports it — then the context persists across chats.
- **Run the review before publishing** — it takes 2 minutes and catches things that could create problems.
- **Save Vylor's responses** in the `vylor/reviews/` folder for reference.
