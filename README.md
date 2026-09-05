# Rapid Trigger for GunZ — Revision 2.2

This folder contains the current original-informed GitHub Pages rework. It is a local
review candidate, not a live deployment. Upload its contents to the root of
`GunzInputLab/gunzinputlab.github.io` only after Hanz accepts the revised flow, the new
strings are translated, and native-language review is complete.

## Pages

- `index.html` — the current public tuning method
- `research-notebook.html` — the revised research history and evidence boundary
- `assets/site.css` — shared visual system and responsive layout
- `assets/site.js` — theme, language switching, navigation, calculator, and print behavior
- `assets/translations.js` — local Spanish, Brazilian Portuguese, Korean, Japanese, and Simplified Chinese translations
- `assets/revision-22-translations.js` — reserved translation additions for the new Revision 2.2 text
- `assets/rapid-trigger-cycle-tester.html` — the restored interactive tester from the original guide, aligned to the current starting checkpoint
- `.nojekyll` — keeps GitHub Pages in static-file mode

## Original-informed changes

- Restores `Rapid Trigger for GunZ` as the visible product identity.
- Restores the compact numbered chapter-navigation idea from the supplied public guide.
- Keeps the supplied notebook's research/history distinction while placing the final method first.
- Preserves the supplied HTML files unchanged under `6 - Files From Hanz` and the earlier rework under `9 - Archived Files`.
- Adds entry guidance for first-time readers, new GunZ players, veteran players, and keyboard enthusiasts.
- Restores profile history, repeated-symptom troubleshooting, a blank test record, and a point-of-use glossary to the notebook.
- Labels historical server results as keyboard checkpoints that predate the mouse-first verification gate.
- Restores the original Cycle Tester behavior, colored quick definitions, and a 22-entry permanent glossary.
- Rewrites the notebook workflow as short evidence bullets with `what`, `why`, and `passing evidence` summaries.

## Final method order

1. Read the method and define actuation, RT D, RT A, ON, OFF, and reversal.
2. Lock the GunZ client, resolution/aspect ratio, FOV, camera, crosshair, and input state.
3. Start from a familiar hardware DPI and verify standing tracking in cm/360.
4. Find a fixed actuation point that preserves normal typing.
5. Use the Cycle Tester, then tune RT D for release and RT A for reactivation pace.
6. Prove one familiar movement in controlled training.
7. Validate movement and aim in separate PvP passes.
8. Troubleshoot one repeated symptom, save the passing checkpoint, and retest over time.

## Important content boundary

- Resolution can change perceived motion and view geometry; it does not change hardware DPI.
- eDPI conversion is for the same GunZ input pipeline, not a universal cross-game conversion.
- Personal settings are documented checkpoints, not presets.
- The current cm/360 remains intentionally blank until it is re-measured with the revised protocol.
- Revision 2.1 translations are retained and complete Revision 2.2 drafts are included
  for Spanish, Brazilian Portuguese, Korean, Japanese, and Simplified Chinese. Spanish
  also powers the Peru and Venezuela selections. Every base dictionary contains every
  page key; fluent-language review is still required before public release.

## Package boundaries

`1 - Current Project\GunZ Input Lab - Revision 2.2 Multilingual Review.zip` contains
the current source and all structurally complete language drafts. It is a review
package, not a public release, until fluent-language review and Hanz's content
acceptance are complete.

The earlier `GunZ Input Lab - Revision 2.2 English Review.zip` remains a verified
English-only snapshot. Package checksums and extracted-package test results are
recorded outside the ZIP in `4 - QA and Verification` so a package never contains a
self-invalidating copy of its own checksum.

## Publish

Replace the repository-root files with this folder, commit the change, and let the existing GitHub Pages workflow publish it. No framework or build step is required.
