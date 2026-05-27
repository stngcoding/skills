# Figma-to-Flutter Layout Mapping

Translation rules for converting Figma auto-layout properties into Flutter widgets.

## Layout translation

| Figma auto-layout               | Flutter widget                                                          |
|----------------------------------|-------------------------------------------------------------------------|
| Vertical, gap N                  | `Column` + `SizedBox(height: N)` between children                       |
| Horizontal, gap N                | `Row` + `SizedBox(width: N)` between children                           |
| Padding top/right/bottom/left    | `Padding(padding: EdgeInsets.fromLTRB(...))`                            |
| Symmetric padding                | `EdgeInsets.symmetric(horizontal: ..., vertical: ...)`                  |
| Fill container (horizontal)      | `Expanded(child: ...)` inside `Row`                                     |
| Fill container (vertical)        | `Expanded(child: ...)` inside `Column`                                  |
| Hug contents                     | No constraint (natural size)                                            |
| Fixed size                       | `SizedBox(width: ..., height: ...)`                                     |
| Space between                    | `MainAxisAlignment.spaceBetween`                                        |
| Center                           | `MainAxisAlignment.center` / `CrossAxisAlignment.center`                |
| Alignment top-left               | `CrossAxisAlignment.start`                                              |
| Wrap                             | `Wrap(spacing: ..., runSpacing: ...)`                                   |
| Absolute positioning             | `Stack` + `Positioned(top:, left:, ...)`                                |
| Scrollable vertical              | `SingleChildScrollView(child: Column(...))`                             |

Use the project's spacing/size tokens for all numeric values — discover them in Step 2.
