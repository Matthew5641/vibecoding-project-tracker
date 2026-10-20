# Vibecoding Project Tracker — Design

**Status:** Complete · tagged `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

A calm, focused studio desk at night: quiet warm surfaces, one confident indigo, and colour that only speaks up when something needs you.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- [Linear](https://linear.app) — restrained palette, crisp type, colour used as signal not decoration.
- [Things 3](https://culturedcode.com/things/) — warm whitespace and a sense of calm progress.
- [Raycast](https://www.raycast.com) — monospace details that make it feel like a maker's tool.

Anti-references — what we are explicitly **not** trying to look like:

- Jira — dense, grey, enterprise. Also not default-Tailwind-blue Kanban tutorials.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#4F46E5` | Header, "+" button, focus rings |
| `brand-accent` | `#BE185D` | Highlights, hover states, links |
| `surface-page` | `#F7F6F3` | Page background |
| `surface-card` | `#FFFFFF` | Card background |
| `text-primary` | `#1C1B22` | Body text |
| `text-muted` | `#5F5C6B` | Captions, dates, counts |
| `border-input` | `#86828F` | Form field borders (3:1 minimum for UI components) |
| `border-subtle` | `#E7E5E4` | Decorative card/column borders only — never the only edge of an interactive control |

> In `tailwind.config.js` the text tokens are named `ink-primary` / `ink-muted` (so the class reads `text-ink-muted`, not `text-text-muted`), and borders are `line-input` / `line-subtle`. Tints: `bg-feature-tint`, `bg-due-warning-tint`, etc. Fonts: `font-heading`, `font-sans` (default), `font-mono`.
>
> All tokens are CSS variables in `src/index.css` with a light and a dark value, so classes switch theme on their own. Text on a solid fill (buttons, avatars, toast) uses `text-ink-on-fill`, which is white in light mode and near-black in dark mode. Never hard-code `text-white`.

### Dark mode (M12 `secret-sauce`)

Toggled by the sun / moon switch in the header; defaults to the OS setting until the user chooses. In dark mode the solid colours become lighter so they still read as text on dark surfaces, and solid fills carry dark text.

| Token | Light | Dark |
|---|---|---|
| `brand-primary` | `#4F46E5` | `#A5A0FF` |
| `brand-accent` | `#BE185D` | `#F48FC4` |
| `surface-page` | `#F7F6F3` | `#131218` |
| `surface-card` | `#FFFFFF` | `#1E1D26` |
| `surface-column` | `#F2F1EE` | `#19181F` |
| `text-primary` (`ink-primary`) | `#1C1B22` | `#EDEBF2` |
| `text-muted` (`ink-muted`) | `#5F5C6B` | `#A9A6B5` |
| `ink-on-fill` | `#FFFFFF` | `#131218` |
| `border-input` (`line-input`) | `#86828F` | `#77738A` |
| `border-subtle` (`line-subtle`) | `#E7E5E4` | `#2E2C38` |
| `type-feature` / tint | `#0F766E` / `#F0FDFA` | `#2DD4BF` / `#122B29` |
| `type-bug` / tint | `#BE123C` / `#FFF1F2` | `#FB8DA0` / `#341A21` |
| `due-safe` / tint | `#1D4ED8` / `#EFF6FF` | `#86B8FF` / `#16233A` |
| `due-warning` / tint | `#B45309` / `#FFFBEB` | `#F7C04A` / `#2E2412` |
| `due-overdue` / tint | `#B91C1C` / `#FEF2F2` | `#FF8A8A` / `#361A1C` |
| `due-neutral` / tint | `#6B6560` / `#F5F5F4` | `#B4AFA8` / `#25242C` |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#0F766E` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#BE123C` | Cards tagged `bug` (accent stripe + icon) |
| `type-feature-tint` | `#F0FDFA` | Feature badge background |
| `type-bug-tint` | `#FFF1F2` | Bug badge background |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#1D4ED8` | More than 2 days out |
| `due-warning` | `#B45309` | Less than 24 hours |
| `due-overdue` | `#B91C1C` | Past due |
| `due-neutral` | `#6B6560` | Done (overrides date) |

Each due state also has a light **tint** for the card background; the solid colour above is used for the border, icon and label text.

| Tint token | Hex |
|---|---|
| `due-safe-tint` | `#EFF6FF` |
| `due-warning-tint` | `#FFFBEB` |
| `due-overdue-tint` | `#FEF2F2` |
| `due-neutral-tint` | `#F5F5F4` |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Space Grotesk | Geometric with a little quirk — feels like a maker's tool, not a bank. |
| Body | Inter | Extremely legible at 12–14 px, which is where card text lives. |
| Monospace (tags, badges, code) | JetBrains Mono | Nods to prompts and code; makes IDs, dates and tags scan as data. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted (12 px is the floor — nothing smaller anywhere)

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** White on the warm page, 1px stone border, rounded-lg; a 4px left stripe carries the type colour (always alongside a labelled badge), and a soft shadow appears on hover *and* keyboard focus.
- **Buttons:** Primary is solid brand-primary with white text, rounded-md, no gradient; secondary is a ghost button with a 1px `line-input` border (3:1); all buttons have a text label or `aria-label`, a visible focus ring, and are at least 40 px tall; destructive is only red inside the confirm step.
- **Modal:** Centered, max-w-lg, rounded-xl, text-primary backdrop at 40% opacity; Esc and backdrop-click close it, focus is trapped inside and returns to the opening card, and Save is always bottom-right.
- **Empty states:** Dashed border, muted text, one encouraging line — never sad, never an illustration.
- **Drag affordance (if used):** Status dropdown first (M5); if drag lands in M12, the card lifts with a shadow and the target column gets a brand-primary dashed outline.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | + New task |
| Empty column placeholder | Nothing here yet — your next idea goes here. |
| Toast after "Copy as Prompt Context" | Context copied — paste it into your AI and keep vibing. |
| Confirm-delete message | Delete this task for good? This can't be undone. |
| Handoff toast (M7 `task-owner`) | Handed off to {name}. They've got it from here. |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** Intent to Ship (team: Team Matthew)
- **Wordmark style:** "Intent → Ship" in Space Grotesk semibold, text-primary, with the arrow in brand-primary. No icon.

## 7. Accessibility

Target: **WCAG 2.2 AA**. These rules are not optional for any milestone.

**Contrast (checked).** Every solid colour in §2 reaches **≥ 4.5:1** against `surface-card`, `surface-page` *and* its own tint, so any of them can be used for text, icons or borders. `text-primary` is 15.6:1+, white on `brand-primary` is 6.3:1, and `border-input` is 3.5:1 on white. If you change a hex value, re-check it at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/).

| Pair | Ratio |
|---|---|
| `text-primary` on `surface-page` | 15.8 : 1 |
| `text-muted` on `surface-page` | 6.0 : 1 |
| white on `brand-primary` | 6.3 : 1 |
| `brand-accent` on `surface-page` | 5.6 : 1 |
| `type-feature` / `type-bug` on white | 5.5 / 6.3 : 1 |
| `due-safe` / `warning` / `overdue` / `neutral` on own tint | 6.2 / 4.8 / 5.9 / 5.3 : 1 |

**Dark mode contrast (checked).** Every dark solid colour is **≥ 7:1** on `surface-card`, `surface-page`, `surface-column` and its own tint; `text-muted` is ≥ 6.3:1 on every surface and tint; `ink-on-fill` is ≥ 8:1 on every fill; `border-input` is 3.7:1 on cards. `color-scheme: dark` makes native date pickers, selects and scrollbars follow the theme.

**Automated check.** axe-core (WCAG 2.2 AA + best practice) reports **0 violations** on the board and the open modal, in both themes.

**Theme toggle.** One `<button aria-pressed>` labelled "Dark mode", so screen readers announce it as a toggle that is pressed or not pressed. Both the sun and moon icons are always visible, with the active one on a filled knob, so the state never depends on colour alone. The saved theme is applied in `index.html` before first paint, so there's no white flash.

**Never colour alone (WCAG 1.4.1).** Red/green and amber/red pairs are hard to tell apart for colour-blind users, so every colour signal is paired with text and an icon:
- Feature / bug: a badge with the word ("Feature" / "Bug") plus a Lucide icon (`sparkles` / `bug`), as well as the coloured stripe.
- Due states: a text label plus an icon — `calendar` "Due 24 Oct", `clock` "Due in 5 h", `alert-triangle` "Overdue 2 d", `check` "Done".
- Anchor status dots (M11): the dot is paired with the text "Linked" / "No link yet".

**Keyboard.** Everything works without a mouse. Cards are `<button>`s (or have `tabIndex=0` + Enter/Space). The modal traps focus, starts on the first field, closes on Esc, and returns focus to the card that opened it. If drag-and-drop arrives in M12, the status dropdown stays as the keyboard alternative.

**Focus.** Visible focus ring on every interactive element: `focus-visible:ring-2 ring-brand-primary ring-offset-2` (5.8:1 against the page). Never `outline-none` without a replacement.

**Semantics & screen readers.**
- Columns are `<section aria-labelledby>` with an `<h2>`; the count is in the heading ("To Do · 3").
- The modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to its title.
- Every input has a visible `<label>` — placeholder text is never the only label.
- Icon-only buttons have an `aria-label` (e.g. "Copy context for *Fix nav*").
- Toasts render in an `aria-live="polite"` region so copy/handoff confirmations are announced.
- Assignee avatars show initials *and* carry the full name in `aria-label` / `title`.

**Target size.** Interactive targets at least 24 × 24 px (WCAG 2.5.8); primary buttons 40 px tall.

**Motion.** Only the 200 ms toast fade, wrapped in `motion-safe:`; `prefers-reduced-motion` users get no animation.

**Text.** Use `rem` sizes so browser zoom to 200 % works; the board reflows to a single column under 640 px instead of scrolling sideways.

## 8. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- Multiple themes beyond light / dark. One brand, applied consistently. *(Dark mode was added in M12 `secret-sauce` with its own checked palette, see §2.)*
- Animations beyond a 200 ms fade on toast notifications, *except* the M12 additions: drag lift, spark burst, counter roll, the 2 s shine across "Ship" (runs once on load and once per ship, never looping, per WCAG 2.2.2), the spotlight glow on deliverable cards, and the 300 ms tick draw-in. All are off under `prefers-reduced-motion`, and the React Bits-inspired ones (ShinyText, SpotlightCard, StatusMark, ClickSpark, Counter) are re-implemented without extra dependencies.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
