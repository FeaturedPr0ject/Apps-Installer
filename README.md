# Games Installer

Static game catalog frontend for Vercel. The UI reads its entire catalog from `games.json`; no sample apps are bundled.

## Add a game

Add an object to the JSON array in `games.json`:

```json
[
  {
    "name": "Game name",
    "image": "https://example.com/icon.png",
    "download": "https://example.com/game-download",
    "about": "Short game description"
  }
]
```

Fields:
- `name`: app/game name
- `image`: absolute HTTP(S) image URL
- `download`: HTTP(S) download destination; the Download button opens this exact URL
- `about`: description displayed below the name

## Deploy

Import this repository into Vercel. No build command is required; use the repository root as the output directory.
