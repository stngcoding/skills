# Visual Fidelity Reference

Exact extraction-and-reproduction rules for the properties that naive Figma→code conversions get wrong. The code preview from `get_design_context` approximates these by snapping them onto Tailwind's scale — so for anything in this file, recover the real Figma value and reproduce it deliberately.

Every property below is written as **Figma value → CSS**. CSS is used as a common reference — translate into whatever idiom your project actually uses; the *value* is what must be exact.

## Contents
- [How to read exact values out of Figma](#how-to-read-exact-values-out-of-figma)
- [Colors](#colors)
- [Borders / strokes](#borders--strokes)
- [Gradients](#gradients)
- [Shadows / effects](#shadows--effects)
- [Blur](#blur)
- [Opacity](#opacity)
- [Blend modes](#blend-modes)

---

## How to read exact values out of Figma

Three sources, in order of trust:

1. **`get_variable_defs`** — authoritative for any property bound to a variable. `radius/md: 12`, `stroke/card: rgba(46,242,255,0.24)`. Use these first.
2. **Arbitrary-value Tailwind brackets** in the code preview — exact, transcribe verbatim: `border-[1.5px]`, `border-[rgba(255,255,255,0.4)]` (the stroke color *and its alpha* — keep the `0.4`), `bg-[linear-gradient(135deg,#2EF2FF_0%,#C8EA80_100%)]`, `shadow-[0px_8px_24px_0px_rgba(0,0,0,0.4)]`, `rounded-[20px]`. Underscores are spaces.
3. **The high-res screenshot** — tie-breaker for direction, glow, and "does this even have a border."

**Red-flag preset classes** mean precision was lost — do NOT transcribe them as-is; recover the real value from source 1 or 3:

| Preset you see | What it really hides |
|---|---|
| `border` (no bracket) | real stroke width (maybe 1.5 / 0.5) **and** stroke alignment |
| `shadow-sm/md/lg/xl` | the real offset/blur/spread/color — Tailwind presets are unrelated to the design |
| `bg-gradient-to-r/-br/...` | the real gradient angle (snapped to one of 8 directions) |
| `rounded-sm/md/lg/full` | the real corner radius (and whether corners differ) |
| `blur-sm/md/lg` | the real blur radius, and layer-blur vs backdrop-blur |
| `border-solid` + one color, or a flat `bg-[#hex]` | *bracketed* values are **exact** — transcribe them. Suspect a **gradient flattened to one color** only if the screenshot shows a sheen/falloff or a brighter edge; absent that, this is the real solid color, not an approximation to re-estimate |

---

## Colors

- **Never round a hex.** `#2EF2FF` is not `#2FF2FF`. Transcribe all 6 digits.
- **Figma fill opacity lives in the alpha channel.** A fill of `#000000` at 50% opacity is `rgba(0,0,0,0.5)`. CSS: `rgba(0,0,0,0.5)` or `#00000080`.
- **Map to the variable, not the hex.** If `get_variable_defs` says the fill is `text/primary`, use the project token that corresponds to `text/primary`, not the raw hex from the preview. The hex is a fallback for when no token exists — and when you use it, flag it to the user.
- **A flattened color is a trap.** When a layer has opacity AND sits on a colored background, the preview may show the *blended* result. Reproduce the layer's own color + opacity, not the blend, so it composites correctly over whatever is actually behind it.

---

## Borders / strokes

Five things must survive: **width, color (with its alpha), alignment, per-side/per-corner variation, and — only when the screenshot proves it — gradient paint.** Here is the trust order, because the failure people actually hit is *under*-reading exact values, not over-reading them: for a plain solid stroke the preview is **accurate** — a bracketed `border-[<w>px] border-[rgba(...)] border-solid` hands you the exact width and the exact color+alpha. What it reliably loses is **alignment** (always) and, for a *bare* `border` with no bracket, the **width**. Don't let the gradient-stroke subsection further down make you distrust a flat color that arrived in a bracket; that flat `rgba(...)` is the real stroke color unless the render shows a visible rim.

### Solid stroke — transcribe the bracket, don't estimate
The common case, and the one most often botched by under-reading. When the preview shows `border-[<w>px] border-[rgba(r,g,b,a)] border-solid`, every number is exact — copy them across without "improving" them.

**Worked example** (a real button): `border-[1.5px] border-[rgba(255,255,255,0.4)] border-solid`
→ width `1.5` (keep the fraction), color white, alpha `0.40`.
- CSS: `border: 1.5px solid rgba(255,255,255,0.4)`

Anti-patterns that produce "the border is wrong":
- Snapping `1.5` → `1` (or `2`). Keep fractional widths exactly.
- Mapping `rgba(255,255,255,0.4)` onto a solid token (`#FFFFFF` with no alpha) and **silently losing the alpha** — the stroke must stay 40% translucent.
- Rounding the alpha (`0.4`→`0.5`) or the hex (`#2EF2FF`→`#2FF2FF`).
- Re-deriving the alpha *from the screenshot*. You cannot tell `0.40` from `0.55` by eye on a render — the bracket already told you, so trust it. (Sibling button variants in the same set are 0.4 vs 0.55; nothing but the bracket distinguishes them.)

The screenshot answers only two stroke questions: **alignment**, and **is this secretly a gradient** — never a width/color/alpha the bracket already gave you exactly.

### Width
Exact px from the stroke weight — can be fractional (`1.5`, `0.5`). If the preview shows a bare `border` with no bracket, assume the width is wrong and recover it from the screenshot or variables.

### Stroke alignment (the silently-dropped one)
Figma strokes are **inside**, **center**, or **outside** the node's bounds. This changes both the visual size and how the border sits against fills/neighbors.

| Figma align | Meaning | CSS |
|---|---|---|
| **Inside** | stroke painted within bounds; box size unchanged | `box-sizing: border-box` + `border` |
| **Center** | stroke straddles edge: w/2 in, w/2 out; visual size = node + w | inflate element by `w/2` each side, or accept border-box and note the ≤½px diff |
| **Outside** | stroke entirely outside bounds; visual size = node + 2w; does not affect content box | `box-shadow: 0 0 0 {w}px {color}` (clean, no layout shift) or `outline: {w}px solid {color}` |

Getting this wrong is the classic "the card is 2px bigger / smaller than the design" bug.

### Per-side strokes
Figma lets each side have its own weight (e.g. a 1px bottom divider only).
- CSS: `border-bottom: 1px solid ...` (set only the sides that exist).

### Per-corner radius
When corners differ, you cannot use a single uniform radius.
- CSS: `border-radius: {tl} {tr} {br} {bl}` (clockwise from top-left).
- A fully-rounded pill is `border-radius: 9999px` — not a named preset like `rounded-full` without confirming the value.

### Dashed / dotted strokes
Figma exposes a `dashPattern` (e.g. `[6, 4]` = 6px dash, 4px gap).
- CSS: `border-style: dashed` only approximates (no length control). For exact dash/gap, use an SVG `stroke-dasharray="6 4"` or a `background` with a repeating gradient.

### Gradient strokes
A stroke whose paint is a gradient (common on glassmorphic / neumorphic buttons and cards — the subtle bright-edge "rim light").

**First, don't reach for this unless the screenshot earns it.** A bracketed `border-[rgba(...)]` is a *solid* stroke by default; promote it to a gradient only when the render shows one edge clearly brighter than the others. Inventing a rim on a genuinely flat border is just as wrong as flattening a real one — and far more common to do by accident once you've read this section.

**Detection — the preview will lie to you here.** `get_design_context` flattens a gradient stroke to a single flat color and emits `border-[rgba(...)] border-solid`, with no hint that it's a gradient. The ONLY tell is the screenshot: if the border is visibly brighter on one edge than the others, it is a linear-gradient stroke, not a uniform border. Always zoom the screenshot on bordered surfaces before settling for a flat border.

**Reading the gradient (it is an estimate — say so).** The flat color the preview gives (say `rgba(255,255,255,0.4)`) is roughly the gradient's *average*, NOT one of its stops. The direction and the spread of the stops are only knowable from the screenshot:
- Read the direction from where the rim is brightest — top, bottom, a side, or a corner. Do not default to "bright at top"; a rim catching light from below is just as common.
- Keep the spread **gentle and centered on the reported average** (e.g. around `0.4`, use ~`0.3`→`0.5`, not `0.55`→`0.05`). A dramatic stop range overshoots and looks more wrong than the flat color did.
- Because the exact stops aren't recoverable from the API, flag to the user that you estimated them from the render, and confirm by eye against the screenshot.

Reproduce as a real gradient stroke (respect the alignment — these are almost always **inside**):
- CSS, double-background: `border: {w}px solid transparent; background: linear-gradient(<fill>) padding-box, linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.1)) border-box;` — the fill clips to padding-box, the stroke gradient fills the border-box ring.
- CSS, mask ring (when the element already has a separate fill layer): an overlay `inset:0` element with `padding:{w}px; background:<stroke-gradient> border-box;` and `mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;` — paints only the {w}px ring.

Never collapse a gradient stroke to `border: {w}px solid {flatColor}` — you lose the rim-light that defines the glassy look.

---

## Gradients

Get three things exact: **type, direction, and the full stop list** (each stop's color, alpha, and position).

### Stops
Every stop is `{color, position%}`. `linear-gradient(135deg, #2EF2FF 0%, #C8EA80 100%)` has two stops; a three-stop gradient must keep all three at their exact positions. Don't drop the middle stop or move positions to "round" numbers.

### Linear gradients — direction is the hard part

Transcribe the exact `linear-gradient(<angle>deg, <stops>)`. The only trap is a snapped `bg-gradient-to-r` preset: recover the real angle from the screenshot/handles instead of accepting one of the 8 cardinal directions.

CSS angle convention: `0deg` points **up**, increases **clockwise** (`90deg` = right, `180deg` = down, `270deg` = left).

### Radial gradients
- CSS: `radial-gradient(<shape> <size> at <x> <y>, <stops>)`. Match the center position and radius against the screenshot.

### Angular / conic (sweep) gradients
- CSS: `conic-gradient(from <angle> at <x> <y>, <stops>)`.

### Diamond gradients
No native CSS equivalent. Closest is a rotated radial; if precision matters, export the layer as an image instead of reconstructing it.

### Stacked / multiple fills
Figma layers multiple paints top-to-bottom. CSS: comma-separate `background` layers (first listed = topmost). Preserve order and each layer's opacity.

### Gradient on text
- CSS: `background: linear-gradient(...); -webkit-background-clip: text; color: transparent;`

---

## Shadows / effects

Figma effects are **drop shadow**, **inner shadow**, **layer blur**, and **background blur**. Each effect has x, y, blur, spread, color (with its own alpha). The preview frequently snaps shadows to `shadow-md`-style presets — those are meaningless; rebuild from the real values.

### Drop shadow
- CSS order is `x y blur spread color`: `box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.4)`.
- **Multiple shadows**: Figma stacks them; keep every one. CSS comma-separates multiple `box-shadow` values.

### Inner shadow
- CSS: `box-shadow: inset x y blur spread color`.
- Don't silently drop it; an inner shadow is often what gives a control its "pressed/inset" look. If the target stack has no native support, flag it to the user.

### Color + alpha
A shadow's alpha is part of the effect, separate from the layer's opacity. `rgba(0,0,0,0.4)` ≠ a black shadow at full strength. Keep the exact alpha.

---

## Blur

Distinguish the two — they look different and map to different APIs:

| Figma effect | What it blurs | CSS |
|---|---|---|
| **Layer blur** | the layer's own pixels | `filter: blur(Npx)` |
| **Background blur** | what's *behind* the layer (glassmorphism) | `backdrop-filter: blur(Npx)` |

Background blur usually needs a clip matching the card radius or it bleeds past the corners.

---

## Opacity

Three distinct things that the preview can conflate — apply each at the right level:

1. **Layer opacity** — the whole node (fills, strokes, children, shadows) fades together. CSS: `opacity: 0.5` on the element.
2. **Fill opacity** — only the fill fades; strokes and children stay solid. Apply alpha to the fill color only (`rgba(...,a)`), leaving the border/children at full strength.
3. **Color alpha** — opacity baked into a paint's color (see [Colors](#colors)).

Putting layer opacity where fill opacity belongs (or vice-versa) makes borders and text wrongly translucent. If a card's fill is 8% but its 1px border is 24%, those are two different alphas on two different paints — never one `opacity` on the wrapper.

---

## Blend modes

Figma layers can use `Multiply`, `Screen`, `Overlay`, `Color Dodge`, etc.
- CSS: `mix-blend-mode` (against siblings) or `background-blend-mode` (against own backgrounds).
- Reproduce the named mode rather than approximating with opacity — a `Screen`/`Color Dodge` glow looks wrong if faked with a translucent flat color.
