# Layout Mapping

Figma auto-layout → layout primitives. CSS flex is used as reference — translate to your project's styling idiom. Use the project's spacing/size tokens for every numeric value (discover them in Step 2).

| Figma auto-layout | CSS (flex) |
|---|---|
| Vertical, gap N | `flex-direction: column; gap: N` |
| Horizontal, gap N | `flex-direction: row; gap: N` |
| Padding T/R/B/L | `padding: T R B L` |
| Symmetric padding | `padding: V H` |
| Fill container (along axis) | `flex: 1` |
| Hug contents | natural size (`width: fit-content` / `height: fit-content`) |
| Fixed size | `width: W; height: H` |
| Space between | `justify-content: space-between` |
| Center | `align-items: center; justify-content: center` |
| Align start | `align-items: flex-start` |
| Wrap | `flex-wrap: wrap` |
| Absolute position | `position: absolute; top: …; left: …` |
| Scrollable vertical | `overflow-y: auto` |
| Clip content | `overflow: hidden` |

## Sizing-mode gotcha
"Hug contents" means *no constraint* only when the parent allows it. Inside a stretch-aligned column (`align-items: stretch`), a "hug" child still stretches to full width. Match Figma's actual rendered size, not just the sizing-mode label.

## Order of operations per node
Decoration wraps content. Build inside-out: content → padding → decoration (fill/border/radius/gradient/shadow) → sizing → positioning. In CSS that's one element with `padding` + `background` + `border` + `box-shadow`. Apply the [visual-fidelity](visual-fidelity.md) rules at the decoration step.
