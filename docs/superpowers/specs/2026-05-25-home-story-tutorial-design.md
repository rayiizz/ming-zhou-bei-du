# Home Story Tutorial Design

## Goal

Add a polished homepage story-background presentation and an in-game tutorial entry for "明舟北渡", focused on the Yongle shipwreck investigation and the Grand Canal setting.

## User Choice

The selected direction is option A: a scroll-like static animation on the homepage, paired with a tutorial entrance. The visual style should stay historical and ancient, with the Grand Canal clearly present.

## Experience

On the homepage, players see a cinematic Grand Canal wharf image with subtle static-animation layers: mist, water shimmer, boat movement, and a scroll-style story beat panel. This establishes the story before the player chooses an event.

The homepage includes a "玩法教程" action. Opening it shows a dedicated tutorial screen that explains four core loops:

1. 问询人物
2. 出示证据
3. 案卷研判
4. 形成判断

The tutorial can return to the homepage or enter the playable shipwreck archive.

## Architecture

- Extend the top-level app view with a tutorial view.
- Keep the homepage responsible for event selection and tutorial entry only.
- Add a focused `GameTutorial` component for tutorial copy and navigation.
- Reuse the existing investigation flow and archive entry rather than creating a separate tutorial mode.

## Visual Direction

Use the newly generated Grand Canal wharf image as the homepage narrative backdrop. The UI should read as an ancient case scroll laid over a living canal scene, not a modern dashboard. Motion is CSS-only and subtle, with reduced-motion support from the existing stylesheet.

## Testing

Add app-level tests for:

- Homepage exposes the story background section and tutorial entry.
- Clicking the tutorial entry opens the tutorial content.
- The tutorial can enter the playable archive.
