# Vibecoding Project Tracker — PRD

**Status:** PRD Reviewed and Completed · Milestone 2 locked for solo execution.

---

## 1. Problem

Vibecoding teams have two recurring pains with large projects:

1. **They lose track of tasks.** Three teammates, a hundred small things, no shared view. Nothing tells them what state each task is actually in.
2. **They lose track of prompts.** The AI gave them working code two days ago but no one remembers the prompt that produced it. When they need to iterate, they start from scratch.

A spreadsheet doesn't solve this. A real project tool (Linear, Jira, Notion) is overkill, doesn't know about prompts, and takes hours to set up.

## 2. Target users

- **Primary:** the team members, for the remaining weeks of the summer semester.
- **Secondary:** future cohorts of vibecoders taking the same class.

We are designing the tool we ourselves will use. The pitch demo is also our first real user test.

## 3. Product overview

A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through four states.
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries the prompt context that produced it, so any teammate can click a button and copy the task + prompt history back into an AI chat to continue work.

## 4. Primary user flow

1. Open the Webapp. The board loads from local storage.
2. Click "+" to add a task. Fill in title, type, assignee, due date, prompt context.
3. Move the task across columns as you work.
4. When stuck, click "Copy as Prompt Context" on a task and paste it into Claude/ChatGPT/Cursor to continue.
5. Hand off a task to a teammate with one dropdown.
6. Drop final deliverable links into the Anchor Board as you produce them.

---

## 5. Functional Requirements (FR)

- **FR-1 (Kanban Board):** Display a 4-column board (**To Do**, **In Progress**, **Review**, **Done**) rendering task cards populated with title, type, assignee, and due date. Pre-populate 3–4 seed tasks on first load.
- **FR-2 (Task CRUD Modal):** Provide a `+` button to create tasks, card click to edit existing tasks, and task deletion. Include a status dropdown to transition tasks across columns.
- **FR-3 (Type Distinction):** Visually differentiate `feature` vs. `bug` tasks with distinct accent styling and icons.
- **FR-4 (Task Owner & Handoff):** Prominently display the task assignee badge/avatar, provide a "Hand off to..." dropdown to reassign tasks, and show visual confirmation toast.
- **FR-5 (Due-Date Urgency):** Dynamically color-code cards based on deadline proximity: Calm (>2 days), Warning (<24 hours), Alarm (past due), and Neutral (when completed in Done).
- **FR-6 (Task Context Field):** Provide a Markdown-supported Context textarea in the task modal to capture AI prompt briefings (Background, Constraints, Tried so far, Next steps), an AI tool selector (Claude, ChatGPT, Cursor, etc.), and auto-tracked `contextUpdatedAt` timestamp with relative time display.
- **FR-7 (Copy Context Button):** Provide a one-click "Copy Context" button on each card and modal that copies a clean, paste-ready markdown prompt briefing to the clipboard with confirmation toast.
- **FR-8 (Deliverable Anchor Board):** Render a top banner pinning 4 deliverables (**Presentation**, **Demo**, **Report**, **Documentation**) with URL inputs and dynamic link-status indicator dots.
- **FR-9 (Secret Sauce):** Incorporate a distinctive interaction feature (such as Kanban drag-and-drop, filter toggles, velocity stats, or prompt templates).

---

## 6. Non-Functional Requirements (NFR)

- **NFR-1 (Usability & UX):** Clean, distraction-free desktop interface optimized for Chrome/Chromium; instantaneous user feedback (<100ms response time) on copy actions, modal edits, and handoffs.
- **NFR-2 (Performance):** Fast initial load (<1 second) with zero server-side cold starts.
- **NFR-3 (Persistence & Reliability):** 100% client-side persistence via browser `localStorage`; zero data loss across page reloads and browser sessions.
- **NFR-4 (Architecture & Portability):** Built as a static single-page app (React + Vite + Tailwind CSS) with zero backend infrastructure requirements, ready for 1-click Vercel deployment.

---

## 7. Data Requirements (DR) & Data Model

Locked schemas stored in client-side `localStorage`:

```js
// A single vibecoding task (stored under key 'vibetracker.tasks')
Task = {
  id: string,                    // uuid or timestamp string
  title: string,
  description: string,
  type: 'feature' | 'bug',       // visual color coding
  status: 'todo' | 'in-progress' | 'review' | 'done',
  assignee: string,              // assignee name from §10
  dueDate: string | null,        // ISO date 'YYYY-MM-DD'
  createdDate: string,           // ISO date 'YYYY-MM-DD'

  // Prompt Context metadata:
  context: string,               // M9 context — curated briefing for the next AI / teammate
  contextTool: string | null,    // M9 context — 'Claude' | 'ChatGPT' | 'Cursor' | 'Lovable' | 'Replit' | 'Other'
  contextUpdatedAt: string|null, // M9 context — ISO timestamp set automatically on save
}

// Pinned deliverable slot (stored under key 'vibetracker.anchors')
Anchor = {
  id: 'presentation' | 'demo' | 'report' | 'documentation',
  label: string,                 // human-readable ('Presentation', 'Demo', etc.)
  url: string | null,            // the link pasted in
}
```

---

## 8. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (via Vite) | What the scaffold ships with. Don't migrate. |
| Styling | Tailwind | Already configured. Use utility classes; no separate CSS files. |
| State | React `useState` + a `useLocalStorage` hook | Simple, no library needed. |
| Persistence | **localStorage** | Zero infra. Pick this. Do not switch to a backend mid-hackathon. |
| Deploy | Vercel | One-click deploy from GitHub. |

> **Decision:** localStorage, not a shared backend. If you want a shared backend later, that's M14 — out of scope for the hackathon.

## 9. Stage names

Four columns, in this order, with these exact labels in the UI:

1. **To Do**
2. **In Progress**
3. **Review**
4. **Done**

## 10. Team

| Slot | Name | GitHub handle |
|---|---|---|
| Teammate A | Matthew Devon | Matthew5641 |
| Teammate B | N/A (Solo Project) | N/A |
| Teammate C | N/A (Solo Project) | N/A |

These names become the allowed values for `Task.assignee`. No auth — just a dropdown.

> Solo project: the team starts with just Matthew. Teammates can be added and removed in the app (the Team strip on the Board tab); everyone on the team appears in the Assignee and "Hand off to…" dropdowns.

## 11. Milestone ownership

| # | Tag | Title | Suggested owner | Final owner |
|---|---|---|---|---|
| 3 | `design-done` | Design system + voice (DESIGN.md) | **B** | Matthew Devon |
| 4 | `data-model` | Task model + board view | **A** | Matthew Devon |
| 5 | `crud-modal` | Add / edit / delete modal | **A** | Matthew Devon |
| 6 | `tag-style` | Feature / bug colors | **B** | Matthew Devon |
| 7 | `task-owner` | Owner indicator + handoff | **A** | Matthew Devon |
| 8 | `due-tint` | Due-date color tinting | **B** | Matthew Devon |
| 9 | `context` | Context field on the task modal | **C** | Matthew Devon |
| 10 | `copy-prompt` | "Copy as Prompt Context" button | **C** | Matthew Devon |
| 11 | `anchors` | Deliverable Anchor Board | **B** | Matthew Devon |
| 12 | `secret-sauce` | The one thing that makes it yours | **C / All** | Matthew Devon |
| 13 | `pitch-ready` | Demo + pitch rehearsal | **All** | Matthew Devon |

Track A owns the state model and task ownership. Track B owns the visuals (and design — M3 runs parallel to M2 so the team starts Phase 3 with the palette already chosen). Track C owns the differentiator features (M9 + M10 — the context field and the Copy-as-Prompt button) and usually leads on M12 secret-sauce. Put your strongest prompter on Track C.

## 12. AI / vibe coding angle

Where AI will be heavily used:
- M4, M5: scaffold the board and the modal from a single prompt each.
- M9, M10: write the Markdown serialization helper for the Context field.
- M7: animation polish for the handoff toast.

Where AI will **not** save you time:
- M2 (this PRD review) — read it yourself.
- M3 (DESIGN.md) — design taste is yours, not the model's.
- M12 (secret-sauce) — the whole point is that AI can't predict it.
- M13 (pitch) — write the script in your own voice.

Keep the Context field of each real task up to date as you work. By the end of the hackathon you should have a handful of curated context blocks — those become part of your Module 5 "Vibe Coding History" deliverable.

## 13. Team identity

- **Team name:** Team Matthew (Solo)
- **Tagline (one sentence):** A focused vibecoding project tracker taking UX ideas seamlessly from intent to ship.
- **Tracker URL after deploy:** https://vibecoding-project-tracker-matthew5641.vercel.app

## 14. Out of scope (do not build)

- Authentication / accounts.
- Real GitHub integration.
- A real backend / shared database.
- Mobile responsive — desktop only is fine.
- Multi-team support.
- Real-time collaboration.

## 15. Definition of done

The hackathon is "done" when all 13 milestone tags are pushed to your repo and visible on the dashboard. The pitch is "done" when:

- The board loads on Vercel without errors.
- The "Copy as Prompt Context" demo works on stage.
- 5 min pitch is rehearsed.

---

*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*
