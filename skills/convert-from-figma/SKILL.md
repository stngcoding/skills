---
name: convert-from-figma
description: Converts a Figma frame into pixel-perfect Flutter code by extracting design details via Figma MCP tools, discovering the project's design system, and building with existing shared widgets. Use this skill whenever the user provides a Figma URL and wants Flutter code, asks to "convert from Figma", "implement this design", "turn this Figma frame into Flutter", "implement this screen", "build this UI from Figma", or provides any figma.com/design URL alongside a Flutter project. Also trigger when the user says "pixel perfect" or "match the design exactly" with a Figma link. Do NOT use the figma:figma-implement-design skill — this skill replaces it for Flutter projects.
---

# convert-from-figma


## URL Parsing

Extract `fileKey` and `nodeId` from the URL:
- `https://figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId (e.g. `1-23` → `1:23`)
- Branch URLs: use `branchKey` as fileKey

## Workflow

Two things matter equally:
1. **Visual accuracy** — every spacing, color, and layout matches the Figma design
2. **Codebase integration** — use existing shared widgets, design tokens, and conventions

### Step 1 — Extract from Figma

**1a. Map the node tree:**
```
get_metadata(fileKey, nodeId, clientLanguages: "dart", clientFrameworks: "flutter")
```
Identify major sections and their child node IDs from the XML response.

**1b. Fetch design details per-section** (not the whole frame at once — prevents truncation):
```
get_design_context(fileKey, nodeId: "<section-nodeId>", clientLanguages: "dart", clientFrameworks: "flutter")
```
The response includes React+Tailwind reference code — treat as a structural reference for layout values, spacing, and hierarchy. Do not copy React/Tailwind syntax. For repeating patterns (list items), fetch one instance in detail.

**1c. Fetch Figma variables:**
```
get_variable_defs(fileKey, nodeId, clientLanguages: "dart", clientFrameworks: "flutter")
```
These are the design team's tokens — use them as the primary mapping source when available.

**1d. Take screenshots** at `maxDimension: 2048` — full frame + complex sections for pixel-reference during implementation.

### Step 2 — Explore the codebase

Discover the project's conventions before writing any code:

- **Design tokens**: Search for spacing constants, color scheme extensions, typography scales, border radius values. Common locations: `lib/**/theme/`, `lib/**/constants/`, `lib/**/design_system/`, or files containing "Spacing", "Colors", "Typography", "Radius" in their names.
- **Shared widgets**: List `lib/widgets/`, `lib/shared/`, and `lib/features/*/widgets/`. Read constructors to understand what each widget does and what parameters it accepts.
- **Similar screens**: Search for existing screens that implement similar designs — match their patterns for state management, imports, and widget composition.
- **Asset handling**: Find how existing code references icons and images (generated accessors, raw paths, etc.) and follow the same pattern.

**Build a reuse map** before coding:
```
Reusable widgets found:
- <SheetWidget> → use for bottom sheet container
- <ToggleWidget> → use for switches
- <DropdownWidget> → use for selectors
- <TappableWidget> → use for pressable elements

Design tokens:
- Spacing: <ProjectSpacing>.xx
- Colors: <ProjectColorScheme>.xx
- Typography: <ProjectTypography>.xx.weight
```

### Step 3 — Build blueprint and implement

**Before writing code**, document the layout structure with exact values from Figma:
```
Root: 375×812, padding 16, gap 12, vertical
├── Header: fill×hug, horizontal, space-between
│   ├── Title: 20px w700 — text-primary
│   └── Icon: 24×24
└── Card: fill×hug, padding 16, radius 12, bg elevated
```

Then implement node by node:
- Read `references/layout-mapping.md` for Figma→Flutter widget translation
- Use discovered tokens for every value (spacing, colors, typography, radius)
- Use shared widgets from your reuse map — don't rebuild what exists
- Download assets from `get_design_context` response URLs into the project's asset directories
- Match the project's file structure, import style, and patterns from similar screens

### Step 4 — Verify (loop until clean)

Run this checklist. If any item fails, fix and re-run until all pass:

- [ ] `dart analyze` (or project equivalent) returns no errors
- [ ] No raw `Color(...)` or `Color.fromARGB(...)` literals — use project color tokens
- [ ] No raw `EdgeInsets` numeric values — use project spacing tokens
- [ ] No raw `TextStyle` font sizes or weights — use project typography tokens
- [ ] No raw border radius values — use project radius tokens
- [ ] All shared widgets from the reuse map are actually used (not rebuilt from scratch)
- [ ] Every Figma value that has no matching project token is flagged to the user
- [ ] Screenshot comparison: take a screenshot of the running widget and compare against the Figma screenshot from Step 1

## Gotchas

- **get_design_context truncates on large frames.** Always call per-section using child node IDs from get_metadata — never on the root frame. If a section response still looks truncated, split into smaller sub-sections.
- **Figma line-height is absolute pixels; Flutter `TextStyle.height` is a multiplier.** Divide Figma's line-height by font size to get the Flutter value. Example: Figma `lineHeight: 24px` on `fontSize: 16` → `height: 1.5`.
- **Figma colors include opacity in the alpha channel.** A Figma fill `rgba(0, 0, 0, 0.5)` must map to `.withValues(alpha: 0.5)` on the project's color token, not a new `Color` literal.
- **Figma per-corner border radius doesn't map to `BorderRadius.circular()`.** When corners differ, use `BorderRadius.only(topLeft: Radius.circular(...), ...)`.
- **Figma shadows are on frames/shapes; Flutter shadows are in `BoxDecoration.boxShadow`.** Don't look for a Shadow widget — wrap in `DecoratedBox` or `Container` with `BoxDecoration`.
- **Figma component instances may have overridden properties.** The metadata for an instance can differ from its master component — always read the instance node, not the master.
- **Figma "Hug contents" means no constraint, but only when the parent allows it.** Inside a `Column` with `CrossAxisAlignment.stretch`, a "hug" child still stretches — match Figma's actual rendered size, not just the sizing mode label.
- **Figma strokes are inside, outside, or center-aligned.** Flutter `Border` is always inside. For outside strokes, increase the container size by stroke width or use a `DecoratedBox` wrapper with padding.
